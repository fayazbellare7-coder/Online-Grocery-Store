import bcrypt from 'bcryptjs';
import db, { initDatabase } from './index.js';

export async function seedDatabase() {
  console.log('🌱 Starting FreshCart database seeding...');
  initDatabase();

  // Clean existing data
  db.exec(`
    DELETE FROM order_status_history;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart_items;
    DELETE FROM wishlist_items;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM addresses;
    DELETE FROM delivery_slots;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  // 1. Create Users
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
  const userPasswordHash = bcrypt.hashSync('User@123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  const adminResult = insertUser.run(
    'Alex Admin',
    'admin@freshcart.com',
    adminPasswordHash,
    '+1 (555) 019-2834',
    'admin'
  );
  const adminId = adminResult.lastInsertRowid;

  const userResult = insertUser.run(
    'Sarah Johnson',
    'user@freshcart.com',
    userPasswordHash,
    '+1 (555) 012-3456',
    'customer'
  );
  const userId = userResult.lastInsertRowid;

  console.log('👥 Users seeded:');
  console.log('   - Admin: admin@freshcart.com / Admin@123');
  console.log('   - Customer: user@freshcart.com / User@123');

  // 2. Create Saved Addresses for Customer
  const insertAddress = db.prepare(`
    INSERT INTO addresses (user_id, label, line1, line2, city, state, pincode, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const addr1 = insertAddress.run(
    userId,
    'Home',
    '452 Evergreen Terrace',
    'Apt 4B',
    'Springfield',
    'OR',
    '97477',
    1
  );

  const addr2 = insertAddress.run(
    userId,
    'Work',
    '742 Tech Boulevard',
    'Floor 3, Innovation Labs',
    'Springfield',
    'OR',
    '97478',
    0
  );

  // 3. Create Categories
  const categories = [
    {
      name: 'Fruits & Vegetables',
      slug: 'fruits-vegetables',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
      description: 'Farm-fresh organic fruits and crisp seasonal vegetables'
    },
    {
      name: 'Dairy & Eggs',
      slug: 'dairy-eggs',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      description: 'Fresh milk, artisanal cheeses, butter, and free-range eggs'
    },
    {
      name: 'Bakery & Bread',
      slug: 'bakery-bread',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      description: 'Oven-fresh bread, pastries, artisanal sourdough, and buns'
    },
    {
      name: 'Snacks & Munchies',
      slug: 'snacks-munchies',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281240?w=600&auto=format&fit=crop&q=80',
      description: 'Crunchy chips, healthy roasted nuts, cookies, and dark chocolates'
    },
    {
      name: 'Beverages',
      slug: 'beverages',
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80',
      description: 'Cold-pressed juices, organic kombucha, tea, coffee, and sodas'
    },
    {
      name: 'Staples & Grains',
      slug: 'staples-grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: 'Premium rice, whole wheat flour, lentils, oils, and spices'
    },
    {
      name: 'Household & Cleaning',
      slug: 'household-cleaning',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
      description: 'Eco-friendly detergents, cleaners, kitchen rolls, and sanitizers'
    }
  ];

  const insertCategory = db.prepare(`
    INSERT INTO categories (name, slug, image, description)
    VALUES (?, ?, ?, ?)
  `);

  const categoryMap = {};
  for (const cat of categories) {
    const res = insertCategory.run(cat.name, cat.slug, cat.image, cat.description);
    categoryMap[cat.slug] = res.lastInsertRowid;
  }

  // 4. Create 45+ Realistic Products
  const products = [
    // Fruits & Vegetables
    {
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
    {
      category_slug: 'snacks-munchies',
      name: 'White Cheddar Popcorn (Air-Popped)',
      description: 'Fluffy whole-grain popcorn dusted with creamy aged white cheddar seasoning.',
      price: 2.79,
      discount_percent: 0,
      unit: '180 g bag',
      stock: 28,
      image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
      is_active: 1
    },

    // Beverages
    {
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
    {
      category_slug: 'beverages',
      name: 'Unsweetened Creamy Almond Milk',
      description: 'Plant-based dairy-free milk made with California almonds. Zero added sugars and calcium enriched.',
      price: 3.29,
      discount_percent: 0,
      unit: '1.89 L (64 oz)',
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1568651347343-4554286dc266?w=600&auto=format&fit=crop&q=80',
      is_active: 1
    },

    // Staples & Grains
    {
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
    {
      category_slug: 'staples-grains',
      name: 'Organic Tri-Color Royal Quinoa',
      description: 'Complete plant protein loaded with all 9 essential amino acids and dietary fiber. Pre-washed.',
      price: 5.99,
      discount_percent: 15,
      unit: '900 g bag',
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      is_active: 1
    },
    {
      category_slug: 'staples-grains',
      name: 'Coarse Pink Himalayan Rock Salt',
      description: 'Mineral-rich unrefined crystal salt with 84 essential trace minerals. Includes built-in grinder.',
      price: 3.99,
      discount_percent: 0,
      unit: '300 g grinder',
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
      is_active: 1
    },

    // Household & Cleaning
    {
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

  const insertProduct = db.prepare(`
    INSERT INTO products (category_id, name, description, price, discount_percent, unit, stock, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const productIds = [];
  for (const prod of products) {
    const categoryId = categoryMap[prod.category_slug];
    const res = insertProduct.run(
      categoryId,
      prod.name,
      prod.description,
      prod.price,
      prod.discount_percent,
      prod.unit,
      prod.stock,
      prod.image_url,
      prod.is_active
    );
    productIds.push(res.lastInsertRowid);
  }
  console.log(`📦 Seeded ${products.length} products across ${categories.length} categories.`);

  // 5. Create Delivery Slots for the Next 14 Days
  const timeWindows = [
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '16:00', end: '18:00' },
    { start: '18:00', end: '20:00' }
  ];

  const insertSlot = db.prepare(`
    INSERT INTO delivery_slots (date, start_time, end_time, capacity, booked)
    VALUES (?, ?, ?, ?, ?)
  `);

  const createdSlots = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    for (const win of timeWindows) {
      // Simulate some existing bookings for realism
      const initialBooked = i === 0 && win.start === '08:00' ? 8 : (i < 3 ? Math.floor(Math.random() * 4) : 0);
      const res = insertSlot.run(dateStr, win.start, win.end, 10, initialBooked);
      createdSlots.push({
        id: res.lastInsertRowid,
        date: dateStr,
        start_time: win.start,
        end_time: win.end
      });
    }
  }
  console.log(`⏰ Seeded ${createdSlots.length} delivery slots.`);

  // 6. Create realistic sample orders for customer
  const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, address_snapshot, slot_id, slot_snapshot, payment_method, payment_status, subtotal, delivery_fee, tax, total, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, unit_snapshot, image_snapshot, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO order_status_history (order_id, status, notes, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  const sampleAddress = JSON.stringify({
    label: 'Home',
    line1: '452 Evergreen Terrace',
    line2: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    pincode: '97477'
  });

  // Sample Past Order 1: Delivered
  const pastDate1 = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const slotSnap1 = JSON.stringify({ date: createdSlots[0].date, window: '10:00 - 12:00' });
  const o1 = insertOrder.run(
    userId,
    sampleAddress,
    createdSlots[1].id,
    slotSnap1,
    'online',
    'paid',
    42.45,
    0.0,
    2.12,
    44.57,
    'Delivered',
    pastDate1.toISOString()
  );
  const o1Id = o1.lastInsertRowid;
  insertOrderItem.run(o1Id, productIds[0], 'Fresh Organic Cavendish Bananas', 1.79, '1 bunch (approx. 1 kg)', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 2);
  insertOrderItem.run(o1Id, productIds[7], 'Organic Whole Pasteurized Milk', 3.89, '1 Gallon (3.78 L)', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', 1);
  insertOrderItem.run(o1Id, productIds[8], 'Farm Fresh Free-Range Brown Eggs', 4.04, '12 pcs (1 Dozen)', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', 1);
  insertOrderItem.run(o1Id, productIds[31], 'Royal Aged Indian Basmati Rice', 10.19, '5 kg bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 1);

  insertHistory.run(o1Id, 'Placed', 'Order placed successfully online', new Date(pastDate1.getTime()).toISOString());
  insertHistory.run(o1Id, 'Confirmed', 'Payment verified and order accepted', new Date(pastDate1.getTime() + 10 * 60 * 1000).toISOString());
  insertHistory.run(o1Id, 'Packed', 'All items packed with insulated cold bags', new Date(pastDate1.getTime() + 60 * 60 * 1000).toISOString());
  insertHistory.run(o1Id, 'Out for Delivery', 'Driver Dave has picked up the delivery parcel', new Date(pastDate1.getTime() + 120 * 60 * 1000).toISOString());
  insertHistory.run(o1Id, 'Delivered', 'Package safely handed over at front door', new Date(pastDate1.getTime() + 150 * 60 * 1000).toISOString());

  // Sample Active Order 2: Out for Delivery (Great for live tracking demo!)
  const activeDate2 = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const slotSnap2 = JSON.stringify({ date: createdSlots[2].date, window: '16:00 - 18:00' });
  const o2 = insertOrder.run(
    userId,
    sampleAddress,
    createdSlots[2].id,
    slotSnap2,
    'cod',
    'pending',
    28.90,
    4.99,
    1.45,
    35.34,
    'Out for Delivery',
    activeDate2.toISOString()
  );
  const o2Id = o2.lastInsertRowid;
  insertOrderItem.run(o2Id, productIds[1], 'Crisp Honeycrisp Apples', 2.97, '1 kg (approx. 5-6 pcs)', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 2);
  insertOrderItem.run(o2Id, productIds[13], 'Artisan San Francisco Sourdough Boule', 4.49, '500 g loaf', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80', 1);
  insertOrderItem.run(o2Id, productIds[23], 'Cold-Pressed 100% Pure Orange Juice', 4.04, '1.5 Liters', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80', 2);

  insertHistory.run(o2Id, 'Placed', 'Cash on Delivery order placed', new Date(activeDate2.getTime()).toISOString());
  insertHistory.run(o2Id, 'Confirmed', 'Store confirmed order readiness', new Date(activeDate2.getTime() + 15 * 60 * 1000).toISOString());
  insertHistory.run(o2Id, 'Packed', 'Order packed and assigned to delivery agent', new Date(activeDate2.getTime() + 45 * 60 * 1000).toISOString());
  insertHistory.run(o2Id, 'Out for Delivery', 'Driver Alex is on the way (approx 20 mins)', new Date(activeDate2.getTime() + 75 * 60 * 1000).toISOString());

  // Sample Active Order 3: Placed (Can test Cancel & Reschedule!)
  const recentDate3 = new Date(Date.now() - 30 * 60 * 1000);
  const slotSnap3 = JSON.stringify({ date: createdSlots[4].date, window: '10:00 - 12:00' });
  const o3 = insertOrder.run(
    userId,
    sampleAddress,
    createdSlots[4].id,
    slotSnap3,
    'online',
    'paid',
    52.10,
    0.0,
    2.60,
    54.70,
    'Placed',
    recentDate3.toISOString()
  );
  const o3Id = o3.lastInsertRowid;
  insertOrderItem.run(o3Id, productIds[32], 'Organic Extra Virgin Olive Oil', 12.14, '750 ml bottle', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', 1);
  insertOrderItem.run(o3Id, productIds[25], 'Organic Colombian Dark Roast Ground Coffee', 7.64, '340 g (12 oz) bag', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80', 2);
  insertOrderItem.run(o3Id, productIds[19], 'Roasted & Salted California Almonds', 5.59, '350 g pouch', 'https://images.unsplash.com/photo-1508061252966-ef7fe9f5005f?w=600&auto=format&fit=crop&q=80', 1);

  insertHistory.run(o3Id, 'Placed', 'Order placed and prepaid online', recentDate3.toISOString());

  // 7. Seed Wishlist items for user
  const insertWishlist = db.prepare(`
    INSERT INTO wishlist_items (user_id, product_id)
    VALUES (?, ?)
  `);
  insertWishlist.run(userId, productIds[2]); // Hass Avocados
  insertWishlist.run(userId, productIds[6]); // Strawberries
  insertWishlist.run(userId, productIds[27]); // Matcha Powder

  console.log('✅ FreshCart database seeded successfully with rich demo data!');
}

// If executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('Seeding script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
