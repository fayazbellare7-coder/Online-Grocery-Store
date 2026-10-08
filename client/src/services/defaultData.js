// Complete realistic catalog and default initial data for FreshCart

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
    description: 'Fresh milk, artisanal cheeses, butter, and free-range eggs'
  },
  {
    id: 3,
    name: 'Bakery & Bread',
    slug: 'bakery-bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    description: 'Oven-fresh bread, pastries, artisanal sourdough, and buns'
  },
  {
    id: 4,
    name: 'Snacks & Munchies',
    slug: 'snacks-munchies',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281240?w=600&auto=format&fit=crop&q=80',
    description: 'Crunchy chips, healthy roasted nuts, cookies, and dark chocolates'
  },
  {
    id: 5,
    name: 'Beverages',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-pressed juices, organic kombucha, tea, coffee, and sodas'
  },
  {
    id: 6,
    name: 'Staples & Grains',
    slug: 'staples-grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Premium rice, whole wheat flour, lentils, oils, and spices'
  },
  {
    id: 7,
    name: 'Household & Cleaning',
    slug: 'household-cleaning',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    description: 'Eco-friendly detergents, cleaners, kitchen rolls, and sanitizers'
  }
];

export const defaultProducts = [
  // Fruits & Vegetables
  {
    id: 1,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Organic Cavendish Bananas',
    description: 'Rich in potassium, sweet and creamy organic bananas. Perfect for smoothies or healthy snacking.',
    price: 1.99,
    discount_percent: 10,
    unit: '1 bunch (approx. 1 kg)',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 2,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Crisp Honeycrisp Apples',
    description: 'Crunchy, sweet, and juicy handpicked Honeycrisp apples freshly harvested from local orchards.',
    price: 3.49,
    discount_percent: 15,
    unit: '1 kg (approx. 5-6 pcs)',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 3,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Organic Hass Avocados',
    description: 'Ripe and ready-to-eat Hass avocados with rich creamy texture. Ideal for guacamole and toast.',
    price: 4.29,
    discount_percent: 0,
    unit: '3 pcs pack',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 4,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Vine-Ripened Roma Tomatoes',
    description: 'Bright red, firm and flavorful Roma tomatoes. Excellent for pasta sauces, salads and roasting.',
    price: 2.29,
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
    name: 'Baby Spinach Leaves (Organic)',
    description: 'Tender, washed and ready-to-eat baby spinach leaves packed with iron and vital vitamins.',
    price: 2.99,
    discount_percent: 0,
    unit: '250 g clamshell',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 6,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Fresh Hydroponic English Cucumber',
    description: 'Seedless, thin-skinned, super crisp English cucumbers with refreshing hydration.',
    price: 1.49,
    discount_percent: 0,
    unit: '2 pcs',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 7,
    category_id: 1,
    category_slug: 'fruits-vegetables',
    name: 'Sweet Strawberries Box',
    description: 'Plump, deeply red, sweet and fragrant strawberries packed with antioxidants.',
    price: 4.99,
    discount_percent: 20,
    unit: '400 g box',
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Dairy & Eggs
  {
    id: 8,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Organic Whole Pasteurized Milk',
    description: 'Rich, creamy and unadulterated whole milk from pasture-raised grass-fed cows. Vitamin D fortified.',
    price: 3.89,
    discount_percent: 0,
    unit: '1 Gallon (3.78 L)',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 9,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Farm Fresh Free-Range Brown Eggs',
    description: 'Grade A large brown eggs with rich golden yolks, laid by humanely raised free-roaming hens.',
    price: 4.49,
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
    name: 'Greek Whole Milk Plain Yogurt',
    description: 'Authentic strained thick Greek yogurt with 18g protein per serving and live active probiotics.',
    price: 4.99,
    discount_percent: 15,
    unit: '907 g (32 oz)',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 11,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Salted Pure Sweet Cream Butter',
    description: 'Churned from fresh cream with a sprinkle of sea salt. Perfect for baking, cooking, and toast.',
    price: 3.79,
    discount_percent: 0,
    unit: '454 g (4 sticks)',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 12,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Aged Sharp White Cheddar Block',
    description: 'Slowly aged for 12 months for a complex nutty flavor and smooth crumbly texture.',
    price: 5.49,
    discount_percent: 10,
    unit: '226 g (8 oz)',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 13,
    category_id: 2,
    category_slug: 'dairy-eggs',
    name: 'Fresh Mozzarella Cheese Balls',
    description: 'Soft, milky, and mild Italian-style mozzarella balls packed in water. Ideal for Caprese salad.',
    price: 4.29,
    discount_percent: 0,
    unit: '250 g',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Bakery & Bread
  {
    id: 14,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Artisan San Francisco Sourdough Boule',
    description: 'Traditional slow-fermented crusty sourdough with open crumb and delicious tang.',
    price: 4.49,
    discount_percent: 0,
    unit: '500 g loaf',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 15,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Whole Grain 100% Whole Wheat Bread',
    description: 'Soft sliced bread baked with stone-ground whole wheat, oats, and a touch of honey.',
    price: 3.29,
    discount_percent: 5,
    unit: '680 g (24 oz)',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 16,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'French Butter Croissants',
    description: 'Flaky, buttery, golden layers baked fresh daily using European cultured butter.',
    price: 4.99,
    discount_percent: 15,
    unit: '4 pcs pack',
    stock: 16,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 17,
    category_id: 3,
    category_slug: 'bakery-bread',
    name: 'Brioche Gourmet Burger Buns',
    description: 'Soft, pillowy, shiny golden-glazed French brioche buns with a melt-in-the-mouth texture.',
    price: 3.99,
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
    name: 'Blueberry Streusel Muffins',
    description: 'Moist bakery muffins loaded with real wild blueberries and topped with a cinnamon streusel crunch.',
    price: 4.49,
    discount_percent: 10,
    unit: '4 pcs box',
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Snacks & Munchies
  {
    id: 19,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Kettle-Cooked Sea Salt Potato Chips',
    description: 'Extra crunchy thick-cut potato chips batch cooked in sunflower oil and sprinkled with sea salt.',
    price: 2.99,
    discount_percent: 10,
    unit: '200 g bag',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 20,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Roasted & Salted California Almonds',
    description: 'Premium whole California almonds slowly dry-roasted to crunchy perfection.',
    price: 6.99,
    discount_percent: 20,
    unit: '350 g pouch',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1508061252966-ef7fe9f5005f?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 21,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Organic Stone-Ground Tortilla Chips',
    description: 'Authentic corn tortilla chips made with organic yellow and blue corn. Non-GMO verified.',
    price: 3.49,
    discount_percent: 0,
    unit: '300 g',
    stock: 38,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 22,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: '70% Dark Chocolate Sea Salt Bar',
    description: 'Single-origin fair-trade cocoa blended with fine flakes of Brittany sea salt.',
    price: 3.29,
    discount_percent: 0,
    unit: '100 g bar',
    stock: 55,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 23,
    category_id: 4,
    category_slug: 'snacks-munchies',
    name: 'Chewy Mixed Berry Granola Bars',
    description: 'Wholesome rolled oats with cranberries, raspberries, and sunflower seeds. No corn syrup.',
    price: 3.99,
    discount_percent: 10,
    unit: '6 bars box',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Beverages
  {
    id: 24,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Cold-Pressed 100% Pure Orange Juice',
    description: 'Never from concentrate! Squeezed from freshly picked Florida oranges with light juicy pulp.',
    price: 4.49,
    discount_percent: 10,
    unit: '1.5 Liters',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 25,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Sparkling Mineral Water (Lemon Essence)',
    description: 'Crisp, refreshing carbonated Italian spring water with natural citrus zest essence.',
    price: 2.49,
    discount_percent: 0,
    unit: '1 L Glass Bottle',
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 26,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Organic Colombian Dark Roast Ground Coffee',
    description: '100% Arabica beans roasted with hints of dark cocoa and toasted hazelnut.',
    price: 8.99,
    discount_percent: 15,
    unit: '340 g (12 oz) bag',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 27,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Organic Ginger Lemon Kombucha',
    description: 'Raw, unpasteurized fermented tea naturally effervescent and loaded with live gut probiotics.',
    price: 3.99,
    discount_percent: 0,
    unit: '473 ml (16 fl oz)',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 28,
    category_id: 5,
    category_slug: 'beverages',
    name: 'Organic Pure Japanese Matcha Powder',
    description: 'Ceremonial grade green tea matcha shade-grown in Uji, Kyoto. Rich in L-Theanine.',
    price: 14.99,
    discount_percent: 20,
    unit: '50 g tin',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Staples & Grains
  {
    id: 29,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Royal Aged Indian Basmati Rice',
    description: 'Aromatic extra long grain white basmati rice aged for 2 years. Fluffy, non-sticky texture.',
    price: 11.99,
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
    name: 'Organic Extra Virgin Olive Oil',
    description: 'Cold-extracted first press from Mediterranean olives with low acidity and fruity finish.',
    price: 13.49,
    discount_percent: 10,
    unit: '750 ml bottle',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 31,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Organic Unbleached All-Purpose Flour',
    description: 'Milled from hard red winter wheat. Ideal for artisan breads, cakes, cookies, and pizza crusts.',
    price: 4.79,
    discount_percent: 0,
    unit: '2.26 kg (5 lb) bag',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 32,
    category_id: 6,
    category_slug: 'staples-grains',
    name: 'Organic Red Split Lentils (Masoor Dal)',
    description: 'Quick-cooking high protein legumes perfect for rich hearty soups, curries, and stews.',
    price: 3.49,
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
    name: 'Pure Organic Wildflower Raw Honey',
    description: 'Unfiltered, unpasteurized raw honey harvested straight from ethical bee farms. Rich in floral aroma.',
    price: 7.99,
    discount_percent: 10,
    unit: '500 g glass jar',
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },

  // Household & Cleaning
  {
    id: 34,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Eco-Friendly Plant-Based Dish Soap (Citrus)',
    description: 'Cuts through stubborn grease with gentle biodegradable coconut surfactants. Dermatologist tested.',
    price: 3.49,
    discount_percent: 0,
    unit: '739 ml (25 fl oz)',
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 35,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Concentrated Liquid Laundry Detergent (Lavender)',
    description: 'Triple concentrated hypoallergenic formula for 64 loads. Gentle on sensitive skin, tough on stains.',
    price: 12.99,
    discount_percent: 15,
    unit: '1.5 L (64 loads)',
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 36,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: '100% Recycled 2-Ply Paper Towels',
    description: 'Super absorbent perforated sheets made with chlorine-free recycled fiber. Strong when wet.',
    price: 8.49,
    discount_percent: 10,
    unit: '6 mega rolls pack',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 37,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'All-Purpose Surface Disinfectant Spray',
    description: 'Kills 99.9% of bacteria and viruses with eucalyptus and tea tree essential oil extracts.',
    price: 4.29,
    discount_percent: 0,
    unit: '828 ml spray bottle',
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    is_active: 1
  },
  {
    id: 38,
    category_id: 7,
    category_slug: 'household-cleaning',
    name: 'Heavy Duty Coconut Fiber Scrubber Sponges',
    description: 'Non-scratch dual-sided scrubbers made from natural coconut husk and wood cellulose.',
    price: 3.99,
    discount_percent: 0,
    unit: '4 sponges pack',
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
    line1: '452 Evergreen Terrace',
    line2: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    pincode: '97477',
    is_default: true
  },
  {
    id: 2,
    user_id: 'customer-1',
    label: 'Work',
    line1: '742 Tech Boulevard',
    line2: 'Floor 3, Innovation Labs',
    city: 'Springfield',
    state: 'OR',
    pincode: '97478',
    is_default: false
  }
];

export const defaultOrders = [
  {
    id: 1001,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    address_snapshot: {
      label: 'Home',
      line1: '452 Evergreen Terrace',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'OR',
      pincode: '97477'
    },
    slot_id: 2,
    slot_snapshot: {
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      window: '10:00 - 12:00'
    },
    payment_method: 'online',
    payment_status: 'paid',
    subtotal: 42.45,
    delivery_fee: 0.0,
    tax: 2.12,
    total: 44.57,
    status: 'Delivered',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    items: [
      { id: 1, name_snapshot: 'Fresh Organic Cavendish Bananas', price_snapshot: 1.79, unit_snapshot: '1 bunch (approx. 1 kg)', image_snapshot: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 2, name_snapshot: 'Organic Whole Pasteurized Milk', price_snapshot: 3.89, unit_snapshot: '1 Gallon (3.78 L)', image_snapshot: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 3, name_snapshot: 'Farm Fresh Free-Range Brown Eggs', price_snapshot: 4.04, unit_snapshot: '12 pcs (1 Dozen)', image_snapshot: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 4, name_snapshot: 'Royal Aged Indian Basmati Rice', price_snapshot: 10.19, unit_snapshot: '5 kg bag', image_snapshot: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', quantity: 1 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Order placed successfully online', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
      { status: 'Confirmed', notes: 'Payment verified and order accepted', timestamp: new Date(Date.now() - 5 * 86400000 + 10 * 60000).toISOString() },
      { status: 'Packed', notes: 'All items packed with insulated cold bags', timestamp: new Date(Date.now() - 5 * 86400000 + 60 * 60000).toISOString() },
      { status: 'Out for Delivery', notes: 'Driver Dave has picked up the delivery parcel', timestamp: new Date(Date.now() - 5 * 86400000 + 120 * 60000).toISOString() },
      { status: 'Delivered', notes: 'Package safely handed over at front door', timestamp: new Date(Date.now() - 5 * 86400000 + 150 * 60000).toISOString() }
    ]
  },
  {
    id: 1002,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    address_snapshot: {
      label: 'Home',
      line1: '452 Evergreen Terrace',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'OR',
      pincode: '97477'
    },
    slot_id: 3,
    slot_snapshot: {
      date: new Date().toISOString().split('T')[0],
      window: '16:00 - 18:00'
    },
    payment_method: 'cod',
    payment_status: 'pending',
    subtotal: 28.90,
    delivery_fee: 4.99,
    tax: 1.45,
    total: 35.34,
    status: 'Out for Delivery',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      { id: 5, name_snapshot: 'Crisp Honeycrisp Apples', price_snapshot: 2.97, unit_snapshot: '1 kg (approx. 5-6 pcs)', image_snapshot: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 6, name_snapshot: 'Artisan San Francisco Sourdough Boule', price_snapshot: 4.49, unit_snapshot: '500 g loaf', image_snapshot: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 7, name_snapshot: 'Cold-Pressed 100% Pure Orange Juice', price_snapshot: 4.04, unit_snapshot: '1.5 Liters', image_snapshot: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80', quantity: 2 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Cash on Delivery order placed', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { status: 'Confirmed', notes: 'Store confirmed order readiness', timestamp: new Date(Date.now() - 2 * 3600000 + 15 * 60000).toISOString() },
      { status: 'Packed', notes: 'Order packed and assigned to delivery agent', timestamp: new Date(Date.now() - 2 * 3600000 + 45 * 60000).toISOString() },
      { status: 'Out for Delivery', notes: 'Driver Alex is on the way (approx 20 mins)', timestamp: new Date(Date.now() - 2 * 3600000 + 75 * 60000).toISOString() }
    ]
  },
  {
    id: 1003,
    user_id: 'customer-1',
    customer_name: 'Sarah Johnson',
    customer_email: 'user@freshcart.com',
    address_snapshot: {
      label: 'Home',
      line1: '452 Evergreen Terrace',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'OR',
      pincode: '97477'
    },
    slot_id: 5,
    slot_snapshot: {
      date: new Date().toISOString().split('T')[0],
      window: '10:00 - 12:00'
    },
    payment_method: 'online',
    payment_status: 'paid',
    subtotal: 52.10,
    delivery_fee: 0.0,
    tax: 2.60,
    total: 54.70,
    status: 'Placed',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    items: [
      { id: 8, name_snapshot: 'Organic Extra Virgin Olive Oil', price_snapshot: 12.14, unit_snapshot: '750 ml bottle', image_snapshot: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', quantity: 1 },
      { id: 9, name_snapshot: 'Organic Colombian Dark Roast Ground Coffee', price_snapshot: 7.64, unit_snapshot: '340 g (12 oz) bag', image_snapshot: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80', quantity: 2 },
      { id: 10, name_snapshot: 'Roasted & Salted California Almonds', price_snapshot: 5.59, unit_snapshot: '350 g pouch', image_snapshot: 'https://images.unsplash.com/photo-1508061252966-ef7fe9f5005f?w=600&auto=format&fit=crop&q=80', quantity: 1 }
    ],
    status_history: [
      { status: 'Placed', notes: 'Order placed and prepaid online', timestamp: new Date(Date.now() - 30 * 60000).toISOString() }
    ]
  }
];
