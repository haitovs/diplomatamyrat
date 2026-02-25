import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, PNG, WebP) are allowed'));
  },
});

// Upload multiple images for a product
router.post('/products/:productId/images', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get current max sortOrder
    const maxOrder = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const startOrder = (maxOrder?.sortOrder ?? -1) + 1;

    // Check if product has any images
    const existingCount = await prisma.productImage.count({
      where: { productId },
    });

    // Create image records
    const imageRecords = await Promise.all(
      files.map((file, index) =>
        prisma.productImage.create({
          data: {
            productId,
            url: `/uploads/products/${file.filename}`,
            alt: `Product image ${startOrder + index + 1}`,
            sortOrder: startOrder + index,
            isPrimary: existingCount === 0 && index === 0, // First image of product is primary
          },
        })
      )
    );

    res.json({ images: imageRecords });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Reorder images
router.patch('/products/:productId/images/reorder', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { imageIds } = req.body as { imageIds: string[] };

    if (!Array.isArray(imageIds)) {
      return res.status(400).json({ error: 'imageIds must be an array' });
    }

    // Update sortOrder for each image
    await Promise.all(
      imageIds.map((id: string, index: number) =>
        prisma.productImage.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
});

// Set primary image
router.patch('/products/:productId/images/:imageId/primary', async (req: Request, res: Response) => {
  try {
    const { productId, imageId } = req.params;

    // Remove primary from all images
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });

    // Set new primary
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Set primary error:', error);
    res.status(500).json({ error: 'Failed to set primary image' });
  }
});

// Delete image
router.delete('/images/:imageId', async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filepath = path.join(__dirname, '../..', image.url);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete from database
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
