import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'reloop.db');
export const db = new DatabaseSync(dbPath);

// Initialize relational tables and schema
export function initDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'renter',
      avatar TEXT,
      location TEXT,
      bio TEXT,
      verified INTEGER NOT NULL DEFAULT 1,
      rating REAL NOT NULL DEFAULT 5.0,
      wallet_balance REAL NOT NULL DEFAULT 5000.0,
      deposit_locked REAL NOT NULL DEFAULT 0.0,
      earnings REAL NOT NULL DEFAULT 0.0,
      completed_rentals INTEGER NOT NULL DEFAULT 0,
      successful_sales INTEGER NOT NULL DEFAULT 0,
      repair_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rental_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      condition TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 5.0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      location TEXT NOT NULL,
      rental_price_per_day REAL NOT NULL,
      security_deposit REAL NOT NULL,
      availability TEXT NOT NULL DEFAULT 'Available Now',
      images_json TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      owner_avatar TEXT,
      owner_rating REAL NOT NULL DEFAULT 5.0,
      owner_reviews_count INTEGER NOT NULL DEFAULT 0,
      owner_response_rate TEXT DEFAULT '15 mins',
      description TEXT NOT NULL,
      features_json TEXT NOT NULL,
      specifications_json TEXT NOT NULL,
      rental_terms_json TEXT NOT NULL,
      condition_documented INTEGER NOT NULL DEFAULT 1,
      pickup_evidence_required INTEGER NOT NULL DEFAULT 1,
      total_rentals_completed INTEGER NOT NULL DEFAULT 0,
      ai_suggested_price REAL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT NOT NULL,
      renter_id TEXT NOT NULL,
      renter_name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      days INTEGER NOT NULL,
      rental_amount REAL NOT NULL,
      security_deposit REAL NOT NULL,
      platform_fee REAL NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Booking Confirmed',
      deposit_status TEXT NOT NULL DEFAULT 'Held in Escrow',
      pickup_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      location TEXT NOT NULL,
      pickup_evidence_json TEXT,
      return_evidence_json TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES rental_products(id) ON DELETE CASCADE,
      FOREIGN KEY(renter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS damage_claims (
      id TEXT PRIMARY KEY,
      rental_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      renter_id TEXT NOT NULL,
      renter_name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      before_image TEXT NOT NULL,
      after_image TEXT NOT NULL,
      difference_description TEXT NOT NULL,
      ai_confidence REAL NOT NULL DEFAULT 0.9,
      estimated_repair_cost REAL NOT NULL,
      owner_notes TEXT NOT NULL,
      renter_notes TEXT,
      status TEXT NOT NULL DEFAULT 'AI Flagged',
      admin_decision TEXT,
      final_compensation REAL DEFAULT 0.0,
      date_reported TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(rental_id) REFERENCES bookings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS repair_providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      category TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 4.9,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      distance TEXT NOT NULL,
      location TEXT NOT NULL,
      estimated_price TEXT NOT NULL,
      availability TEXT NOT NULL DEFAULT 'Accepting Jobs',
      verified INTEGER NOT NULL DEFAULT 1,
      avatar TEXT NOT NULL,
      completed_repairs INTEGER NOT NULL DEFAULT 0,
      turnaround_time TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repair_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      product_name TEXT NOT NULL,
      category TEXT NOT NULL,
      brand_model TEXT NOT NULL,
      problem_description TEXT NOT NULL,
      image TEXT,
      location TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Submitted',
      quotation_amount REAL,
      provider_id TEXT,
      provider_name TEXT,
      quotation_notes TEXT,
      submitted_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resell_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      age TEXT NOT NULL,
      condition TEXT NOT NULL,
      original_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      location TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      seller_name TEXT NOT NULL,
      seller_avatar TEXT,
      seller_rating REAL NOT NULL DEFAULT 5.0,
      description TEXT NOT NULL,
      images_json TEXT NOT NULL,
      interested_buyers INTEGER NOT NULL DEFAULT 0,
      posted_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      buyer_id TEXT,
      buyer_name TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resell_inquiries (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      buyer_id TEXT NOT NULL,
      buyer_name TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      offer_amount REAL NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES resell_products(id) ON DELETE CASCADE,
      FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      reference_id TEXT,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info',
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Check if initial seeding is needed
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  console.log('Seeding initial ReLoop relational database...');
  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  // 1. Seed Users (Demo personas)
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, phone, role, avatar, location, bio,
      verified, rating, wallet_balance, deposit_locked, earnings,
      completed_rentals, successful_sales, repair_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoUsers = [
    {
      id: 'usr-101',
      name: 'Aakash Verma',
      email: 'aakash.verma@example.com',
      password: defaultPasswordHash,
      phone: '+91 98765 43210',
      role: 'renter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      location: 'Indiranagar, Bengaluru',
      bio: 'Visual creator & photographer. Regular equipment renter & reuse advocate.',
      verified: 1,
      rating: 4.96,
      wallet_balance: 14500,
      deposit_locked: 3000,
      earnings: 42800,
      completed_rentals: 18,
      successful_sales: 6,
      repair_count: 3
    },
    {
      id: 'usr-102',
      name: 'Sneha Rao',
      email: 'sneha.rao@techfix.in',
      password: defaultPasswordHash,
      phone: '+91 98111 22334',
      role: 'repair_specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      location: 'Koramangala, Bengaluru',
      bio: 'Lead micro-electronics and motherboard diagnostics specialist. Certified repair tech.',
      verified: 1,
      rating: 4.98,
      wallet_balance: 28400,
      deposit_locked: 0,
      earnings: 98500,
      completed_rentals: 4,
      successful_sales: 2,
      repair_count: 31
    },
    {
      id: 'usr-103',
      name: 'Vikram Seth',
      email: 'vikram.seth@gmail.com',
      password: defaultPasswordHash,
      phone: '+91 98450 12345',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      location: 'HSR Layout, Bengaluru',
      bio: 'Audiophile, filmmaker, and owner of cine equipment. Monetizing dormant premium gear.',
      verified: 1,
      rating: 4.88,
      wallet_balance: 19200,
      deposit_locked: 6000,
      earnings: 64000,
      completed_rentals: 27,
      successful_sales: 9,
      repair_count: 1
    },
    {
      id: 'usr-admin',
      name: 'Admin ReLoop',
      email: 'admin@reloop.in',
      password: defaultPasswordHash,
      phone: '+91 90000 00000',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      location: 'ReLoop HQ, Bengaluru',
      bio: 'Platform trust & safety administrator and dispute arbitrator.',
      verified: 1,
      rating: 5.0,
      wallet_balance: 100000,
      deposit_locked: 0,
      earnings: 250000,
      completed_rentals: 50,
      successful_sales: 25,
      repair_count: 50
    }
  ];

  for (const u of demoUsers) {
    insertUser.run(
      u.id, u.name, u.email, u.password, u.phone, u.role, u.avatar, u.location, u.bio,
      u.verified, u.rating, u.wallet_balance, u.deposit_locked, u.earnings,
      u.completed_rentals, u.successful_sales, u.repair_count
    );
  }

  // 2. Seed Rental Products
  const insertRental = db.prepare(`
    INSERT INTO rental_products (
      id, name, category, condition, rating, reviews_count, location,
      rental_price_per_day, security_deposit, availability, images_json,
      owner_id, owner_name, owner_avatar, owner_rating, owner_reviews_count,
      owner_response_rate, description, features_json, specifications_json,
      rental_terms_json, condition_documented, pickup_evidence_required,
      total_rentals_completed, ai_suggested_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const rentalItems = [
    {
      id: 'rent-1',
      name: 'Sony Alpha A7 IV Full-Frame Camera',
      category: 'Cameras',
      condition: 'Like New',
      rating: 4.9,
      reviewsCount: 38,
      location: 'Koramangala, Bengaluru',
      rentalPricePerDay: 1200,
      securityDeposit: 6000,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ownerRating: 4.95,
      ownerReviews: 52,
      ownerResponse: '15 mins',
      description: '33MP Full-Frame Exmor R CMOS Sensor, 4K 60p 10-bit recording. Perfect for weddings, short films, and high-end commercial projects.',
      features: ['33MP Full-Frame', '4K 60fps Video', 'Dual SD card slots', 'Includes 2 Batteries & Charger', 'Lens mount cap & strap'],
      specifications: { 'Sensor': '33MP Full-Frame Exmor R', 'ISO Range': '100 - 51,200', 'Battery': '2x NP-FZ100 (Included)', 'Mount': 'Sony E-Mount' },
      rentalTerms: ['Original Government ID verification required at pickup', 'Pre-rental video condition log recorded automatically', 'Rain and dust protective gear must be used outdoors', 'Security deposit refunded within 2 hours of verified return'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 44,
      aiSuggestedPrice: 1250
    },
    {
      id: 'rent-2',
      name: 'DJI Mavic 3 Pro Cine Drone Kit',
      category: 'Cameras',
      condition: 'Brand New',
      rating: 4.95,
      reviewsCount: 24,
      location: 'HSR Layout, Bengaluru',
      rentalPricePerDay: 2200,
      securityDeposit: 10000,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ownerRating: 4.9,
      ownerReviews: 29,
      ownerResponse: '30 mins',
      description: 'Triple-camera system with Hasselblad 4/3 CMOS camera, omnidirectional obstacle sensing, and 43-min flight time.',
      features: ['Hasselblad 4/3 CMOS', '3x Battery Fly-More Kit', 'DJI RC Pro Controller', 'ND Filter Set Included'],
      specifications: { 'Max Flight Time': '43 mins per battery', 'Video': '5.1K Apple ProRes / 4K 120fps', 'Weight': '958 grams', 'Transmission': '15km O3+' },
      rentalTerms: ['Drone pilot experience required or brief orientation check', 'Comes with full propeller guards and hardcase', 'GPS log auto-synced with rental check-in'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 19,
      aiSuggestedPrice: 2150
    },
    {
      id: 'rent-3',
      name: 'Apple MacBook Pro 16" (M3 Max, 64GB RAM)',
      category: 'Laptops',
      condition: 'Like New',
      rating: 4.88,
      reviewsCount: 19,
      location: 'Indiranagar, Bengaluru',
      rentalPricePerDay: 1800,
      securityDeposit: 15000,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-101',
      ownerName: 'Aakash Verma',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ownerRating: 5.0,
      ownerReviews: 41,
      ownerResponse: '5 mins',
      description: 'Supercharged power for 3D rendering, machine learning modeling, and 8K multi-stream video editing. Pristine condition with AppleCare+ coverage.',
      features: ['M3 Max 16-core CPU, 40-core GPU', '64GB Unified Memory', '2TB Ultra-fast SSD', 'Liquid Retina XDR Display'],
      specifications: { 'Processor': 'Apple M3 Max', 'RAM': '64GB Unified', 'Storage': '2TB SSD', 'Battery Health': '98%' },
      rentalTerms: ['Standard data wiping protocol performed before and after rental', 'Includes original MagSafe 140W charger and hard shell sleeve'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 31,
      aiSuggestedPrice: 1750
    },
    {
      id: 'rent-4',
      name: 'Bosch Professional 18V Cordless Power Drill & Tool Kit',
      category: 'Tools',
      condition: 'Good Condition',
      rating: 4.75,
      reviewsCount: 56,
      location: 'Whitefield, Bengaluru',
      rentalPricePerDay: 350,
      securityDeposit: 1500,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ownerRating: 4.8,
      ownerReviews: 63,
      ownerResponse: '40 mins',
      description: 'Heavy duty brushless combi drill, complete bit set (masonry, wood, metal), 2x 4.0Ah batteries, and fast charger in robust L-BOXX.',
      features: ['18V Brushless Motor', '60Nm Torque', '28pc Drill Bit Accessories', 'Heavy-duty Carry Case'],
      specifications: { 'Voltage': '18V Li-ion', 'Chuck Capacity': '13mm Keyless', 'Weight': '1.8 kg' },
      rentalTerms: ['Safety goggles and work gloves provided free of charge', 'Clean before return'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 88,
      aiSuggestedPrice: 350
    },
    {
      id: 'rent-5',
      name: 'Breville Barista Touch Espresso Machine',
      category: 'Appliances',
      condition: 'Like New',
      rating: 4.92,
      reviewsCount: 16,
      location: 'Jayanagar, Bengaluru',
      rentalPricePerDay: 750,
      securityDeposit: 4000,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-101',
      ownerName: 'Aakash Verma',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ownerRating: 4.95,
      ownerReviews: 22,
      ownerResponse: '10 mins',
      description: 'Automated touchscreen cafe-quality espresso machine with ThermoJet 3-second heat up and automatic microfoam milk texturing.',
      features: ['Integrated Burr Grinder', 'Touchscreen preset drinks', 'ThermoJet Fast Heat', 'Includes Milk Pitcher & Tamper'],
      specifications: { 'Capacity': '2L Water Tank', 'Pressure': '15 Bar Italian Pump', 'Heating': 'ThermoJet System' },
      rentalTerms: ['Use only filtered or bottled water to prevent scale', 'Includes complimentary bag of freshly roasted beans'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 23,
      aiSuggestedPrice: 800
    },
    {
      id: 'rent-6',
      name: 'Oculus Meta Quest 3 VR Gaming Headset (512GB)',
      category: 'Electronics',
      condition: 'Like New',
      rating: 4.85,
      reviewsCount: 42,
      location: 'Indiranagar, Bengaluru',
      rentalPricePerDay: 650,
      securityDeposit: 3500,
      availability: 'Available Now',
      images: [
        'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80'
      ],
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ownerRating: 4.88,
      ownerReviews: 39,
      ownerResponse: '15 mins',
      description: 'Breakthrough mixed reality headset with 4K+ Infinite Display, Snapdragon XR2 Gen 2, and 20+ top VR titles pre-installed.',
      features: ['512GB Storage', '2x Touch Plus Controllers', 'Silicone hygiene cover', 'Carrying case & link cable'],
      specifications: { 'Display': '2064x2208 per eye', 'Refresh Rate': '120Hz', 'Audio': 'Spatial 3D Audio' },
      rentalTerms: ['Sanitized silicone face interface swapped per booking', 'Keep away from direct sunlight on optical lenses'],
      conditionDocumented: 1,
      pickupEvidenceRequired: 1,
      totalRentals: 52,
      aiSuggestedPrice: 650
    }
  ];

  for (const r of rentalItems) {
    insertRental.run(
      r.id, r.name, r.category, r.condition, r.rating, r.reviewsCount, r.location,
      r.rentalPricePerDay, r.securityDeposit, r.availability, JSON.stringify(r.images),
      r.ownerId, r.ownerName, r.ownerAvatar, r.ownerRating, r.ownerReviews,
      r.ownerResponse, r.description, JSON.stringify(r.features), JSON.stringify(r.specifications),
      JSON.stringify(r.rentalTerms), r.conditionDocumented, r.pickupEvidenceRequired,
      r.totalRentals, r.aiSuggestedPrice
    );
  }

  // 3. Seed Resell Products
  const insertResell = db.prepare(`
    INSERT INTO resell_products (
      id, name, category, brand, age, condition, original_price, selling_price,
      location, seller_id, seller_name, seller_avatar, seller_rating, description,
      images_json, interested_buyers, posted_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const resellItems = [
    {
      id: 'resell-1',
      name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      category: 'Electronics',
      brand: 'Sony',
      age: '6 months',
      condition: 'Like New',
      originalPrice: 29990,
      sellingPrice: 18500,
      location: 'Koramangala, Bengaluru',
      sellerId: 'usr-101',
      sellerName: 'Aakash Verma',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sellerRating: 4.95,
      description: 'Used lightly for remote work. Flawless acoustic drivers, pristine ear cushions, comes with original hard case, audio cable, and invoice.',
      images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'],
      interestedBuyers: 7,
      postedDate: '2 days ago',
      status: 'active'
    },
    {
      id: 'resell-2',
      name: 'LG 27" 4K UHD UltraFine IPS Monitor (USB-C 90W PD)',
      category: 'Electronics',
      brand: 'LG',
      age: '1.2 years',
      condition: 'Good Condition',
      originalPrice: 38000,
      sellingPrice: 21000,
      location: 'HSR Layout, Bengaluru',
      sellerId: 'usr-103',
      sellerName: 'Vikram Seth',
      sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      sellerRating: 4.88,
      description: 'Upgraded to dual studio displays. Zero dead pixels, height-adjustable ergonomic stand, USB-C single cable setup for Mac & PC.',
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'],
      interestedBuyers: 12,
      postedDate: 'Yesterday',
      status: 'active'
    },
    {
      id: 'resell-3',
      name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
      category: 'Electronics',
      brand: 'Keychron',
      age: '4 months',
      condition: 'Like New',
      originalPrice: 18500,
      sellingPrice: 12200,
      location: 'Indiranagar, Bengaluru',
      sellerId: 'usr-102',
      sellerName: 'Sneha Rao',
      sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      sellerRating: 4.98,
      description: 'Full CNC aluminum body, lubed Gateron Jupiter Banana switches, double-shot PBT keycaps. Works over Bluetooth 5.1 and Type-C.',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'],
      interestedBuyers: 5,
      postedDate: '3 days ago',
      status: 'active'
    }
  ];

  for (const item of resellItems) {
    insertResell.run(
      item.id, item.name, item.category, item.brand, item.age, item.condition,
      item.originalPrice, item.sellingPrice, item.location, item.sellerId, item.sellerName,
      item.sellerAvatar, item.sellerRating, item.description, JSON.stringify(item.images),
      item.interestedBuyers, item.postedDate, item.status
    );
  }

  // 4. Seed Repair Providers
  const insertProvider = db.prepare(`
    INSERT INTO repair_providers (
      id, name, specialization, category, rating, reviews_count, distance,
      location, estimated_price, availability, verified, avatar, completed_repairs, turnaround_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const providers = [
    {
      id: 'prov-1',
      name: 'Sneha MicroTech Studio',
      specialization: 'Logic board diagnostics, BGA soldering & micro-soldering',
      category: 'Laptops',
      rating: 4.98,
      reviewsCount: 142,
      distance: '1.2 km away',
      location: 'Koramangala, Bengaluru',
      estimatedPrice: '₹800 - ₹3,500',
      availability: 'Accepting Jobs',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      completedRepairs: 340,
      turnaroundTime: '24-48 hrs'
    },
    {
      id: 'prov-2',
      name: 'OpticLens Precision Labs',
      specialization: 'Shutter replacement, sensor calibration, optical fungus clean',
      category: 'Cameras',
      rating: 4.92,
      reviewsCount: 96,
      distance: '2.8 km away',
      location: 'Indiranagar, Bengaluru',
      estimatedPrice: '₹1,200 - ₹4,800',
      availability: 'Accepting Jobs',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      completedRepairs: 215,
      turnaroundTime: '2-3 days'
    },
    {
      id: 'prov-3',
      name: 'VoltFix Power Hardware',
      specialization: 'Drill motor rewinding, battery rebuilds, appliance motor repair',
      category: 'Tools',
      rating: 4.86,
      reviewsCount: 78,
      distance: '3.5 km away',
      location: 'Whitefield, Bengaluru',
      estimatedPrice: '₹450 - ₹1,800',
      availability: 'Accepting Jobs',
      verified: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      completedRepairs: 180,
      turnaroundTime: 'Same day'
    }
  ];

  for (const p of providers) {
    insertProvider.run(
      p.id, p.name, p.specialization, p.category, p.rating, p.reviewsCount,
      p.distance, p.location, p.estimatedPrice, p.availability, p.verified,
      p.avatar, p.completedRepairs, p.turnaroundTime
    );
  }

  // 5. Seed Bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      id, product_id, product_name, product_image, renter_id, renter_name,
      owner_id, owner_name, start_date, end_date, days, rental_amount,
      security_deposit, platform_fee, total_amount, status, deposit_status,
      pickup_date, return_date, location, pickup_evidence_json, return_evidence_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialBookings = [
    {
      id: 'bk-8421',
      productId: 'rent-1',
      productName: 'Sony Alpha A7 IV Full-Frame Camera',
      productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      renterId: 'usr-101',
      renterName: 'Aakash Verma',
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      startDate: '2026-08-20',
      endDate: '2026-08-23',
      days: 3,
      rentalAmount: 3600,
      securityDeposit: 6000,
      platformFee: 230,
      totalAmount: 9830,
      status: 'Booking Confirmed',
      depositStatus: 'Held in Escrow',
      pickupDate: '2026-08-20 (10:00 AM)',
      returnDate: '2026-08-23 (06:00 PM)',
      location: 'Koramangala, Bengaluru',
      pickupEvidence: JSON.stringify({ verified: true, photosCount: 4, timestamp: '2026-08-20T10:15:00Z' }),
      returnEvidence: null
    },
    {
      id: 'bk-7910',
      productId: 'rent-4',
      productName: 'Bosch Professional 18V Cordless Power Drill',
      productImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
      renterId: 'usr-101',
      renterName: 'Aakash Verma',
      ownerId: 'usr-103',
      ownerName: 'Vikram Seth',
      startDate: '2026-08-10',
      endDate: '2026-08-12',
      days: 2,
      rentalAmount: 700,
      securityDeposit: 1500,
      platformFee: 85,
      totalAmount: 2285,
      status: 'Deposit Refunded',
      depositStatus: 'Released',
      pickupDate: '2026-08-10 (11:00 AM)',
      returnDate: '2026-08-12 (05:00 PM)',
      location: 'Whitefield, Bengaluru',
      pickupEvidence: JSON.stringify({ verified: true, photosCount: 2, timestamp: '2026-08-10T11:05:00Z' }),
      returnEvidence: JSON.stringify({ verified: true, conditionClean: true, timestamp: '2026-08-12T17:10:00Z' })
    }
  ];

  for (const b of initialBookings) {
    insertBooking.run(
      b.id, b.productId, b.productName, b.productImage, b.renterId, b.renterName,
      b.ownerId, b.ownerName, b.startDate, b.endDate, b.days, b.rentalAmount,
      b.securityDeposit, b.platformFee, b.totalAmount, b.status, b.depositStatus,
      b.pickupDate, b.returnDate, b.location, b.pickupEvidence, b.returnEvidence
    );
  }

  // 6. Seed Repair Requests
  const insertRepair = db.prepare(`
    INSERT INTO repair_requests (
      id, user_id, user_name, product_name, category, brand_model, problem_description,
      image, location, preferred_date, status, quotation_amount, provider_id, provider_name,
      quotation_notes, submitted_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialRepairs = [
    {
      id: 'rep-4102',
      userId: 'usr-101',
      userName: 'Aakash Verma',
      productName: 'Sony FE 24-70mm f/2.8 GM Lens',
      category: 'Cameras',
      brandModel: 'Sony SEL2470GM',
      problemDescription: 'Stiff manual zoom ring rotation between 35mm and 50mm. Small dust fleck visible on rear element.',
      image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80',
      location: 'Indiranagar, Bengaluru',
      preferredDate: '2026-08-25',
      status: 'Quotation',
      quotationAmount: 2200,
      providerId: 'prov-2',
      providerName: 'OpticLens Precision Labs',
      quotationNotes: 'Helicoid barrel re-greasing with synthetic optical lubricant + ultrasonic lens clean.',
      submittedDate: '2026-08-22'
    }
  ];

  for (const rep of initialRepairs) {
    insertRepair.run(
      rep.id, rep.userId, rep.userName, rep.productName, rep.category, rep.brandModel,
      rep.problemDescription, rep.image, rep.location, rep.preferredDate, rep.status,
      rep.quotationAmount, rep.providerId, rep.providerName, rep.quotationNotes, rep.submittedDate
    );
  }

  // 7. Seed Damage Claims
  const insertClaim = db.prepare(`
    INSERT INTO damage_claims (
      id, rental_id, product_id, product_name, renter_id, renter_name,
      owner_id, owner_name, before_image, after_image, difference_description,
      ai_confidence, estimated_repair_cost, owner_notes, renter_notes,
      status, date_reported
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertClaim.run(
    'clm-9102',
    'bk-8421',
    'rent-1',
    'Sony Alpha A7 IV Full-Frame Camera',
    'usr-101',
    'Aakash Verma',
    'usr-103',
    'Vikram Seth',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    'Optical difference detected on outer lens mount ring edge. Hairline surface scratch 1.8mm long.',
    0.94,
    3500,
    'Returned with hairline abrasion on the metal chassis near the HDMI port latch.',
    'Chassis was kept in the padded camera bag at all times. Requesting arbitrator review.',
    'Under Review',
    '2026-08-23'
  );

  // 8. Seed Initial Transactions
  const insertTx = db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertTx.run('tx-001', 'usr-101', 'rental_payment', 3600, 'completed', 'bk-8421', 'Rental payment for Sony A7 IV (3 days)');
  insertTx.run('tx-002', 'usr-101', 'deposit_lock', 6000, 'completed', 'bk-8421', 'Escrow security deposit held');
  insertTx.run('tx-003', 'usr-101', 'deposit_refund', 1500, 'completed', 'bk-7910', '100% deposit refunded after verified return of Bosch drill');

  console.log('Database initialized and seeded successfully.');
}
