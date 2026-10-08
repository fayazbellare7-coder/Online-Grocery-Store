// Complete realistic catalog and default initial data for FreshCart (Indian Market Pricing)

export const defaultCategories = [
  {
    id: 1,
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    description: 'Farm-fresh organic fruits and crisp seasonal vegetables'
  },
  {
    id: 2,
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh milk, paneer, artisanal cheeses, butter, and farm eggs'
  },
  {
    id: 3,
    name: 'Bakery & Bread',
    slug: 'bakery-bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly baked whole wheat bread, pav, buns, and artisan sourdough'
  },
  {
    id: 4,
    name: 'Snacks & Munchies',
    slug: 'snacks-munchies',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281240?w=600&auto=format&fit=crop&q=80',
    description: 'Crunchy chips, premium roasted nuts, namkeen, and dark chocolates'
  },
  {
    id: 5,
    name: 'Beverages',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-pressed juices, filter coffee, green tea, kombucha, and sparkling water'
  },
  {
    id: 6,
    name: 'Staples & Grains',
    slug: 'staples-grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Aged basmati rice, chakki fresh atta, organic dals, oils, and spices'
  },
  {
    id: 7,
    name: 'Household & Cleaning',
    slug: 'household-cleaning',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    description: 'Eco-friendly dishwash, liquid detergents, kitchen rolls, and cleaners'
  }
];

export const defaultProducts = [
  // 1. Fruits & Vegetables
  {
    id: 1,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Organic Robusta Bananas',
    description: 'Rich in potassium, sweet and naturally ripened bananas. Perfect for quick energy, shakes, or breakfast.',
    price: 52.00,
    discount_percent: 10,
    unit: '1 kg (approx. 5-6 pcs)',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 2,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Crisp Shimla Royal Apples',
    description: 'Crunchy, sweet, and juicy handpicked mountain apples freshly harvested from Himachal orchards.',
    price: 180.00,
    discount_percent: 15,
    unit: '1 kg (approx. 4-5 pcs)',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 3,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Hass Avocados',
    description: 'Ripe and ready-to-eat Hass avocados with rich creamy texture. Ideal for healthy guacamole, salads, and toast.',
    price: 240.00,
    discount_percent: 10,
    unit: '2 pcs (approx. 300 g)',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 4,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Vine-Ripened Hybrid Red Tomatoes',
    description: 'Bright red, firm, and juicy desi tomatoes. Essential for curries, dal tadka, pasta sauces, and fresh salads.',
    price: 42.00,
    discount_percent: 5,
    unit: '1 kg',
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 5,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Tender Palak / Baby Spinach',
    description: 'Cleaned, fresh, and tender spinach leaves rich in iron, folic acid, and vital vitamins. Great for palak paneer.',
    price: 28.00,
    discount_percent: 0,
    unit: '250 g bunch',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 6,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Hydroponic English Cucumber (Kheera)',
    description: 'Super crisp, seedless, and refreshing English cucumbers. Perfect for raita and fresh green salads.',
    price: 32.00,
    discount_percent: 0,
    unit: '500 g (2 pcs)',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 7,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Sweet Mahabaleshwar Strawberries Box',
    description: 'Plump, deeply red, fragrant, and juicy strawberries packed with vitamin C and antioxidants.',
    price: 135.00,
    discount_percent: 15,
    unit: '200 g box',
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 2. Dairy & Eggs
  {
    id: 8,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Farm Fresh Pure Toned Cow Milk',
    description: 'Pasteurized, nutritious, and unadulterated fresh cow milk. Fortified with Vitamins A & D.',
    price: 68.00,
    discount_percent: 0,
    unit: '1 Litre Bottle',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 9,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Farm Fresh Protein Brown Eggs',
    description: 'Large brown eggs with rich golden yolks, laid by healthy vegetarian-fed hens. Packed with natural protein.',
    price: 95.00,
    discount_percent: 10,
    unit: '12 pcs (1 Dozen)',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 10,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Thick Greek Whole Milk Dahi / Yogurt',
    description: 'Authentic creamy strained dahi with natural probiotics for healthy digestion and smooth taste.',
    price: 75.00,
    discount_percent: 10,
    unit: '400 g tub',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 11,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Pure Pasteurised Salted Table Butter',
    description: 'Rich, golden butter churned from fresh cream. The iconic kitchen essential for parathas, toast, and baking.',
    price: 275.00,
    discount_percent: 5,
    unit: '500 g pack',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 12,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Fresh Malai Paneer Block',
    description: 'Soft, succulent, and protein-rich fresh cottage cheese made from pasteurized pure whole milk.',
    price: 98.00,
    discount_percent: 5,
    unit: '200 g pack',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 13,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Gourmet Mozzarella Cheese Block',
    description: 'Milky and delicious mozzarella cheese with great melt and stretch. Perfect for homemade pizzas and sandwiches.',
    price: 145.00,
    discount_percent: 0,
    unit: '200 g pack',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 3. Bakery & Bread
  {
    id: 14,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Artisan Multigrain Sourdough Loaf',
    description: 'Slow-fermented crusty artisan loaf made with natural wild yeast starter and nutrient-rich seeds.',
    price: 110.00,
    discount_percent: 0,
    unit: '400 g loaf',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 15,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: '100% Whole Wheat Brown Bread',
    description: 'Soft, fiber-rich sliced bread made with stone-ground whole wheat atta. Zero maida and no trans fats.',
    price: 48.00,
    discount_percent: 5,
    unit: '400 g pack',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 16,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'French Butter Croissants',
    description: 'Flaky, buttery, golden layers baked fresh using pure creamery butter. Melts in the mouth.',
    price: 120.00,
    discount_percent: 15,
    unit: '2 pcs pack',
    stock: 16,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 17,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Brioche Gourmet Burger Buns (Pav)',
    description: 'Soft, pillowy, shiny golden-glazed burger buns with a rich buttery taste. Great for homemade burgers.',
    price: 65.00,
    discount_percent: 0,
    unit: '4 pcs pack',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 18,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Fresh Blueberry Streusel Muffins',
    description: 'Moist oven-baked bakery muffins loaded with real blueberries and topped with crunchy cinnamon crumbs.',
    price: 95.00,
    discount_percent: 10,
    unit: '2 pcs box',
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 4. Snacks & Munchies
  {
    id: 19,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Kettle-Cooked Sea Salt Potato Chips',
    description: 'Extra crunchy thick-cut potato wafers batch-cooked in refined sunflower oil and sprinkled with rock salt.',
    price: 55.00,
    discount_percent: 10,
    unit: '150 g bag',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 20,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Roasted & Salted California Almonds (Badam)',
    description: 'Jumbo whole California almonds slowly dry-roasted to a crispy crunch with light pink Himalayan salt.',
    price: 295.00,
    discount_percent: 15,
    unit: '250 g pouch',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1508061252966-ef7fe9f5005f?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 21,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Crispy Corn Tortilla Nacho Chips',
    description: 'Authentic stone-ground corn tortilla chips with a satisfying crunch. Best paired with spicy salsa.',
    price: 85.00,
    discount_percent: 0,
    unit: '150 g pack',
    stock: 38,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 22,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: '70% Dark Chocolate Sea Salt Bar',
    description: 'Single-origin rich dark chocolate blended with delicate flakes of natural sea salt. Pure indulgence.',
    price: 125.00,
    discount_percent: 10,
    unit: '100 g bar',
    stock: 55,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 23,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Chewy Mixed Berry Granola Energy Bars',
    description: 'Wholesome rolled oats, cranberries, almonds, and honey. Healthy on-the-go snack with zero preservatives.',
    price: 199.00,
    discount_percent: 10,
    unit: '6 bars box',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 5. Beverages
  {
    id: 24,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Cold-Pressed 100% Pure Orange Juice',
    description: 'Never made from concentrate! Freshly squeezed Nagpur oranges with delicate pulp and rich vitamin C.',
    price: 149.00,
    discount_percent: 10,
    unit: '1 Litre Bottle',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 25,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Sparkling Himalayan Spring Water (Lemon)',
    description: 'Crisp, carbonated mountain spring water infused with natural lemon zest essence. Zero sugar.',
    price: 65.00,
    discount_percent: 0,
    unit: '750 ml Glass Bottle',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 26,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Coorg Estate Dark Roast Filter Coffee',
    description: '100% Arabica and Peaberry roast from Chikmagalur estates with rich aroma and hints of roasted chocolate.',
    price: 280.00,
    discount_percent: 15,
    unit: '250 g pack',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 27,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Organic Ginger Lemon Kombucha',
    description: 'Raw, unpasteurized naturally fermented effervescent tea packed with live gut probiotics and enzymes.',
    price: 135.00,
    discount_percent: 0,
    unit: '330 ml glass bottle',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 28,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Organic Japanese Green Matcha Tea Powder',
    description: 'Ceremonial grade pure matcha green tea powder. Rich in L-Theanine for calm, clean, focused energy.',
    price: 499.00,
    discount_percent: 15,
    unit: '50 g tin',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 6. Staples & Grains
  {
    id: 29,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Royal Aged Premium Basmati Rice',
    description: 'Aromatic extra long grain white basmati rice aged for 2 years. Fluffy, non-sticky grains with royal aroma.',
    price: 540.00,
    discount_percent: 15,
    unit: '5 kg bag',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 30,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Cold-Pressed Extra Virgin Olive Oil',
    description: 'First cold pressed from select olives. Low acidity, rich aroma, and heart-healthy antioxidants.',
    price: 790.00,
    discount_percent: 10,
    unit: '1 Litre bottle',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 31,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Chakki Fresh 100% Whole Wheat Atta',
    description: 'Stone-ground whole wheat atta that absorbs more water to produce soft, fluffy, and nutritious rotis.',
    price: 260.00,
    discount_percent: 5,
    unit: '5 kg bag',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 32,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Organic Unpolished Red Masoor Dal',
    description: 'High-protein, quick-cooking split red lentils. Unpolished and unadulterated for authentic homemade tadka dal.',
    price: 145.00,
    discount_percent: 0,
    unit: '1 kg pack',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 33,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Pure Organic Wildflower Raw Forest Honey',
    description: 'Unfiltered, unpasteurized 100% raw honey collected straight from ethical forest apiaries.',
    price: 285.00,
    discount_percent: 10,
    unit: '500 g glass jar',
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // 7. Household & Cleaning
  {
    id: 34,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Eco-Friendly Citrus Dishwash Liquid Gel',
    description: 'Tough on stubborn oil and grease with natural lemon extracts and biodegradable foaming agents.',
    price: 145.00,
    discount_percent: 0,
    unit: '750 ml bottle',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 35,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Concentrated Matic Liquid Laundry Detergent',
    description: 'High-efficiency liquid detergent for top & front load washing machines. Removes tough stains and preserves colors.',
    price: 290.00,
    discount_percent: 15,
    unit: '1 Litre bottle',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 36,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: '2-Ply Highly Absorbent Kitchen Paper Towels',
    description: 'Tear-resistant embossed paper towel rolls with high oil and water absorption capacity. 100% Virgin pulp.',
    price: 195.00,
    discount_percent: 10,
    unit: '4 mega rolls pack',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 37,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'All-Purpose Surface Disinfectant Spray',
    description: 'Kills 99.9% germs and bacteria. Infused with fresh pine and neem extracts for sanitized kitchen slabs & glass.',
    price: 160.00,
    discount_percent: 0,
    unit: '500 ml spray bottle',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 38,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Heavy Duty Coconut Fiber Scrubber Sponges',
    description: 'Eco-friendly non-scratch dual-sided scrub pads made from natural coir husk and cellulose.',
    price: 75.00,
    discount_percent: 0,
    unit: '4 scrubbers pack',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  }
];

export function generateDeliverySlots() {
  const timeWindows = [
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '16:00', end: '18:00' },
    { start: '18:00', end: '20:00' }
  ];

  const slots = [];
  const today = new Date();
  let idCounter = 1;

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    for (const win of timeWindows) {
      const initialBooked = i === 0 && win.start === '08:00' ? 8 : (i < 3 ? Math.floor(Math.random() * 4) : 0);
      slots.push({
        id: idCounter++,
        date: dateStr,
        start_time: win.start,
        end_time: win.end,
        capacity: 10,
        booked: initialBooked
      });
    }
  }

  return slots;
}

export const defaultAddresses = [
  {
    id: 1,
    user_id: 'customer-1',
    label: 'Home',
    line1: 'Flat 402, Green Glen Palms, 12th Cross',
    line2: 'Bellandur, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    is_default: true
  },
  {
    id: 2,
    user_id: 'customer-1',
    label: 'Office',
    line1: 'Prestige Tech Park, Block C, 4th Floor',
    line2: 'Marathahalli - Sarjapur Outer Ring Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    is_default: false
  }
];

export const defaultOrders = [
  {
    id: 1001,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    customer_phone: '+91 98765 43210',
    address_snapshot: {
      label: 'Home',
      line1: 'Flat 402, Green Glen Palms, 12th Cross',
      line2: 'Bellandur, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    slot_id: 2,
    slot_snapshot: {
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      window: '10:00 - 12:00'
    },
    payment_method: 'online',
    payment_status: 'paid',
    subtotal: 673.50,
    delivery_fee: 0.0,
    tax: 33.68,
    total: 707.18,
    status: 'Delivered',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    items: [
      { id: 1, name_snapshot: 'Fresh Organic Robusta Bananas', price_snapshot: 46.80, unit_snapshot: '1 kg (approx. 5-6 pcs)', image_snapshot: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 2, name_snapshot: 'Farm Fresh Pure Toned Cow Milk', price_snapshot: 68.00, unit_snapshot: '1 Litre Bottle', image_snapshot: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 3, name_snapshot: 'Farm Fresh Protein Brown Eggs', price_snapshot: 85.50, unit_snapshot: '12 pcs (1 Dozen)', image_snapshot: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 4, name_snapshot: 'Royal Aged Premium Basmati Rice', price_snapshot: 459.00, unit_snapshot: '5 kg bag', image_snapshot: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', quantity: 1 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Order placed successfully online', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
      { status: 'Confirmed', notes: 'Payment verified and order accepted', timestamp: new Date(Date.now() - 5 * 86400000 + 10 * 60000).toISOString() },
      { status: 'Packed', notes: 'All items packed with insulated cold bags', timestamp: new Date(Date.now() - 5 * 86400000 + 60 * 60000).toISOString() },
      { status: 'Out for Delivery', notes: 'Delivery partner Ramesh has picked up the delivery parcel', timestamp: new Date(Date.now() - 5 * 86400000 + 120 * 60000).toISOString() },
      { status: 'Delivered', notes: 'Package safely handed over at front door', timestamp: new Date(Date.now() - 5 * 86400000 + 150 * 60000).toISOString() }
    ]
  },
  {
    id: 1002,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    customer_phone: '+91 98765 43210',
    address_snapshot: {
      label: 'Home',
      line1: 'Flat 402, Green Glen Palms, 12th Cross',
      line2: 'Bellandur, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    slot_id: 3,
    slot_snapshot: {
      date: new Date().toISOString().split('T')[0],
      window: '16:00 - 18:00'
    },
    payment_method: 'cod',
    payment_status: 'pending',
    subtotal: 584.20,
    delivery_fee: 0.0,
    tax: 29.21,
    total: 613.41,
    status: 'Out for Delivery',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      { id: 5, name_snapshot: 'Crisp Shimla Royal Apples', price_snapshot: 153.00, unit_snapshot: '1 kg (approx. 4-5 pcs)', image_snapshot: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 6, name_snapshot: 'Artisan Multigrain Sourdough Loaf', price_snapshot: 110.00, unit_snapshot: '400 g loaf', image_snapshot: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 7, name_snapshot: 'Cold-Pressed 100% Pure Orange Juice', price_snapshot: 134.10, unit_snapshot: '1 Litre Bottle', image_snapshot: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80', quantity: 2 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Cash on Delivery order placed', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { status: 'Confirmed', notes: 'Store confirmed order readiness', timestamp: new Date(Date.now() - 2 * 3600000 + 15 * 60000).toISOString() },
      { status: 'Packed', notes: 'Order packed and assigned to delivery agent', timestamp: new Date(Date.now() - 2 * 3600000 + 45 * 60000).toISOString() },
      { status: 'Out for Delivery', notes: 'Delivery partner Suresh is on the way (approx 15 mins)', timestamp: new Date(Date.now() - 2 * 3600000 + 75 * 60000).toISOString() }
    ]
  },
  {
    id: 1003,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    customer_phone: '+91 98765 43210',
    address_snapshot: {
      label: 'Home',
      line1: 'Flat 402, Green Glen Palms, 12th Cross',
      line2: 'Bellandur, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    slot_id: 5,
    slot_snapshot: {
      date: new Date().toISOString().split('T')[0],
      window: '10:00 - 12:00'
    },
    payment_method: 'online',
    payment_status: 'paid',
    subtotal: 1437.75,
    delivery_fee: 0.0,
    tax: 71.89,
    total: 1509.64,
    status: 'Placed',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    items: [
      { id: 8, name_snapshot: 'Cold-Pressed Extra Virgin Olive Oil', price_snapshot: 711.00, unit_snapshot: '1 Litre bottle', image_snapshot: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 9, name_snapshot: 'Coorg Estate Dark Roast Filter Coffee', price_snapshot: 238.00, unit_snapshot: '250 g pack', image_snapshot: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 10, name_snapshot: 'Roasted & Salted California Almonds (Badam)', price_snapshot: 250.75, unit_snapshot: '250 g pouch', image_snapshot: 'https://images.unsplash.com/photo-1508061252966-ef7fe9f5005f?w=600&auto=format&fit=crop&q=80', quantity: 1 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Order placed and prepaid online via UPI', timestamp: new Date(Date.now() - 30 * 60000).toISOString() }
    ]
  }
];
