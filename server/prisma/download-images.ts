import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product image URLs from seed file
const imageUrls = {
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1584990347449-a3f8e5a16b39?w=800&h=800&fit=crop',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=800&fit=crop',
  ],
  living: [
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
  ],
  storage: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1620389724546-5f27bd1d4a5c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=800&fit=crop',
  ],
  laundry: [
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&h=800&fit=crop',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558171013-50ed8a62b618?w=800&h=800&fit=crop',
  ],
};

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, response.data);
    console.log(`✅ Downloaded: ${filepath}`);
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error);
  }
}

async function downloadAllImages() {
  console.log('🖼️  Starting image download...\n');

  const frontendPublic = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');

  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const [category, urls] of Object.entries(imageUrls)) {
    console.log(`📁 Downloading ${category} images...`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${category}-${i + 1}.jpg`;
      const filepath = path.join(frontendPublic, category, filename);

      try {
        await downloadImage(url, filepath);
        totalDownloaded++;
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        totalFailed++;
      }
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  if (totalFailed > 0) {
    console.log(`❌ Failed: ${totalFailed} images`);
  }
  console.log('═══════════════════════════════════════');
  console.log('\n📝 Next step: Update seed.ts to use local image paths');
}

downloadAllImages().catch(console.error);
