import { Router } from 'express';
import prisma from '../lib/prisma.js';
const router = Router();
// Get all categories
router.get('/', async (_req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
});
// Get category by slug with products
router.get('/:slug', async (req, res, next) => {
    try {
        const category = await prisma.category.findUnique({
            where: { slug: req.params.slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=categories.js.map