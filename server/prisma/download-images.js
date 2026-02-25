import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simpler approach - download one at a time with retries
const imageUrls = {
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584990347449-a3f8e5a16b39?w=800&h=800&fit=crop&q=80',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=800&fit=crop&q=80',
  ],
  living: [
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80',
  ],
  storage: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620389724546-5f27bd1d4a5c?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=800&fit=crop&q=80',
  ],
  laundry: [
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&h=800&fit=crop&q=80',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558171013-50ed8a62b618?w=800&h=800&fit=crop&q=80',
  ],
};

async function downloadWithRetry(url, filepath, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filepath, response.data);
      return true;
    } catch (error) {
      console.log(`⚠️  Retry ${i + 1}/${retries} for ${path.basename(filepath)}...`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  return false;
}

async function main() {
  console.log('🖼️  Downloading product images...\n');

  const publicDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'products');
  let downloaded = 0;
  let failed = 0;

  for (const [category, urls] of Object.entries(imageUrls)) {
    console.log(`\n📁 ${category.toUpperCase()}`);
    
    for (let i = 0; i < urls.length; i++) {
      const filename = `${category}-${i + 1}.jpg`;
      const filepath = path.join(publicDir, category, filename);

      try {
        await downloadWithRetry(urls[i], filepath);
        console.log(`  ✅ ${filename}`);
        downloaded++;
        await new Promise(r => setTimeout(r, 1000)); // Rate limit
      } catch (error) {
        console.log(`  ❌ ${filename} - ${error.message}`);
        failed++;
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Downloaded: ${downloaded} | ❌ Failed: ${failed}`);
  console.log('═'.repeat(50));
}

main().catch(console.error);
