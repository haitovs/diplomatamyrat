import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to project root (atamyrat-ecommerce-good) and then to uploads
// From server/src/routes/, we go up to project root: ../../..
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const uploadsDir = path.join(projectRoot, 'uploads', 'products');

console.log('Upload directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Upload single image for a product
router.post('/products/:productId/images', upload.single('image'), async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { alt, sortOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create image record
    const image = await prisma.productImage.create({
      data: {
        productId,
        url: `/uploads/products/${req.file.filename}`,
        alt: alt || product.name,
        sortOrder: parseInt(sortOrder) || 0
      }
    });

    res.status(201).json(image);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }
    next(error);
  }
});

// Upload multiple images for a product
router.post('/products/:productId/images/batch', upload.array('images', 10), async (req, res, next) => {
  try {
    const { productId } = req.params;
    const files = req.files as Express.Multer.File[];

    // Debug logging
    console.log('Upload request received for product:', productId);
    console.log('Files received:', files ? files.length : 0);
    console.log('Request body:', req.body);

    if (!files || files.length === 0) {
      console.error('No files received - files:', files);
      return res.status(400).json({ 
        error: 'No image files provided',
        debug: {
          filesReceived: !!files,
          filesLength: files?.length || 0
        }
      });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      // Delete uploaded files
      files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch {}
      });
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get current max sort order
    const maxSortOrder = await prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true }
    });
    let sortOrder = (maxSortOrder._max.sortOrder || 0) + 1;

    // Create image records
    const images = await Promise.all(
      files.map(async (file, index) => {
        return prisma.productImage.create({
          data: {
            productId,
            url: `/uploads/products/${file.filename}`,
            alt: `${product.name} - Image ${sortOrder + index}`,
            sortOrder: sortOrder + index
          }
        });
      })
    );

    console.log('Successfully uploaded', images.length, 'images');
    res.status(201).json(images);
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up uploaded files on error
    const files = req.files as Express.Multer.File[];
    if (files) {
      files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch {}
      });
    }
    next(error);
  }
});

// Get all images for a product
router.get('/products/:productId/images', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(images);
  } catch (error) {
    next(error);
  }
});

// Delete an image
router.delete('/images/:imageId', async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from disk
    const filePath = path.join(projectRoot, image.url);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {}

    // Delete from database
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
});

// Update image order
router.patch('/images/:imageId', async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const { sortOrder, alt } = req.body;

    const image = await prisma.productImage.update({
      where: { id: imageId },
      data: {
        ...(sortOrder !== undefined && { sortOrder }),
        ...(alt !== undefined && { alt })
      }
    });

    res.json(image);
  } catch (error) {
    next(error);
  }
});

// Set primary image (sortOrder = 0)
router.post('/products/:productId/images/:imageId/primary', async (req, res, next) => {
  try {
    const { productId, imageId } = req.params;

    // Reset all images for this product to have sortOrder >= 1
    await prisma.productImage.updateMany({
      where: { productId },
      data: { sortOrder: { increment: 1 } }
    });

    // Set the selected image as primary (sortOrder = 0)
    const image = await prisma.productImage.update({
      where: { id: imageId },
      data: { sortOrder: 0 }
    });

    res.json(image);
  } catch (error) {
    next(error);
  }
});

export default router;
