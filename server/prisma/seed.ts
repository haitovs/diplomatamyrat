import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Kitchen', slug: 'kitchen', description: 'Cookware, serveware, and tools for everyday meals', icon: 'chef-hat', sortOrder: 1 },
  { name: 'Bathroom', slug: 'bathroom', description: 'Plush textures and aromatics for your sanctuary', icon: 'bath', sortOrder: 2 },
  { name: 'Living', slug: 'living', description: 'Warm lighting and lounge-ready textiles', icon: 'sofa', sortOrder: 3 },
  { name: 'Storage', slug: 'storage', description: 'Smart organization that calms the chaos', icon: 'box', sortOrder: 4 },
  { name: 'Laundry', slug: 'laundry', description: 'Care rituals for fresh linens', icon: 'shirt', sortOrder: 5 },
  { name: 'Outdoor', slug: 'outdoor', description: 'Weather-ready accents for patio hangs', icon: 'sun', sortOrder: 6 }
];

const products = [
  // Kitchen
  { name: 'Artisan Stoneware Canister Set', slug: 'artisan-stoneware-canister-set', description: 'Wheel-thrown stoneware canisters with snug acacia lids to keep dry goods fresh and display ready.', price: 78, sku: 'HH-KIT-011', category: 'kitchen', badge: 'Bestseller', isFeatured: true, materials: 'Stoneware, acacia wood', leadTime: 'Ships within 24 hours', highlights: ['Set of three nesting canisters', 'Natural seal keeps ingredients fresh', 'Dishwasher safe stoneware'], rating: 4.8, reviewCount: 182 },
  { name: 'Walnut Mise en Place Board', slug: 'walnut-mise-en-place-board', description: 'Double-sided prep board with routed wells that keep chopped herbs and aromatics organized before cooking.', price: 64, sku: 'HH-KIT-129', category: 'kitchen', badge: 'New', materials: 'Walnut wood, rubber feet', leadTime: 'Ships within 24 hours', highlights: ['Mineral oil finish repels moisture', 'Juice groove on reverse side', 'Non-slip walnut feet'], rating: 4.7, reviewCount: 88 },
  { name: 'Slate Stone Dinnerware Set', slug: 'slate-stone-dinnerware-set', description: 'A twelve-piece dinnerware set cast in matte stone that transitions from everyday meals to entertaining.', price: 148, sku: 'HH-KIT-204', category: 'kitchen', badge: 'Limited', isFeatured: true, materials: 'Stoneware', leadTime: 'Ships in 2 days', highlights: ['Includes dinner, salad, and side plates', 'Microwave and dishwasher safe', 'Stackable with built-in feet'], rating: 4.9, reviewCount: 132 },
  { name: 'Copper Gooseneck Pour-Over Kettle', slug: 'copper-gooseneck-pour-over-kettle', description: 'Precision gooseneck kettle with temperature control for pour-over mornings and tea service.', price: 120, sku: 'HH-KIT-167', category: 'kitchen', badge: 'Barista Favorite', materials: 'Copper, stainless steel', leadTime: 'Ships within 24 hours', highlights: ['Built-in thermometer lid', 'Induction-friendly base', 'Ergonomic burn-resistant handle'], rating: 4.6, reviewCount: 74 },
  { name: 'Stonewashed Linen Apron Set', slug: 'stonewashed-linen-apron-set', description: 'Cross-back aprons cut from stonewashed linen with generous pockets for prep tools and tasting spoons.', price: 58, sku: 'HH-KIT-188', category: 'kitchen', badge: 'Restocked', materials: 'Linen, cotton straps', leadTime: 'Ships within 24 hours', highlights: ['Adjustable cross-back straps relieve neck pressure', 'Includes two matching tea towels', 'Pre-washed to resist shrinking'], rating: 4.8, reviewCount: 132 },

  // Bathroom
  { name: 'Cloudweight Spa Towel Bundle', slug: 'cloudweight-spa-towel-bundle', description: 'Ultra absorbent spa towels with a plush terry side and textured reverse for home spa mornings.', price: 110, sku: 'HH-BTH-207', category: 'bathroom', badge: 'Hotel Quality', isFeatured: true, materials: '100% Turkish cotton', leadTime: 'Ships within 24 hours', highlights: ['Includes two bath, two hand, two face towels', 'OEKO-TEX certified cotton', 'Corner loops for easy hanging'], rating: 4.9, reviewCount: 302 },
  { name: 'Teak Serenity Bath Caddy', slug: 'teak-serenity-bath-caddy', description: 'Solid teak bath caddy with adjustable arms, space for a book, tablet, and candle for spa nights at home.', price: 98, sku: 'HH-BTH-118', category: 'bathroom', badge: "Editor's Pick", materials: 'Sustainably harvested teak', leadTime: 'Ships within 2 days', highlights: ['Extends 27" to 41" to fit most tubs', 'Includes safe slots for glass and devices', 'Water resistant finish'], rating: 4.7, reviewCount: 144 },
  { name: 'Cedar Slatted Bath Mat', slug: 'cedar-slatted-bath-mat', description: 'Aromatic cedar bath mat that wicks water and adds warmth to tile floors.', price: 78, sku: 'HH-BTH-154', category: 'bathroom', badge: 'Restocked', materials: 'Cedar wood', leadTime: 'Ships within 24 hours', highlights: ['Non-slip silicone feet', 'Naturally mildew resistant', 'Refreshes with simple sanding'], rating: 4.5, reviewCount: 91 },
  { name: 'Aromatherapy Shower Steamers', slug: 'aromatherapy-shower-steamers', description: 'Eucalyptus and citrus shower steamers that transform quick showers into spa moments.', price: 32, sku: 'HH-BTH-221', category: 'bathroom', badge: 'New', materials: 'Natural minerals, essential oils', leadTime: 'Ships within 24 hours', highlights: ['Includes eight individually wrapped steamers', 'Vegan and cruelty free', 'Reusable ceramic dish included'], rating: 4.6, reviewCount: 59 },
  { name: 'Bamboo Bath Storage Ladder', slug: 'bamboo-bath-storage-ladder', description: 'Lean this ladder beside the tub to hang towels, store baskets, and keep bath trays within easy reach.', price: 145, sku: 'HH-BTH-256', category: 'bathroom', badge: 'Small Space Hero', materials: 'Bamboo, powder-coated steel', leadTime: 'Ships within 24 hours', highlights: ['Five rungs with anti-slip feet', 'Includes two removable storage caddies', 'Sealed against humidity'], rating: 4.4, reviewCount: 71 },

  // Living
  { name: 'Belgian Linen Throw', slug: 'belgian-linen-throw', description: 'Lightweight linen throw woven in Flanders with a soft stonewashed finish for effortless layering.', price: 128, sku: 'HH-LIV-204', category: 'living', badge: 'Limited', isFeatured: true, materials: '100% Belgian flax linen', leadTime: 'Ships in 1-2 days', highlights: ['Generous 50" x 70" sizing', 'Prewashed for lived-in softness', 'Pairs with neutral palettes'], rating: 4.9, reviewCount: 96 },
  { name: 'Lowline Oak Coffee Table', slug: 'lowline-oak-coffee-table', description: 'Oversized oak coffee table with a chamfered edge and concealed storage built in small batches.', price: 540, sku: 'HH-LIV-315', category: 'living', badge: 'Made to Order', materials: 'FSC certified oak', leadTime: 'Ships in 2-3 weeks', highlights: ['Soft close storage drawer for remotes', 'Finished with plant based oils', 'Pairs with Hearth modular seating'], rating: 4.7, reviewCount: 41 },
  { name: 'Arc Ambient Floor Lamp', slug: 'arc-ambient-floor-lamp', description: 'Oversized linen shade and arched steel base create soft, room-defining light.', price: 210, sku: 'HH-LIV-278', category: 'living', badge: 'Bestseller', isFeatured: true, materials: 'Steel, linen, marble', leadTime: 'Ships within 3 days', highlights: ['Three-stage dimmer', 'Weighted marble base', 'Includes LED bulb'], rating: 4.8, reviewCount: 122 },
  { name: 'Hearth Ceramic Diffuser', slug: 'hearth-ceramic-diffuser', description: 'Ultrasonic ceramic diffuser with a soft glow base for evening rituals.', price: 68, sku: 'HH-LIV-341', category: 'living', badge: 'Restocked', materials: 'Ceramic, BPA-free reservoir', leadTime: 'Ships within 24 hours', highlights: ['Runs up to 8 hours', 'Auto shut-off timer', 'Includes two seasonal oil blends'], rating: 4.6, reviewCount: 84 },
  { name: 'Hearth Bouclé Pillow Set', slug: 'hearth-boucle-pillow-set', description: 'Pair of pillows in boucle and linen that adds depth to sofas and reading chairs.', price: 98, sku: 'HH-LIV-362', category: 'living', badge: 'Cozy Drop', materials: 'Bouclé polyester, linen, feather-down', leadTime: 'Ships within 2 days', highlights: ['Includes one 20" and one 22" pillow', 'Feather-down insert with zipper cover', 'Covers are machine washable'], rating: 4.7, reviewCount: 93 },

  // Storage
  { name: 'Pine + Cane Storage Baskets', slug: 'pine-cane-storage-baskets', description: 'Modular storage baskets with cane webbing fronts and integrated labels that stack effortlessly.', price: 48, sku: 'HH-STR-091', category: 'storage', badge: 'Top Rated', isFeatured: true, materials: 'Pine wood, cane webbing', leadTime: 'Ships next business day', highlights: ['Set of 2 medium and 1 large basket', 'Collapsible for flat storage', 'Comes with 6 interchangeable labels'], rating: 4.9, reviewCount: 211 },
  { name: 'Willow Entryway Console', slug: 'willow-entryway-console', description: 'Slim console with concealed drawers and a floating shelf to corral entryway essentials.', price: 420, sku: 'HH-STR-132', category: 'storage', badge: 'New', materials: 'FSC oak veneer, steel', leadTime: 'Ships in 1 week', highlights: ['Integrated cord cut-outs', 'Includes two cane-front drawers', 'Adjustable leveling feet'], rating: 4.5, reviewCount: 67 },
  { name: 'Clear Stackable Shoe Drawers', slug: 'clear-stackable-shoe-drawers', description: 'Ventilated drawers that stack vertically to keep footwear easy to see and protected.', price: 58, sku: 'HH-STR-205', category: 'storage', badge: 'Restocked', materials: 'Recycled PET', leadTime: 'Ships within 24 hours', highlights: ['Magnetic drop-front door', 'Fits up to mens size 13', 'Modular design locks in place'], rating: 4.4, reviewCount: 105 },
  { name: 'Pantry & Closet Labeling Kit', slug: 'pantry-closet-labeling-kit', description: 'Water-resistant labels and chalk markers that keep bins, baskets, and jars organized.', price: 28, sku: 'HH-STR-176', category: 'storage', badge: 'Bundle', materials: 'Vinyl, chalk ink', leadTime: 'Ships within 24 hours', highlights: ['Includes 120 pre-printed labels', 'Two refillable chalk pens', 'Sheets of blanks for custom naming'], rating: 4.7, reviewCount: 143 },
  { name: 'Atelier Wardrobe Rack', slug: 'atelier-wardrobe-rack', description: 'Rolling wardrobe rack with a solid oak shelf for shoes and baskets—perfect for entryways or guest rooms.', price: 260, sku: 'HH-STR-231', category: 'storage', badge: 'Design Studio Pick', materials: 'Steel, solid oak', leadTime: 'Ships within 3 days', highlights: ['Locking casters for easy movement', 'Includes removable hanging hooks', 'Shelf holds two storage bins'], rating: 4.6, reviewCount: 58 },

  // Laundry
  { name: 'Cedar Grove Laundry Trio', slug: 'cedar-grove-laundry-trio', description: 'Plant based detergent, linen mist, and wool dryer balls with a crisp cedar scent for fresh laundry days.', price: 62, sku: 'HH-LAU-032', category: 'laundry', badge: 'Staff Favorite', isFeatured: true, materials: 'Glass, wool, plant based surfactants', leadTime: 'Ships within 24 hours', highlights: ['Detergent works in HE and standard machines', 'Glass bottles refill easily', 'Includes three reusable wool dryer balls'], rating: 4.5, reviewCount: 54 },
  { name: 'Canvas Crest Laundry Hamper', slug: 'canvas-crest-laundry-hamper', description: 'Structured double hamper with removable cotton liners and walnut handles for easy sorting.', price: 58, sku: 'HH-LAU-056', category: 'laundry', badge: 'Restocked', materials: 'Cotton canvas, walnut', leadTime: 'Ships in 1-2 days', highlights: ['Two removable washable liners', 'Rigid frame stands upright', 'Handles crafted from reclaimed walnut'], rating: 4.6, reviewCount: 118 },
  { name: 'Foldaway Laundry Table', slug: 'foldaway-laundry-table', description: 'Wall-mounted folding table with hidden shelves that creates a laundry workstation in seconds.', price: 198, sku: 'HH-LAU-118', category: 'laundry', badge: 'Space Saver', materials: 'Birch plywood, steel', leadTime: 'Ships in 5 days', highlights: ['Folds flat to 4 inches from wall', 'Includes peg rail for tools', 'Integrated power strip'], rating: 4.4, reviewCount: 63 },
  { name: 'Coastal Linen Refresh Spray', slug: 'coastal-linen-refresh-spray', description: 'Plant-based linen spray with notes of sea salt, bergamot, and amber for between-wash refreshes.', price: 24, sku: 'HH-LAU-143', category: 'laundry', badge: 'New Scent', materials: 'Distilled water, essential oils', leadTime: 'Ships within 24 hours', highlights: ['Safe for upholstery and bedding', 'Refillable glass bottle', 'Paraben and phthalate free'], rating: 4.3, reviewCount: 45 },
  { name: 'PressGuard Steam Iron', slug: 'pressguard-steam-iron', description: 'Hybrid iron and steamer with a stainless soleplate that glides over linens and delicates.', price: 115, sku: 'HH-LAU-189', category: 'laundry', badge: 'Pro Finish', materials: 'Stainless steel, BPA-free reservoir', leadTime: 'Ships within 24 hours', highlights: ['Adjustable steam with vertical mode', 'Auto shut-off safety', 'Includes heat-resistant storage mat'], rating: 4.4, reviewCount: 52 },

  // Outdoor
  { name: 'Terrace Entertaining Set', slug: 'terrace-entertaining-set', description: 'Weather-ready entertaining kit with a woven drink cooler, shatterproof glassware, and LED lantern.', price: 198, sku: 'HH-OUT-010', category: 'outdoor', badge: 'Outdoor Drop', isFeatured: true, materials: 'Rattan, stainless steel, Tritan', leadTime: 'Ships in 3-5 days', highlights: ['Includes eight piece Tritan glassware set', 'Cooler keeps ice for up to 12 hours', 'Lantern offers three warm white settings'], rating: 4.3, reviewCount: 27 },
  { name: 'All-Season Picnic Blanket', slug: 'all-season-picnic-blanket', description: 'Water-resistant picnic blanket with a quilted top and carrying strap for impromptu gatherings.', price: 72, sku: 'HH-OUT-024', category: 'outdoor', badge: 'Bestseller', materials: 'Recycled polyester, TPU backing', leadTime: 'Ships within 24 hours', highlights: ['Sand-resistant underside wipes clean', 'Machine washable and quick drying', 'Includes adjustable carrying strap'], rating: 4.8, reviewCount: 235 },
  { name: 'Ridge Terracotta Planter Pair', slug: 'ridge-terracotta-planter-pair', description: 'Set of two ridged terracotta planters with drainage trays for patios and balconies.', price: 88, sku: 'HH-OUT-065', category: 'outdoor', badge: 'Limited', materials: 'Terracotta', leadTime: 'Ships within 24 hours', highlights: ['Frost and UV resistant finish', 'Includes matching drip trays', 'Ideal for herbs or small citrus'], rating: 4.5, reviewCount: 52 },
  { name: 'Solar Glow Lantern Trio', slug: 'solar-glow-lantern-trio', description: 'Solar-powered lanterns with warm-white LEDs and woven exterior for ambient patios.', price: 98, sku: 'HH-OUT-112', category: 'outdoor', badge: 'Glow All Night', materials: 'Woven poly, solar LED core', leadTime: 'Ships within 3 days', highlights: ['Charges in 6 hours of daylight', 'Three brightness settings', 'Weather-resistant woven housing'], rating: 4.6, reviewCount: 73 },
  { name: 'Cinder Bowl Gas Fire Pit', slug: 'cinder-bowl-gas-fire-pit', description: 'Low-profile gas fire pit with lava rock fill that brings warmth to patios without smoke.', price: 620, sku: 'HH-OUT-142', category: 'outdoor', badge: 'Gathering Favorite', materials: 'Glass fiber reinforced concrete, steel burner', leadTime: 'Ships in 5-7 days', highlights: ['Hidden propane compartment with quick ignition', 'Includes weather cover and lava rock', 'Adjustable flame height'], rating: 4.7, reviewCount: 64 },

  // ─── Additional Products ───────────────────────────

  // Kitchen (extras)
  { name: 'Cast Iron Dutch Oven', slug: 'cast-iron-dutch-oven', description: 'Enameled cast iron Dutch oven perfect for slow-cooked stews, fresh bread, and one-pot roasts.', price: 195, sku: 'HH-KIT-301', category: 'kitchen', badge: 'Chef Favorite', materials: 'Enameled cast iron', leadTime: 'Ships within 24 hours', highlights: ['5.5 quart capacity', 'Self-basting condensation ridges on lid', 'Works on all stovetops including induction'], rating: 4.9, reviewCount: 214 },
  { name: 'Marble Pastry Board', slug: 'marble-pastry-board', description: 'Naturally cool marble surface ideal for rolling dough, tempering chocolate, and presenting cheeses.', price: 85, sku: 'HH-KIT-312', category: 'kitchen', badge: 'New', materials: 'Carrara marble, felt feet', leadTime: 'Ships in 2 days', highlights: ['Stays cool for delicate pastry work', 'Non-porous polished surface', 'Includes leather hanging strap'], rating: 4.6, reviewCount: 47 },
  { name: 'Nested Mixing Bowl Set', slug: 'nested-mixing-bowl-set', description: 'Seven-piece stoneware mixing bowl set in graduated sizes with pour spouts and non-slip bases.', price: 68, sku: 'HH-KIT-325', category: 'kitchen', badge: 'Bestseller', isFeatured: true, materials: 'Stoneware', leadTime: 'Ships within 24 hours', highlights: ['Microwave and dishwasher safe', 'Nested design saves cabinet space', 'Each bowl in a different earth tone'], rating: 4.8, reviewCount: 176 },

  // Bathroom (extras)
  { name: 'Rainfall Showerhead System', slug: 'rainfall-showerhead-system', description: 'Overhead rain shower with handheld wand and easy-install bracket that transforms any bathroom.', price: 165, sku: 'HH-BTH-301', category: 'bathroom', badge: 'Spa Upgrade', materials: 'Brushed stainless steel', leadTime: 'Ships in 3 days', highlights: ['10-inch rainfall head with 6 spray modes', 'Includes 60-inch flexible hose', 'Tool-free installation'], rating: 4.7, reviewCount: 89 },
  { name: 'Organic Cotton Bath Robe', slug: 'organic-cotton-bath-robe', description: 'Plush GOTS-certified organic cotton robe with waffle weave texture for quick drying.', price: 92, sku: 'HH-BTH-318', category: 'bathroom', badge: 'Luxury', materials: '100% GOTS organic cotton', leadTime: 'Ships within 24 hours', highlights: ['Available in S/M and L/XL', 'Deep pockets and adjustable belt', 'Gets softer with every wash'], rating: 4.8, reviewCount: 156 },
  { name: 'Vanity Organization Tray', slug: 'vanity-organization-tray', description: 'Three-compartment marble and brass tray that corrals daily essentials on any bathroom counter.', price: 55, sku: 'HH-BTH-329', category: 'bathroom', badge: 'New', materials: 'Italian marble, brass', leadTime: 'Ships within 24 hours', highlights: ['Non-scratch felt base', 'Removable dividers', 'Pairs with matching soap dispenser'], rating: 4.5, reviewCount: 62 },

  // Living (extras)
  { name: 'Woven Jute Area Rug', slug: 'woven-jute-area-rug', description: 'Hand-braided jute rug that adds natural warmth and texture beneath coffee tables and reading nooks.', price: 178, sku: 'HH-LIV-401', category: 'living', badge: 'Handcrafted', materials: 'Natural jute fiber', leadTime: 'Ships in 3-5 days', highlights: ['Available in 5x7 and 8x10 sizes', 'Reversible design', 'Compatible with rug pads'], rating: 4.6, reviewCount: 83 },
  { name: 'Floating Oak Wall Shelf Set', slug: 'floating-oak-wall-shelf-set', description: 'Set of three floating shelves in smoked oak with concealed brackets for clean gallery-wall displays.', price: 135, sku: 'HH-LIV-415', category: 'living', badge: 'New', materials: 'Smoked oak, steel brackets', leadTime: 'Ships in 3 days', highlights: ['Three lengths: 24, 36, and 48 inches', 'Each shelf holds up to 15 kg', 'All mounting hardware included'], rating: 4.7, reviewCount: 71 },
  { name: 'Terracotta Table Lamp', slug: 'terracotta-table-lamp', description: 'Sculptural terracotta lamp with linen drum shade that brings earthy warmth to bedside tables.', price: 88, sku: 'HH-LIV-428', category: 'living', badge: 'Restocked', materials: 'Terracotta, linen shade', leadTime: 'Ships within 24 hours', highlights: ['Inline dimmer switch', 'Includes LED bulb', 'E26 socket fits most shades'], rating: 4.5, reviewCount: 55 },

  // Storage (extras)
  { name: 'Under-Bed Rolling Drawer', slug: 'under-bed-rolling-drawer', description: 'Canvas and oak drawer on smooth casters that transforms wasted under-bed space into organized storage.', price: 72, sku: 'HH-STR-301', category: 'storage', badge: 'Space Saver', materials: 'Canvas, oak frame, casters', leadTime: 'Ships within 2 days', highlights: ['Fits beds with 8 inches clearance', 'Removable washable liner', 'Reinforced handles'], rating: 4.6, reviewCount: 94 },
  { name: 'Pegboard Wall Organizer', slug: 'pegboard-wall-organizer', description: 'Modular oak pegboard with shelves, hooks, and bins for entryways, offices, or craft rooms.', price: 115, sku: 'HH-STR-315', category: 'storage', badge: 'Customizable', isFeatured: true, materials: 'Solid oak, powder-coated steel pegs', leadTime: 'Ships in 3 days', highlights: ['Includes 12 pegs, 2 shelves, 1 bin', 'Additional accessories sold separately', 'Mounting hardware for drywall and studs'], rating: 4.8, reviewCount: 128 },
  { name: 'Tiered Corner Shelf Unit', slug: 'tiered-corner-shelf-unit', description: 'Five-tier corner shelf that maximizes forgotten corner space in any room.', price: 155, sku: 'HH-STR-328', category: 'storage', badge: 'New', materials: 'Bamboo, steel frame', leadTime: 'Ships in 3-5 days', highlights: ['Fits 90-degree wall corners perfectly', 'Anti-tip wall anchor included', 'Each shelf holds up to 10 kg'], rating: 4.4, reviewCount: 43 },

  // Laundry (extras)
  { name: 'Retractable Clothesline Reel', slug: 'retractable-clothesline-reel', description: 'Indoor-outdoor retractable clothesline with 12 meters of UV-resistant cord for air drying.', price: 38, sku: 'HH-LAU-301', category: 'laundry', badge: 'Eco Pick', materials: 'ABS plastic, stainless cord', leadTime: 'Ships within 24 hours', highlights: ['Tension auto-lock mechanism', 'Holds up to 20 kg of laundry', 'Retracts flush to wall'], rating: 4.5, reviewCount: 87 },
  { name: 'Wrinkle Release Steamer', slug: 'wrinkle-release-steamer', description: 'Compact garment steamer with continuous steam that freshens clothes in seconds without an ironing board.', price: 68, sku: 'HH-LAU-315', category: 'laundry', badge: 'Travel Ready', materials: 'Stainless steel plate, BPA-free tank', leadTime: 'Ships within 24 hours', highlights: ['Heats up in 25 seconds', '200 ml tank for 15 minutes of steam', 'Includes fabric brush attachment'], rating: 4.6, reviewCount: 103 },
  { name: 'Mesh Wash Bag Set', slug: 'mesh-wash-bag-set', description: 'Set of six mesh bags in three sizes to protect delicates, activewear, and lingerie in the wash.', price: 22, sku: 'HH-LAU-328', category: 'laundry', badge: 'Essential', materials: 'Polyester mesh, YKK zippers', leadTime: 'Ships within 24 hours', highlights: ['Includes 2 large, 2 medium, 2 small bags', 'Reinforced seams and rust-free zippers', 'Machine washable and dryer safe'], rating: 4.7, reviewCount: 195 },

  // Outdoor (extras)
  { name: 'Hammock with Steel Stand', slug: 'hammock-with-steel-stand', description: 'Double hammock on a portable steel frame — sets up in minutes for patio lounging or garden reading.', price: 245, sku: 'HH-OUT-301', category: 'outdoor', badge: 'Weekend Essential', materials: 'Cotton weave, powder-coated steel', leadTime: 'Ships in 3-5 days', highlights: ['Holds up to 200 kg', 'Includes carrying bag for travel', 'Spreader bars prevent tangling'], rating: 4.7, reviewCount: 68 },
  { name: 'Solar Pathway Light Set', slug: 'solar-pathway-light-set', description: 'Eight solar-powered stake lights with warm amber LEDs that line walkways and garden paths.', price: 65, sku: 'HH-OUT-315', category: 'outdoor', badge: 'New', materials: 'Stainless steel, glass lens', leadTime: 'Ships within 24 hours', highlights: ['Auto on at dusk, off at dawn', 'IP65 waterproof rated', 'Replaceable rechargeable batteries'], rating: 4.4, reviewCount: 112 },
  { name: 'Ceramic Herb Planter Kit', slug: 'ceramic-herb-planter-kit', description: 'Window-sill planter set with three ceramic pots, bamboo tray, and seed packets for basil, mint, and cilantro.', price: 42, sku: 'HH-OUT-328', category: 'outdoor', badge: 'Grow Your Own', materials: 'Ceramic, bamboo, organic seeds', leadTime: 'Ships within 24 hours', highlights: ['Includes drainage holes and bamboo tray', 'Three seed packets with growing guide', 'Perfect for apartment gardens'], rating: 4.6, reviewCount: 89 }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@household.tm' },
    update: {},
    create: {
      email: 'admin@household.tm',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      cart: { create: {} }
    }
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash('demo123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: customerPassword,
      firstName: 'Demo',
      lastName: 'Customer',
      role: 'CUSTOMER',
      cart: { create: {} }
    }
  });

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
  }

  console.log('✅ Categories created');

  // Get category IDs
  const categoryMap = new Map<string, string>();
  const allCategories = await prisma.category.findMany();
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // Create products
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.category);
    if (!categoryId) continue;

    const { category, highlights, ...productData } = prod;

    // Category-specific image URLs - Using local images
    const categoryImages: Record<string, string[]> = {
      kitchen: [
        '/images/products/kitchen/kitchen-1.jpg',
        '/images/products/kitchen/kitchen-2.jpg',
        '/images/products/artisan-canisters.jpg',
      ],
      bathroom: [
        '/images/products/bathroom/bathroom-1.jpg',
        '/images/products/bathroom/bathroom-2.jpg',
        '/images/products/bathroom/bathroom-3.jpg',
      ],
      living: [
        '/images/products/living/living-1.jpg',
        '/images/products/living/living-2.jpg',
        '/images/products/living/living-3.jpg',
      ],
      storage: [
        '/images/products/storage/storage-1.jpg',
        '/images/products/storage/storage-2.jpg',
        '/images/products/modular-baskets.jpg',
      ],
      laundry: [
        '/images/products/laundry/laundry-1.jpg',
        '/images/products/laundry/laundry-2.jpg',
        '/images/products/laundry/laundry-3.jpg',
      ],
      outdoor: [
        '/images/products/outdoor/outdoor-1.jpg',
        '/images/products/outdoor/outdoor-2.jpg',
        '/images/products/garden-set.jpg',
      ],
    };

    const images = categoryImages[prod.category] || categoryImages.kitchen;
    const randomIndex = Math.floor(Math.random() * images.length);

    const existingProduct = await prisma.product.findUnique({ where: { slug: prod.slug } });

    if (existingProduct) {
      await prisma.product.update({
        where: { slug: prod.slug },
        data: {
          ...productData,
          categoryId
        }
      });
    } else {
      await prisma.product.create({
        data: {
          ...productData,
          categoryId,
          highlights: {
            create: highlights.map((text, index) => ({ text, sortOrder: index }))
          },
          images: {
            create: [
              { url: images[randomIndex], alt: prod.name, sortOrder: 0 },
              { url: images[(randomIndex + 1) % images.length], alt: `${prod.name} - Detail`, sortOrder: 1 }
            ]
          }
        }
      });
    }
  }

  console.log('✅ Products created');
  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Demo accounts:');
  console.log('   Admin: admin@household.tm / admin123');
  console.log('   Customer: demo@example.com / demo123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
