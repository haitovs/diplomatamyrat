import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const USD_TO_TMT = 35; // Exchange rate: 1 USD ≈ 35 TMT

async function convertPricesToTMT() {
  console.log('💰 Converting prices from USD to TMT...\n');
  console.log(`Exchange rate: 1 USD = ${USD_TO_TMT} TMT\n`);

  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true, sku: true }
  });

  console.log(`Found ${products.length} products to convert\n`);

  let converted = 0;

  for (const product of products) {
    const usdPrice = product.price;
    const tmtPrice = Math.round(usdPrice * USD_TO_TMT);

    await prisma.product.update({
      where: { id: product.id },
      data: { price: tmtPrice }
    });

    console.log(`✅ ${product.sku} - ${product.name}`);
    console.log(`   $${usdPrice} → ${tmtPrice.toLocaleString()} TMT\n`);
    converted++;
  }

  console.log('═'.repeat(50));
  console.log(`✅ Successfully converted ${converted} products to TMT`);
  console.log('═'.repeat(50));
}

convertPricesToTMT()
  .catch((error) => {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
