import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { generateToken } from '../lib/jwt.js';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional()
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
// Register new user
router.post('/register', async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                cart: { create: {} }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        res.status(201).json({ user, token });
    }
    catch (error) {
        next(error);
    }
});
// Login
router.post('/login', async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        next(error);
    }
});
// Get current user
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=auth.js.map