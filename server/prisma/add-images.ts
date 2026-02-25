import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryImages: Record<string, string[]> = {
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584990347449-a3f8e5a16b39?w=600&h=600&fit=crop',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&h=600&fit=crop',
  ],
  living: [
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
  ],
  storage: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620389724546-5f27bd1d4a5c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=600&fit=crop',
  ],
  laundry: [
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=600&h=600&fit=crop',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558171013-50ed8a62b618?w=600&h=600&fit=crop',
  ],
};

async function main() {
  console.log('🖼️  Adding images to existing products...');

  // Get all products with their categories
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true
    }
  });

  for (const product of products) {
    // Skip if product already has images
    if (product.images.length > 0) {
      console.log(`⏭️  Skipping ${product.name} - already has images`);
      continue;
    }

    const categorySlug = product.category?.slug || 'kitchen';
    const images = categoryImages[categorySlug] || categoryImages.kitchen;
    const randomIndex = Math.floor(Math.random() * images.length);

    await prisma.productImage.createMany({
      data: [
        { productId: product.id, url: images[randomIndex], alt: product.name, sortOrder: 0 },
        { productId: product.id, url: images[(randomIndex + 1) % images.length], alt: `${product.name} - Detail`, sortOrder: 1 }
      ]
    });

    console.log(`✅ Added images to ${product.name}`);
  }

  console.log('🎉 Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
