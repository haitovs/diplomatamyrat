import { Router } from 'express';
import prisma from '../lib/prisma.js';
const router = Router();
// Get all products with filters
router.get('/', async (req, res, next) => {
    try {
        const { category, search, featured, minPrice, maxPrice, sort = 'createdAt', order = 'desc', limit = '20', offset = '0' } = req.query;
        const where = { isActive: true };
        if (category) {
            where.category = { slug: category };
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        const orderBy = {};
        const sortField = sort;
        orderBy[sortField] = order;
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    images: { orderBy: { sortOrder: 'asc' } }
                },
                orderBy,
                take: parseInt(limit),
                skip: parseInt(offset)
            }),
            prisma.product.count({ where })
        ]);
        res.json({
            products,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    }
    catch (error) {
        next(error);
    }
});
// Get featured products
router.get('/featured', async (_req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                images: { orderBy: { sortOrder: 'asc' }, take: 1 }
            },
            take: 8
        });
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
// Get product by slug
router.get('/:slug', async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug },
            include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
                highlights: { orderBy: { sortOrder: 'asc' } },
                reviews: {
                    include: {
                        user: { select: { firstName: true, lastName: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
// Get related products
router.get('/:slug/related', async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug },
            select: { id: true, categoryId: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const related = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                isActive: true
            },
            include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 }
            },
            take: 4
        });
        res.json(related);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=products.js.map