// Indian Grocery Store Catalog with Authentic Market Pricing in INR (₹)

export const categories = [
  { id: 'all', name: 'All Groceries', icon: '🛒' },
  { id: 'fruits-vegetables', name: 'Fruits & Veggies', icon: '🍎' },
  { id: 'dairy-eggs', name: 'Dairy & Farm Eggs', icon: '🥛' },
  { id: 'bakery-bread', name: 'Bakery & Bread', icon: '🍞' },
  { id: 'snacks-munchies', name: 'Snacks & Munchies', icon: '🥨' },
  { id: 'beverages', name: 'Cold Beverages', icon: '🧃' },
  { id: 'staples-grains', name: 'Pantry & Grains', icon: '🌾' },
  { id: 'household-cleaning', name: 'Eco Household', icon: '🧼' }
];

export const deliverySlots = [
  { id: 'slot-1', label: 'Morning Slot (8:00 AM - 11:00 AM)', time: '8:00 AM - 11:00 AM' },
  { id: 'slot-2', label: 'Afternoon Slot (1:00 PM - 4:00 PM)', time: '1:00 PM - 4:00 PM' },
  { id: 'slot-3', label: 'Evening Slot (6:00 PM - 9:00 PM)', time: '6:00 PM - 9:00 PM' }
];

export const defaultProducts = [
  // 1. Fruits & Vegetables
  {
    id: 1,
    name: 'Fresh Organic Robusta Bananas',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Sweet, natural, and nutrient-dense bananas. High in potassium and energy.',
    price: 52.00,
    discount_percent: 10,
    unit: '1 kg (approx. 5-6 pcs)',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Crisp Shimla Royal Apples',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Juicy, sweet hand-picked Himachal orchard apples with vibrant red skin.',
    price: 180.00,
    discount_percent: 15,
    unit: '1 kg (approx. 4-5 pcs)',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Fresh Hass Avocados',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Ripe and ready-to-eat Hass avocados with rich creamy buttery texture.',
    price: 240.00,
    discount_percent: 10,
    unit: '2 pcs (approx. 300 g)',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Vine-Ripened Hybrid Red Tomatoes',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Firm and juicy desi tomatoes. Essential for curries, rasam, and fresh salads.',
    price: 42.00,
    discount_percent: 5,
    unit: '1 kg',
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    rating: 4.6
  },
  {
    id: 5,
    name: 'Fresh Tender Palak / Baby Spinach',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Fresh and tender spinach leaves rich in iron and vitamins. Great for palak paneer.',
    price: 28.00,
    discount_percent: 0,
    unit: '250 g bunch',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 6,
    name: 'Hydroponic English Cucumbers',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Super crisp, refreshing, seedless green cucumbers for healthy salads.',
    price: 32.00,
    discount_percent: 0,
    unit: '500 g (2 pcs)',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 7,
    name: 'Sweet Mahabaleshwar Strawberries',
    category: 'fruits-vegetables',
    category_name: 'Fruits & Veggies',
    description: 'Plump, deeply red, fragrant and juicy strawberries full of antioxidants.',
    price: 135.00,
    discount_percent: 15,
    unit: '200 g box',
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },

  // 2. Dairy & Eggs
  {
    id: 8,
    name: 'Farm Fresh Pure Toned Cow Milk',
    category: 'dairy-eggs',
    category_name: 'Dairy & Farm Eggs',
    description: 'Pasteurized, nutritious, and unadulterated fresh cow milk. Fortified with vitamins.',
    price: 68.00,
    discount_percent: 0,
    unit: '1 Litre Bottle',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 9,
    name: 'Farm Fresh Protein Brown Eggs',
    category: 'dairy-eggs',
    category_name: 'Dairy & Farm Eggs',
    description: 'Large brown eggs with rich golden yolks from healthy vegetarian-fed hens.',
    price: 95.00,
    discount_percent: 10,
    unit: '12 pcs (1 Dozen)',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 10,
    name: 'Thick Greek Whole Milk Dahi',
    category: 'dairy-eggs',
    category_name: 'Dairy & Farm Eggs',
    description: 'Creamy strained dahi with natural probiotics for healthy digestion.',
    price: 75.00,
    discount_percent: 10,
    unit: '400 g tub',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 11,
    name: 'Pure Pasteurised Table Butter',
    category: 'dairy-eggs',
    category_name: 'Dairy & Farm Eggs',
    description: 'Rich, golden butter churned from fresh cream. The iconic kitchen essential.',
    price: 275.00,
    discount_percent: 5,
    unit: '500 g pack',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 12,
    name: 'Fresh Soft Malai Paneer',
    category: 'dairy-eggs',
    category_name: 'Dairy & Farm Eggs',
    description: 'Soft, succulent, and protein-rich fresh cottage cheese made from pure milk.',
    price: 98.00,
    discount_percent: 5,
    unit: '200 g pack',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },

  // 3. Bakery & Bread
  {
    id: 13,
    name: 'Artisan Multigrain Sourdough Loaf',
    category: 'bakery-bread',
    category_name: 'Bakery & Bread',
    description: 'Slow-fermented artisan crusty loaf made with natural wild yeast starter.',
    price: 110.00,
    discount_percent: 0,
    unit: '400 g loaf',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 14,
    name: '100% Whole Wheat Brown Bread',
    category: 'bakery-bread',
    category_name: 'Bakery & Bread',
    description: 'Soft, fiber-rich sliced bread made with stone-ground atta. Zero maida.',
    price: 48.00,
    discount_percent: 5,
    unit: '400 g pack',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 15,
    name: 'Flaky French Butter Croissants',
    category: 'bakery-bread',
    category_name: 'Bakery & Bread',
    description: 'Flaky, buttery, golden layers baked fresh with pure creamery butter.',
    price: 120.00,
    discount_percent: 15,
    unit: '2 pcs pack',
    stock: 16,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },

  // 4. Snacks & Munchies
  {
    id: 16,
    name: 'Jumbo California Roasted Almonds',
    category: 'snacks-munchies',
    category_name: 'Snacks & Munchies',
    description: 'Crunchy, slow-roasted almonds lightly tossed in pink Himalayan salt.',
    price: 360.00,
    discount_percent: 10,
    unit: '250 g pouch',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 17,
    name: 'Creamy All-Natural Peanut Butter',
    category: 'snacks-munchies',
    category_name: 'Snacks & Munchies',
    description: '100% roasted peanuts. High protein, zero added sugar and no palm oil.',
    price: 195.00,
    discount_percent: 10,
    unit: '350 g jar',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 18,
    name: 'Artisan 70% Dark Chocolate Bar',
    category: 'snacks-munchies',
    category_name: 'Snacks & Munchies',
    description: 'Single-origin South Indian cacao bean-to-bar dark chocolate.',
    price: 165.00,
    discount_percent: 12,
    unit: '80 g bar',
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },

  // 5. Beverages
  {
    id: 19,
    name: 'Cold-Pressed Valencia Orange Juice',
    category: 'beverages',
    category_name: 'Cold Beverages',
    description: '100% freshly squeezed Valencia oranges. No preservatives or added water.',
    price: 110.00,
    discount_percent: 10,
    unit: '300 ml bottle',
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 20,
    name: 'Traditional South Indian Filter Coffee',
    category: 'beverages',
    category_name: 'Cold Beverages',
    description: 'Strong, aromatic blend of 80% Arabica/Robusta coffee & 20% chicory.',
    price: 185.00,
    discount_percent: 5,
    unit: '200 g pack',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 21,
    name: 'Organic Whole Leaf Green Tea',
    category: 'beverages',
    category_name: 'Cold Beverages',
    description: 'Handpicked Darjeeling green tea leaves rich in health-boosting antioxidants.',
    price: 199.00,
    discount_percent: 15,
    unit: '100 g tin',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },

  // 6. Staples & Grains
  {
    id: 22,
    name: 'Royal Aged Kohinoor Basmati Rice',
    category: 'staples-grains',
    category_name: 'Pantry & Grains',
    description: '2-year aged extra-long grain aromatic basmati rice for fragrant biryani.',
    price: 240.00,
    discount_percent: 8,
    unit: '1 kg pack',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 23,
    name: 'Sharbati 100% Chakki Fresh Atta',
    category: 'staples-grains',
    category_name: 'Pantry & Grains',
    description: 'Stone-ground MP Sharbati wheat flour for soft, fluffy rotis.',
    price: 275.00,
    discount_percent: 5,
    unit: '5 kg bag',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 24,
    name: 'Wood-Pressed Cold Virgin Mustard Oil',
    category: 'staples-grains',
    category_name: 'Pantry & Grains',
    description: 'Traditional kachi ghani unrefined mustard oil rich in omega-3.',
    price: 210.00,
    discount_percent: 10,
    unit: '1 Litre Bottle',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  },

  // 7. Household & Cleaning
  {
    id: 25,
    name: 'Eco-Friendly Plant Dishwash Gel',
    category: 'household-cleaning',
    category_name: 'Eco Household',
    description: 'Cuts through tough grease with real lime power. Gentle on hands and water.',
    price: 145.00,
    discount_percent: 15,
    unit: '500 ml bottle',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    rating: 4.6
  },
  {
    id: 26,
    name: 'Bio-Enzyme Liquid Laundry Detergent',
    category: 'household-cleaning',
    category_name: 'Eco Household',
    description: 'Tough on stains, gentle on colors, with soothing natural lavender essence.',
    price: 320.00,
    discount_percent: 10,
    unit: '1 Litre bottle',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  }
];
