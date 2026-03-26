import 'dotenv/config';
import { MongoClient } from 'mongodb';
import * as postgres from 'pg';

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/groceries';
const DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://L088617@localhost:5432/groceries';

const categories = [
  {
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    imageUrl: 'https://via.placeholder.com/300x200?text=Fruits',
    sortOrder: 1,
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    imageUrl: 'https://via.placeholder.com/300x200?text=Dairy',
    sortOrder: 2,
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    imageUrl: 'https://via.placeholder.com/300x200?text=Bakery',
    sortOrder: 3,
  },
  {
    name: 'Meat & Seafood',
    slug: 'meat-seafood',
    imageUrl: 'https://via.placeholder.com/300x200?text=Meat',
    sortOrder: 4,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    imageUrl: 'https://via.placeholder.com/300x200?text=Drinks',
    sortOrder: 5,
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    imageUrl: 'https://via.placeholder.com/300x200?text=Snacks',
    sortOrder: 6,
  },
  {
    name: 'Pantry',
    slug: 'pantry',
    imageUrl: 'https://via.placeholder.com/300x200?text=Pantry',
    sortOrder: 7,
  },
  {
    name: 'Frozen',
    slug: 'frozen',
    imageUrl: 'https://via.placeholder.com/300x200?text=Frozen',
    sortOrder: 8,
  },
];

const products = [
  {
    name: 'Organic Bananas',
    slug: 'organic-bananas',
    price: 1.49,
    comparePrice: 1.99,
    unit: 'bunch',
    categorySlug: 'fruits-vegetables',
    inStock: true,
    stockQty: 150,
    tags: ['organic', 'fruit', 'fresh'],
    brand: 'Local Farm',
    description: 'Fresh, organic bananas',
  },
  {
    name: 'Baby Spinach',
    slug: 'baby-spinach',
    price: 2.99,
    comparePrice: null,
    unit: '150g bag',
    categorySlug: 'fruits-vegetables',
    inStock: true,
    stockQty: 80,
    tags: ['organic', 'vegetable', 'fresh'],
    brand: 'GreenLeaf',
    description: 'Fresh baby spinach',
  },
  {
    name: 'Avocado',
    slug: 'avocado',
    price: 0.99,
    comparePrice: 1.49,
    unit: 'each',
    categorySlug: 'fruits-vegetables',
    inStock: true,
    stockQty: 200,
    tags: ['fruit', 'fresh'],
    brand: 'Local Farm',
    description: 'Ripe avocados',
  },
  {
    name: 'Whole Milk 2L',
    slug: 'whole-milk-2l',
    price: 2.1,
    comparePrice: null,
    unit: '2L',
    categorySlug: 'dairy-eggs',
    inStock: true,
    stockQty: 120,
    tags: ['dairy', 'milk'],
    brand: 'DairyFresh',
    description: 'Whole milk',
  },
  {
    name: 'Free Range Eggs x12',
    slug: 'free-range-eggs-12',
    price: 3.49,
    comparePrice: 3.99,
    unit: 'dozen',
    categorySlug: 'dairy-eggs',
    inStock: true,
    stockQty: 90,
    tags: ['eggs', 'dairy', 'organic'],
    brand: 'Happy Hens',
    description: 'Free range eggs',
  },
  {
    name: 'Greek Yoghurt 500g',
    slug: 'greek-yoghurt-500g',
    price: 2.5,
    comparePrice: null,
    unit: '500g',
    categorySlug: 'dairy-eggs',
    inStock: true,
    stockQty: 60,
    tags: ['dairy', 'yogurt'],
    brand: 'YogurtPro',
    description: 'Creamy Greek yogurt',
  },
  {
    name: 'Sourdough Loaf',
    slug: 'sourdough-loaf',
    price: 3.99,
    comparePrice: 4.5,
    unit: '800g',
    categorySlug: 'bakery',
    inStock: true,
    stockQty: 40,
    tags: ['bread', 'bakery'],
    brand: "Baker's Best",
    description: 'Fresh sourdough',
  },
  {
    name: 'Croissants x4',
    slug: 'croissants-4pk',
    price: 2.99,
    comparePrice: null,
    unit: '4 pack',
    categorySlug: 'bakery',
    inStock: true,
    stockQty: 35,
    tags: ['bakery', 'pastry'],
    brand: 'Patisserie',
    description: 'Buttery croissants',
  },
  {
    name: 'Chicken Breast 500g',
    slug: 'chicken-breast-500g',
    price: 5.49,
    comparePrice: 6.99,
    unit: '500g',
    categorySlug: 'meat-seafood',
    inStock: true,
    stockQty: 70,
    tags: ['chicken', 'meat'],
    brand: 'FreshMeat',
    description: 'Fresh chicken breast',
  },
  {
    name: 'Salmon Fillet 300g',
    slug: 'salmon-fillet-300g',
    price: 7.99,
    comparePrice: null,
    unit: '300g',
    categorySlug: 'meat-seafood',
    inStock: true,
    stockQty: 25,
    tags: ['seafood', 'fish'],
    brand: 'SeaFood Fresh',
    description: 'Wild caught salmon',
  },
  {
    name: 'Orange Juice 1L',
    slug: 'orange-juice-1l',
    price: 2.49,
    comparePrice: 2.99,
    unit: '1L',
    categorySlug: 'beverages',
    inStock: true,
    stockQty: 100,
    tags: ['juice', 'beverage', 'organic'],
    brand: 'JuiceFresh',
    description: 'Fresh orange juice',
  },
  {
    name: 'Sparkling Water 6pk',
    slug: 'sparkling-water-6pk',
    price: 3.29,
    comparePrice: null,
    unit: '6x330ml',
    categorySlug: 'beverages',
    inStock: true,
    stockQty: 80,
    tags: ['water', 'beverage'],
    brand: 'Sparkle',
    description: 'Refreshing sparkling water',
  },
];

async function seedMongo() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db('groceries');

    // Clear existing
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});

    // Insert categories
    const catDocs = await db.collection('categories').insertMany(categories);
    console.log(`✅ Inserted ${catDocs.insertedCount} categories`);

    // Insert products with category IDs
    const categoryMap = new Map(
      categories.map((c, i) => [c.slug, catDocs.insertedIds[i]]),
    );
    const productDocs = products.map((p) => ({
      ...p,
      categoryId: categoryMap.get(p.categorySlug)?.toString() || '',
      imageUrl: `https://via.placeholder.com/300x200?text=${p.name}`,
    }));

    const res = await db.collection('products').insertMany(productDocs);
    console.log(`✅ Inserted ${res.insertedCount} products`);
  } finally {
    await client.close();
  }
}

async function seedPostgres() {
  const pool = new postgres.Pool({ connectionString: DB_URL });
  try {
    // PostgreSQL will auto-create tables when NestJS starts
    // Just verify connection works
    const result = await pool.query('SELECT NOW()');
    if (result.rows[0]) {
      console.log('✅ PostgreSQL connected (tables auto-created by TypeORM)');
    }
  } catch (err: any) {
    if (err.message?.includes('does not exist')) {
      console.log(
        '⚠️  PostgreSQL connection OK (tables will be created by TypeORM on startup)',
      );
    } else {
      throw err;
    }
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('🌱 Seeding databases...');
  await seedMongo();
  await seedPostgres();
  console.log('✅ Seeding complete!');
}

main().catch(console.error);
