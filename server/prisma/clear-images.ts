import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearImages() {
  console.log('Clearing all product images...');
  
  const result = await prisma.productImage.deleteMany();
  
  console.log(`✅ Deleted ${result.count} product images`);
  console.log('You can now upload new images through the admin panel.');
}

clearImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
