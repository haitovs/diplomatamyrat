import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
const orderSchema = z.object({
    shippingAddress: z.object({
        firstName: z.string(),
        lastName: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string().optional(),
        postalCode: z.string(),
        country: z.string().default('Turkmenistan'),
        phone: z.string()
    }),
    paymentMethod: z.string().default('card'),
    notes: z.string().optional()
});
// Get user's orders
router.get('/', authenticate, async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
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
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
});
// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            },
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
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        next(error);
    }
});
// Create order from cart
router.post('/', authenticate, async (req, res, next) => {
    try {
        const data = orderSchema.parse(req.body);
        // Get user's cart with items
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const shippingCost = subtotal >= 75 ? 0 : 9.99;
        const total = subtotal + tax + shippingCost;
        // Generate order number
        const orderNumber = `HH-${Date.now().toString(36).toUpperCase()}`;
        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: req.user.userId,
                subtotal: Math.round(subtotal * 100) / 100,
                tax: Math.round(tax * 100) / 100,
                shippingCost,
                total: Math.round(total * 100) / 100,
                shippingAddress: JSON.stringify(data.shippingAddress),
                paymentMethod: data.paymentMethod,
                paymentStatus: 'PAID', // Simulated payment
                status: 'CONFIRMED',
                notes: data.notes,
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        variant: item.variant
                    }))
                }
            },
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
        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        res.status(201).json(order);
    }
    catch (error) {
        next(error);
    }
});
// Cancel order
router.patch('/:id/cancel', authenticate, async (req, res, next) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }
        const updated = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: 'CANCELLED' }
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=orders.js.map