import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
  variant: z.string().optional()
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0)
});

// Get user's cart
router.get('/', authenticate, async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 }
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' }, take: 1 }
                }
              }
            }
          }
        }
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const shipping = subtotal >= 75 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    res.json({
      ...cart,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100
    });
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/items', authenticate, async (req, res, next) => {
  try {
    const data = addItemSchema.parse(req.body);
    
    // Ensure cart exists
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.userId }
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variant: {
          cartId: cart.id,
          productId: data.productId,
          variant: data.variant || null
        }
      }
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity }
      });
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          variant: data.variant
        }
      });
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.patch('/items/:itemId', authenticate, async (req, res, next) => {
  try {
    const data = updateItemSchema.parse(req.body);
    
    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: { cart: true }
    });

    if (!item || item.cart.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (data.quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: req.params.itemId }
      });
      return res.json({ message: 'Item removed from cart' });
    }

    await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: data.quantity }
    });

    res.json({ message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/items/:itemId', authenticate, async (req, res, next) => {
  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: { cart: true }
    });

    if (!item || item.cart.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: req.params.itemId }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', authenticate, async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;
