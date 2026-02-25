import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
const router = Router();
// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);
// Dashboard stats
router.get('/stats', async (_req, res, next) => {
    try {
        const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, topProducts] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { paymentStatus: 'PAID' }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    _count: { select: { items: true } }
                }
            }),
            prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })
        ]);
        // Get product details for top products
        const topProductIds = topProducts.map(p => p.productId);
        const topProductDetails = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            include: { images: { take: 1 } }
        });
        const topProductsWithDetails = topProducts.map(p => ({
            ...topProductDetails.find(pd => pd.id === p.productId),
            totalSold: p._sum.quantity
        }));
        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue._sum.total || 0,
            recentOrders,
            topProducts: topProductsWithDetails
        });
    }
    catch (error) {
        next(error);
    }
});
// Products Management
const productSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    compareAtPrice: z.number().positive().optional(),
    sku: z.string().min(1),
    stock: z.number().int().min(0).default(100),
    categoryId: z.string(),
    badge: z.string().optional(),
    materials: z.string().optional(),
    leadTime: z.string().optional(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true)
});
router.get('/products', async (req, res, next) => {
    try {
        const { page = '1', limit = '20', search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = search ? {
            OR: [
                { name: { contains: search } },
                { sku: { contains: search } }
            ]
        } : {};
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { name: true, slug: true } },
                    images: { take: 1, orderBy: { sortOrder: 'asc' } },
                    _count: { select: { orderItems: true, reviews: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip
            }),
            prisma.product.count({ where })
        ]);
        res.json({ products, total, page: parseInt(page), limit: parseInt(limit) });
    }
    catch (error) {
        next(error);
    }
});
router.post('/products', async (req, res, next) => {
    try {
        const data = productSchema.parse(req.body);
        const product = await prisma.product.create({
            data,
            include: { category: true }
        });
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
});
router.put('/products/:id', async (req, res, next) => {
    try {
        const data = productSchema.partial().parse(req.body);
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data,
            include: { category: true }
        });
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/products/:id', async (req, res, next) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        next(error);
    }
});
// Categories Management
router.get('/categories', async (_req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
});
router.post('/categories', async (req, res, next) => {
    try {
        const { name, slug, description, icon, sortOrder } = req.body;
        const category = await prisma.category.create({
            data: { name, slug, description, icon, sortOrder: sortOrder || 0 }
        });
        res.status(201).json(category);
    }
    catch (error) {
        next(error);
    }
});
router.put('/categories/:id', async (req, res, next) => {
    try {
        const { name, slug, description, icon, sortOrder } = req.body;
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { name, slug, description, icon, sortOrder }
        });
        res.json(category);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/categories/:id', async (req, res, next) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'Category deleted' });
    }
    catch (error) {
        next(error);
    }
});
// Orders Management
router.get('/orders', async (req, res, next) => {
    try {
        const { page = '1', limit = '20', status = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = status ? { status: status } : {};
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    items: {
                        include: {
                            product: { include: { images: { take: 1 } } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip
            }),
            prisma.order.count({ where })
        ]);
        res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
    }
    catch (error) {
        next(error);
    }
});
router.put('/orders/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(order);
    }
    catch (error) {
        next(error);
    }
});
// Users Management
router.get('/users', async (req, res, next) => {
    try {
        const { page = '1', limit = '20', search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = search ? {
            OR: [
                { email: { contains: search } },
                { firstName: { contains: search } },
                { lastName: { contains: search } }
            ]
        } : {};
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    createdAt: true,
                    _count: { select: { orders: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip
            }),
            prisma.user.count({ where })
        ]);
        res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=admin.js.map