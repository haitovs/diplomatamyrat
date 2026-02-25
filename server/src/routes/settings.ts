import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const updateSettingsSchema = z.object({
  storeName: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  logoUrl: z.string().nullable().optional(),
  faviconUrl: z.string().nullable().optional(),
  orderNotifications: z.boolean().optional(),
  lowStockAlerts: z.boolean().optional(),
  newsletterSignups: z.boolean().optional(),
});

// Get settings (public - anyone can view store settings)
router.get('/', async (req, res, next) => {
  try {
    // Get or create settings (singleton pattern)
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: {}
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// Update settings (admin only)
router.put('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = updateSettingsSchema.parse(req.body);
    
    // Get existing settings or create new one
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      // Create new settings with the provided data
      settings = await prisma.settings.create({
        data: data as any
      });
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;
