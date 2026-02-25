import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get user's favorites
router.get('/', authenticate, async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { sortOrder: 'asc' }, take: 1 }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(favorites.map(f => f.product));
  } catch (error) {
    next(error);
  }
});

// Add to favorites
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId
        }
      },
      create: {
        userId: req.user!.userId,
        productId
      },
      update: {}
    });

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    next(error);
  }
});

// Remove from favorites
router.delete('/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.userId,
        productId: req.params.productId
      }
    });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
});

// Check if product is favorited
router.get('/check/:productId', authenticate, async (req, res, next) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId: req.params.productId
        }
      }
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    next(error);
  }
});

export default router;
