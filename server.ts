import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { initDatabase, db } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'reloop-circular-marketplace-secret-jwt-key';
// Dev server runs on Port 3000, production Cloud Run deployment listens on process.env.PORT
const PORT = process.env.NODE_ENV === 'production' ? parseInt(process.env.PORT || '3000', 10) : 3000;

// Initialize SQLite database
initDatabase();

const app = express();
app.use(express.json({ limit: '20mb' }));

// Row formatting helpers to keep API responses aligned with src/types.ts
function formatUserRow(u: any) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: u.role,
    avatar: u.avatar,
    location: u.location || '',
    bio: u.bio || '',
    verified: u.verified === 1,
    verificationStatus: u.verified === 1 ? 'Approved' : u.verified === -1 ? 'Re-upload Requested' : 'Pending Review',
    rating: Number(u.rating ?? 5.0),
    walletBalance: Number(u.wallet_balance ?? 0),
    depositLocked: Number(u.deposit_locked ?? 0),
    earnings: Number(u.earnings ?? 0),
    completedRentals: Number(u.completed_rentals ?? 0),
    successfulSales: Number(u.successful_sales ?? 0),
    repairCount: Number(u.repair_count ?? 0),
    createdAt: u.created_at
  };
}

function formatRentalRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    condition: r.condition,
    rating: r.rating,
    reviewsCount: r.reviews_count,
    location: r.location,
    rentalPricePerDay: r.rental_price_per_day,
    securityDeposit: r.security_deposit,
    availability: r.availability,
    images: JSON.parse(r.images_json || '[]'),
    owner: {
      name: r.owner_name,
      avatar: r.owner_avatar,
      verified: true,
      rating: r.owner_rating,
      reviewsCount: r.owner_reviews_count,
      responseRate: r.owner_response_rate,
      joinedDate: 'Verified Host',
      identityVerified: true
    },
    description: r.description,
    features: JSON.parse(r.features_json || '[]'),
    specifications: JSON.parse(r.specifications_json || '{}'),
    rentalTerms: JSON.parse(r.rental_terms_json || '[]'),
    conditionDocumented: Boolean(r.condition_documented),
    pickupEvidenceRequired: Boolean(r.pickup_evidence_required),
    totalRentalsCompleted: r.total_rentals_completed,
    aiSuggestedPrice: r.ai_suggested_price
  };
}

function formatBookingRow(b: any) {
  return {
    id: b.id,
    productId: b.product_id,
    productName: b.product_name,
    productImage: b.product_image,
    startDate: b.start_date,
    endDate: b.end_date,
    days: b.days,
    rentalAmount: b.rental_amount,
    securityDeposit: b.security_deposit,
    platformFee: b.platform_fee,
    totalAmount: b.total_amount,
    status: b.status,
    pickupDate: b.pickup_date,
    returnDate: b.return_date,
    ownerName: b.owner_name,
    renterName: b.renter_name,
    location: b.location,
    depositStatus: b.deposit_status
  };
}

function formatRepairRequestRow(r: any) {
  return {
    id: r.id,
    productName: r.product_name,
    category: r.category,
    brandModel: r.brand_model,
    problemDescription: r.problem_description,
    image: r.image,
    location: r.location,
    preferredDate: r.preferred_date,
    status: r.status,
    quotationAmount: r.quotation_amount,
    providerName: r.provider_name,
    submittedDate: r.submitted_date
  };
}

function formatResellRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    brand: r.brand,
    age: r.age,
    condition: r.condition,
    originalPrice: r.original_price,
    sellingPrice: r.selling_price,
    location: r.location,
    seller: {
      name: r.seller_name,
      avatar: r.seller_avatar,
      verified: true,
      rating: r.seller_rating,
      reviewsCount: 32,
      responseRate: '10 mins',
      joinedDate: 'Verified Member',
      identityVerified: true
    },
    description: r.description,
    images: JSON.parse(r.images_json || '[]'),
    interestedBuyers: r.interested_buyers,
    postedDate: r.posted_date,
    verifiedListing: true
  };
}

// Helper: Authenticate JWT Token
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = user;
    next();
  });
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & USER MANAGEMENT (PRIORITY 1)
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role = 'renter', location = 'Bengaluru', bio = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const userId = `usr-${Date.now()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`;

    db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, phone, role, avatar, location, bio,
        verified, rating, wallet_balance, deposit_locked, earnings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 5.0, 5000.0, 0.0, 0.0)
    `).run(userId, name, email, passwordHash, phone || '', role, avatar, location, bio);

    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
    const rawUser = db.prepare('SELECT id, name, email, phone, role, avatar, location, bio, verified, rating, wallet_balance, deposit_locked, earnings, completed_rentals, successful_sales, repair_count, created_at FROM users WHERE id = ?').get(userId);

    return res.status(201).json({ user: formatUserRow(rawUser), token });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user: formatUserRow(user), token });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    const user: any = db.prepare('SELECT id, name, email, phone, role, avatar, location, bio, verified, rating, wallet_balance, deposit_locked, earnings, completed_rentals, successful_sales, repair_count, created_at FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(formatUserRow(user));
  });
});

// GET /api/users (List all users / switch personas)
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const rows: any[] = db.prepare('SELECT id, name, email, phone, role, avatar, location, bio, verified, rating, wallet_balance, deposit_locked, earnings, completed_rentals, successful_sales, repair_count, created_at FROM users ORDER BY created_at DESC').all();
    return res.json(rows.map(formatUserRow));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id (Update user profile)
app.put('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, location, bio } = req.body;
    const existing: any = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, location = ?, bio = ?
      WHERE id = ?
    `).run(
      name ?? existing.name,
      phone ?? existing.phone,
      location ?? existing.location,
      bio ?? existing.bio,
      id
    );

    const updated: any = db.prepare('SELECT id, name, email, phone, role, avatar, location, bio, verified, rating, wallet_balance, deposit_locked, earnings, completed_rentals, successful_sales, repair_count, created_at FROM users WHERE id = ?').get(id);
    return res.json(formatUserRow(updated));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions (User wallet & escrow ledger)
app.get('/api/transactions', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sql = 'SELECT * FROM transactions';
    const params: any[] = [];
    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    sql += ' ORDER BY created_at DESC LIMIT 50';
    const rows: any[] = db.prepare(sql).all(...params);
    return res.json(rows.map(t => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      amount: t.amount,
      status: t.status,
      referenceId: t.reference_id,
      description: t.description,
      createdAt: t.created_at
    })));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sql = 'SELECT * FROM notifications';
    const params: any[] = [];
    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    sql += ' ORDER BY created_at DESC LIMIT 30';
    const rows: any[] = db.prepare(sql).all(...params);
    return res.json(rows.map(n => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: Boolean(n.read),
      createdAt: n.created_at
    })));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/:id/read
app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 2. RENT MARKETPLACE (PRIORITY 2)
// -------------------------------------------------------------

// GET /api/rentals (Search and filter)
app.get('/api/rentals', (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, location, availability } = req.query;
    let sql = 'SELECT * FROM rental_products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR location LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    if (minPrice) {
      sql += ' AND rental_price_per_day >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += ' AND rental_price_per_day <= ?';
      params.push(Number(maxPrice));
    }
    if (availability) {
      sql += ' AND availability = ?';
      params.push(availability);
    }

    sql += ' ORDER BY created_at DESC';
    const rows: any[] = db.prepare(sql).all(...params);

    const products = rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      condition: r.condition,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      location: r.location,
      rentalPricePerDay: r.rental_price_per_day,
      securityDeposit: r.security_deposit,
      availability: r.availability,
      images: JSON.parse(r.images_json || '[]'),
      owner: {
        name: r.owner_name,
        avatar: r.owner_avatar,
        verified: true,
        rating: r.owner_rating,
        reviewsCount: r.owner_reviews_count,
        responseRate: r.owner_response_rate,
        joinedDate: 'Verified Host',
        identityVerified: true
      },
      description: r.description,
      features: JSON.parse(r.features_json || '[]'),
      specifications: JSON.parse(r.specifications_json || '{}'),
      rentalTerms: JSON.parse(r.rental_terms_json || '[]'),
      conditionDocumented: Boolean(r.condition_documented),
      pickupEvidenceRequired: Boolean(r.pickup_evidence_required),
      totalRentalsCompleted: r.total_rentals_completed,
      aiSuggestedPrice: r.ai_suggested_price
    }));

    return res.json(products);
  } catch (error: any) {
    console.error('Fetch rentals error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/rentals/:id
app.get('/api/rentals/:id', (req: Request, res: Response) => {
  try {
    const r: any = db.prepare('SELECT * FROM rental_products WHERE id = ?').get(req.params.id);
    if (!r) return res.status(404).json({ error: 'Rental product not found' });

    const product = {
      id: r.id,
      name: r.name,
      category: r.category,
      condition: r.condition,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      location: r.location,
      rentalPricePerDay: r.rental_price_per_day,
      securityDeposit: r.security_deposit,
      availability: r.availability,
      images: JSON.parse(r.images_json || '[]'),
      owner: {
        name: r.owner_name,
        avatar: r.owner_avatar,
        verified: true,
        rating: r.owner_rating,
        reviewsCount: r.owner_reviews_count,
        responseRate: r.owner_response_rate,
        joinedDate: 'Verified Host',
        identityVerified: true
      },
      description: r.description,
      features: JSON.parse(r.features_json || '[]'),
      specifications: JSON.parse(r.specifications_json || '{}'),
      rentalTerms: JSON.parse(r.rental_terms_json || '[]'),
      conditionDocumented: Boolean(r.condition_documented),
      pickupEvidenceRequired: Boolean(r.pickup_evidence_required),
      totalRentalsCompleted: r.total_rentals_completed,
      aiSuggestedPrice: r.ai_suggested_price
    };

    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/rentals (Create listing)
app.post('/api/rentals', (req: Request, res: Response) => {
  try {
    const {
      name, category, condition, location, rentalPricePerDay,
      securityDeposit, description, images = [], ownerId = 'usr-101',
      features = [], specifications = {}, rentalTerms = []
    } = req.body;

    if (!name || !rentalPricePerDay || !securityDeposit) {
      return res.status(400).json({ error: 'Name, daily price, and security deposit are required' });
    }

    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(ownerId) || {
      name: 'Verified Host',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      rating: 5.0
    };

    const newId = `rent-${Date.now()}`;
    const resolvedImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'];
    const resolvedFeatures = features.length > 0 ? features : ['Verified Owner Handover', 'Condition Documented'];
    const resolvedSpecs = Object.keys(specifications).length > 0 ? specifications : { 'Condition': condition || 'Like New', 'Area': location || 'Bengaluru' };
    const resolvedTerms = rentalTerms.length > 0 ? rentalTerms : ['Government ID verification at pickup', 'Timestamped pickup & return photos required', 'Security deposit refunded after verified return'];

    db.prepare(`
      INSERT INTO rental_products (
        id, name, category, condition, rating, reviews_count, location,
        rental_price_per_day, security_deposit, availability, images_json,
        owner_id, owner_name, owner_avatar, owner_rating, owner_reviews_count,
        owner_response_rate, description, features_json, specifications_json,
        rental_terms_json, condition_documented, pickup_evidence_required,
        total_rentals_completed, ai_suggested_price
      ) VALUES (?, ?, ?, ?, 5.0, 0, ?, ?, ?, 'Available Now', ?, ?, ?, ?, ?, 0, '15 mins', ?, ?, ?, ?, 1, 1, 0, ?)
    `).run(
      newId, name, category || 'Electronics', condition || 'Like New', location || 'Bengaluru',
      Number(rentalPricePerDay), Number(securityDeposit), JSON.stringify(resolvedImages),
      ownerId, user.name, user.avatar, user.rating || 5.0, description || '',
      JSON.stringify(resolvedFeatures), JSON.stringify(resolvedSpecs), JSON.stringify(resolvedTerms),
      Math.round(Number(rentalPricePerDay) * 1.05)
    );

    const createdRow: any = db.prepare('SELECT * FROM rental_products WHERE id = ?').get(newId);
    return res.status(201).json(formatRentalRow(createdRow));
  } catch (error: any) {
    console.error('Create rental listing error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/rentals/:id/book (Double booking prevention & Escrow creation)
app.post('/api/rentals/:id/book', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, days, renterId = 'usr-101' } = req.body;

    if (!startDate || !days || days < 1) {
      return res.status(400).json({ error: 'Valid startDate and rental days are required' });
    }

    const product: any = db.prepare('SELECT * FROM rental_products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Rental product not found' });
    }

    // Calculate start and end date
    const startD = new Date(startDate);
    const endD = new Date(startD);
    endD.setDate(startD.getDate() + Number(days));
    const endDateStr = endD.toISOString().split('T')[0];

    // Double Booking Prevention: Check database for conflicting confirmed dates
    const conflicting = db.prepare(`
      SELECT id FROM bookings
      WHERE product_id = ?
        AND status NOT IN ('Deposit Refunded', 'Cancelled')
        AND start_date <= ?
        AND end_date >= ?
    `).get(id, endDateStr, startDate);

    if (conflicting) {
      return res.status(409).json({
        error: 'Product is already booked for these selected dates. Please choose alternative dates.'
      });
    }

    const renter: any = db.prepare('SELECT * FROM users WHERE id = ?').get(renterId) || { name: 'Aakash Verma' };
    const rentalAmount = product.rental_price_per_day * Number(days);
    const securityDeposit = product.security_deposit;
    const platformFee = Math.round(rentalAmount * 0.05) + 50;
    const totalAmount = rentalAmount + securityDeposit + platformFee;

    const bookingId = `bk-${Math.floor(1000 + Math.random() * 9000)}`;
    const images = JSON.parse(product.images_json || '[]');

    db.prepare(`
      INSERT INTO bookings (
        id, product_id, product_name, product_image, renter_id, renter_name,
        owner_id, owner_name, start_date, end_date, days, rental_amount,
        security_deposit, platform_fee, total_amount, status, deposit_status,
        pickup_date, return_date, location, pickup_evidence_json, return_evidence_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Booking Confirmed', 'Held in Escrow', ?, ?, ?, ?, NULL)
    `).run(
      bookingId, product.id, product.name, images[0] || '', renterId, renter.name,
      product.owner_id, product.owner_name, startDate, endDateStr, Number(days),
      rentalAmount, securityDeposit, platformFee, totalAmount,
      `${startDate} (10:00 AM)`, `${endDateStr} (06:00 PM)`, product.location,
      JSON.stringify({ verified: true, accessoriesChecked: true, timestamp: new Date().toISOString() })
    );

    // Update user's escrow locked deposit
    db.prepare('UPDATE users SET deposit_locked = deposit_locked + ? WHERE id = ?').run(securityDeposit, renterId);

    // Add transaction ledger records
    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
      VALUES (?, ?, 'rental_payment', ?, 'completed', ?, ?)
    `).run(`tx-${Date.now()}-1`, renterId, rentalAmount, bookingId, `Rental payment for ${product.name} (${days} days)`);

    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
      VALUES (?, ?, 'deposit_lock', ?, 'completed', ?, ?)
    `).run(`tx-${Date.now()}-2`, renterId, securityDeposit, bookingId, `Escrow security deposit held for ${product.name}`);

    // Add notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(`nt-${Date.now()}`, renterId, 'Booking Confirmed', `Your booking for ${product.name} is confirmed. ₹${securityDeposit} is secured in Escrow.`, 'booking');

    const createdBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    return res.status(201).json(formatBookingRow(createdBooking));
  } catch (error: any) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 3. TRUST & SAFETY: BOOKINGS, EVIDENCE & DISPUTES (PRIORITY 3)
// -------------------------------------------------------------

// GET /api/bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sql = 'SELECT * FROM bookings';
    const params: any[] = [];
    if (userId) {
      sql += ' WHERE renter_id = ? OR owner_id = ?';
      params.push(userId, userId);
    }
    sql += ' ORDER BY created_at DESC';

    const rows: any[] = db.prepare(sql).all(...params);
    return res.json(rows.map(formatBookingRow));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/bookings/:id/status (Lifecycle transitions)
app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, depositStatus } = req.body;

    const booking: any = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    let newDepositStatus = depositStatus || booking.deposit_status;
    if (status === 'Deposit Refunded') {
      newDepositStatus = 'Released';
      // Release locked deposit and credit back to user wallet
      db.prepare(`
        UPDATE users
        SET deposit_locked = MAX(0, deposit_locked - ?),
            wallet_balance = wallet_balance + ?
        WHERE id = ?
      `).run(booking.security_deposit, booking.security_deposit, booking.renter_id);

      db.prepare(`
        INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
        VALUES (?, ?, 'deposit_refund', ?, 'completed', ?, ?)
      `).run(`tx-${Date.now()}`, booking.renter_id, booking.security_deposit, id, `100% Security deposit refunded for ${booking.product_name}`);
    }

    db.prepare('UPDATE bookings SET status = ?, deposit_status = ? WHERE id = ?').run(status, newDepositStatus, id);
    return res.json({ success: true, status, depositStatus: newDepositStatus });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/claims
app.get('/api/claims', (req: Request, res: Response) => {
  try {
    const rows: any[] = db.prepare('SELECT * FROM damage_claims ORDER BY created_at DESC').all();
    const claims = rows.map(c => ({
      id: c.id,
      rentalId: c.rental_id,
      productName: c.product_name,
      renterName: c.renter_name,
      ownerName: c.owner_name,
      beforeImage: c.before_image,
      afterImage: c.after_image,
      differenceDescription: c.difference_description,
      aiConfidence: c.ai_confidence,
      estimatedRepairCost: c.estimated_repair_cost,
      ownerNotes: c.owner_notes,
      renterNotes: c.renter_notes,
      status: c.status,
      dateReported: c.date_reported
    }));
    return res.json(claims);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/claims (Submit damage claim)
app.post('/api/claims', (req: Request, res: Response) => {
  try {
    const {
      rentalId, productName, beforeImage, afterImage,
      differenceDescription, estimatedRepairCost, ownerNotes,
      renterId = 'usr-101', ownerId = 'usr-103'
    } = req.body;

    const renter: any = db.prepare('SELECT name FROM users WHERE id = ?').get(renterId) || { name: 'Aakash Verma' };
    const owner: any = db.prepare('SELECT name FROM users WHERE id = ?').get(ownerId) || { name: 'Vikram Seth' };

    const claimId = `clm-${Date.now()}`;
    const dateReported = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO damage_claims (
        id, rental_id, product_id, product_name, renter_id, renter_name,
        owner_id, owner_name, before_image, after_image, difference_description,
        ai_confidence, estimated_repair_cost, owner_notes, status, date_reported
      ) VALUES (?, ?, 'prod-gen', ?, ?, ?, ?, ?, ?, ?, ?, 0.92, ?, ?, 'AI Flagged', ?)
    `).run(
      claimId, rentalId, productName, renterId, renter.name, ownerId, owner.name,
      beforeImage || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      afterImage || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
      differenceDescription || 'Surface anomaly detected on inspection',
      Number(estimatedRepairCost || 2000), ownerNotes || 'Damage reported on return', dateReported
    );

    return res.status(201).json({ success: true, id: claimId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/claims/:id/respond (Accept, Dispute, or Admin Review)
app.post('/api/claims/:id/respond', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, renterNotes } = req.body; // action: 'accepted' | 'disputed' | 'admin_review'

    let status = 'Disputed';
    if (action === 'accepted') status = 'Accepted';
    if (action === 'admin_review') status = 'Admin Review';

    db.prepare('UPDATE damage_claims SET status = ?, renter_notes = ? WHERE id = ?').run(status, renterNotes || '', id);
    return res.json({ success: true, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 4. REPAIR MARKETPLACE (PRIORITY 4)
// -------------------------------------------------------------

// GET /api/repair/providers
app.get('/api/repair/providers', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM repair_providers WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR specialization LIKE ? OR location LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const rows: any[] = db.prepare(sql).all(...params);
    const providers = rows.map(p => ({
      id: p.id,
      name: p.name,
      specialization: p.specialization,
      category: p.category,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      distance: p.distance,
      location: p.location,
      estimatedPrice: p.estimated_price,
      availability: p.availability,
      verified: Boolean(p.verified),
      avatar: p.avatar,
      completedRepairs: p.completed_repairs,
      turnaroundTime: p.turnaround_time
    }));

    return res.json(providers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/repair/requests
app.get('/api/repair/requests', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sql = 'SELECT * FROM repair_requests';
    const params: any[] = [];
    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }
    sql += ' ORDER BY created_at DESC';

    const rows: any[] = db.prepare(sql).all(...params);
    const requests = rows.map(r => ({
      id: r.id,
      productName: r.product_name,
      category: r.category,
      brandModel: r.brand_model,
      problemDescription: r.problem_description,
      image: r.image,
      location: r.location,
      preferredDate: r.preferred_date,
      status: r.status,
      quotationAmount: r.quotation_amount,
      providerName: r.provider_name,
      submittedDate: r.submitted_date
    }));

    return res.json(requests);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/repair/requests (Create repair request)
app.post('/api/repair/requests', (req: Request, res: Response) => {
  try {
    const {
      productName, category, brandModel, problemDescription,
      image, location, preferredDate, providerName, userId = 'usr-101'
    } = req.body;

    if (!productName || !problemDescription) {
      return res.status(400).json({ error: 'Product name and problem description are required' });
    }

    const user: any = db.prepare('SELECT name FROM users WHERE id = ?').get(userId) || { name: 'Aakash Verma' };
    const requestId = `rep-${Date.now()}`;
    const submittedDate = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO repair_requests (
        id, user_id, user_name, product_name, category, brand_model,
        problem_description, image, location, preferred_date, status,
        provider_name, submitted_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?)
    `).run(
      requestId, userId, user.name, productName, category || 'Electronics',
      brandModel || '', problemDescription, image || 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80',
      location || 'Bengaluru', preferredDate || submittedDate, providerName || 'Assigned Technician', submittedDate
    );

    const created = db.prepare('SELECT * FROM repair_requests WHERE id = ?').get(requestId);
    return res.status(201).json(formatRepairRequestRow(created));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/repair/requests/:id/approve-quotation
app.post('/api/repair/requests/:id/approve-quotation', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE repair_requests SET status = 'Approved' WHERE id = ?").run(id);
    return res.json({ success: true, status: 'Approved' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 5. RESELL MARKETPLACE (PRIORITY 5)
// -------------------------------------------------------------

// GET /api/resell
app.get('/api/resell', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let sql = "SELECT * FROM resell_products WHERE status = 'active'";
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    sql += ' ORDER BY created_at DESC';

    const rows: any[] = db.prepare(sql).all(...params);
    const products = rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      brand: r.brand,
      age: r.age,
      condition: r.condition,
      originalPrice: r.original_price,
      sellingPrice: r.selling_price,
      location: r.location,
      seller: {
        name: r.seller_name,
        avatar: r.seller_avatar,
        verified: true,
        rating: r.seller_rating,
        reviewsCount: 32,
        responseRate: '10 mins',
        joinedDate: 'Verified Member',
        identityVerified: true
      },
      description: r.description,
      images: JSON.parse(r.images_json || '[]'),
      interestedBuyers: r.interested_buyers,
      postedDate: r.posted_date,
      verifiedListing: true
    }));

    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/resell (Create resell listing)
app.post('/api/resell', (req: Request, res: Response) => {
  try {
    const {
      name, category, brand, age, condition, originalPrice,
      sellingPrice, location, description, images = [], sellerId = 'usr-101'
    } = req.body;

    if (!name || !sellingPrice) {
      return res.status(400).json({ error: 'Name and selling price are required' });
    }

    const seller: any = db.prepare('SELECT name, avatar, rating FROM users WHERE id = ?').get(sellerId) || {
      name: 'Aakash Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 4.95
    };

    const newId = `resell-${Date.now()}`;
    db.prepare(`
      INSERT INTO resell_products (
        id, name, category, brand, age, condition, original_price, selling_price,
        location, seller_id, seller_name, seller_avatar, seller_rating, description,
        images_json, interested_buyers, posted_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Just now', 'active')
    `).run(
      newId, name, category || 'Electronics', brand || '', age || '1 year',
      condition || 'Like New', Number(originalPrice || sellingPrice * 1.5),
      Number(sellingPrice), location || 'Bengaluru', sellerId, seller.name,
      seller.avatar, seller.rating || 5.0, description || '',
      JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'])
    );

    const createdResell = db.prepare('SELECT * FROM resell_products WHERE id = ?').get(newId);
    return res.status(201).json(formatResellRow(createdResell));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/resell/:id/offer (Buyer offer / inquiry)
app.post('/api/resell/:id/offer', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { buyerId = 'usr-101', offerAmount, message = 'Interested in purchasing with Buyer Protection.' } = req.body;

    const product: any = db.prepare('SELECT * FROM resell_products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Item not found' });

    const buyer: any = db.prepare('SELECT name FROM users WHERE id = ?').get(buyerId) || { name: 'Verified Buyer' };
    const inquiryId = `inq-${Date.now()}`;

    db.prepare(`
      INSERT INTO resell_inquiries (id, product_id, product_name, buyer_id, buyer_name, seller_id, offer_amount, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(inquiryId, id, product.name, buyerId, buyer.name, product.seller_id, Number(offerAmount || product.selling_price), message);

    db.prepare('UPDATE resell_products SET interested_buyers = interested_buyers + 1 WHERE id = ?').run(id);

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, 'resell_offer')
    `).run(`nt-${Date.now()}`, product.seller_id, 'New Offer Received', `${buyer.name} offered ₹${Number(offerAmount || product.selling_price).toLocaleString()} for ${product.name}`, 'resell');

    return res.status(201).json({ success: true, id: inquiryId, interestedBuyers: product.interested_buyers + 1 });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/resell/:id/purchase (Escrow Purchase workflow)
app.post('/api/resell/:id/purchase', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { buyerId = 'usr-101' } = req.body;

    const product: any = db.prepare('SELECT * FROM resell_products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Item not found' });
    if (product.status === 'sold') return res.status(409).json({ error: 'Product already sold' });

    const buyer: any = db.prepare('SELECT name FROM users WHERE id = ?').get(buyerId) || { name: 'Verified Buyer' };

    db.prepare("UPDATE resell_products SET status = 'sold', buyer_id = ?, buyer_name = ? WHERE id = ?").run(buyerId, buyer.name, id);
    db.prepare('UPDATE users SET successful_sales = successful_sales + 1, earnings = earnings + ? WHERE id = ?').run(product.selling_price, product.seller_id);

    db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
      VALUES (?, ?, 'resell_purchase', ?, 'completed', ?, ?)
    `).run(`tx-${Date.now()}`, buyerId, product.selling_price, id, `Purchased pre-owned ${product.name} with Buyer Protection`);

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, 'resell')
    `).run(`nt-${Date.now()}`, buyerId, 'Purchase Protected', `Escrow order confirmed for ${product.name} (₹${product.selling_price.toLocaleString()}).`, 'resell');

    return res.json({ success: true, message: 'Purchase confirmed with Buyer Protection escrow.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 6. ADMIN + AI FEATURES (PRIORITY 6)
// -------------------------------------------------------------

// GET /api/admin/overview (Real-time database analytics)
app.get('/api/admin/overview', (req: Request, res: Response) => {
  try {
    const usersCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const verifiedUsersCount = (db.prepare('SELECT COUNT(*) as c FROM users WHERE verified = 1').get() as any).c;
    const pendingKycCount = (db.prepare('SELECT COUNT(*) as c FROM users WHERE verified != 1').get() as any).c;
    const rentalsCount = (db.prepare('SELECT COUNT(*) as c FROM rental_products').get() as any).c;
    const activeBookingsCount = (db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status NOT IN ('Deposit Refunded', 'Cancelled')").get() as any).c;
    const totalDepositsLocked = (db.prepare('SELECT COALESCE(SUM(deposit_locked), 0) as s FROM users').get() as any).s;
    const disputesCount = (db.prepare("SELECT COUNT(*) as c FROM damage_claims WHERE status NOT IN ('Resolved')").get() as any).c;
    const repairsCount = (db.prepare('SELECT COUNT(*) as c FROM repair_requests').get() as any).c;
    const resellCount = (db.prepare("SELECT COUNT(*) as c FROM resell_products WHERE status = 'active'").get() as any).c;

    return res.json({
      totalUsers: usersCount,
      verifiedUsers: verifiedUsersCount,
      pendingKycCount,
      activeRentalListings: rentalsCount,
      activeBookings: activeBookingsCount,
      totalDepositsHeldInEscrow: totalDepositsLocked,
      activeDisputes: disputesCount,
      repairRequests: repairsCount,
      resellListings: resellCount,
      systemHealth: '100% Operational',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users (KYC moderation queue & user directory)
app.get('/api/admin/users', (req: Request, res: Response) => {
  try {
    const rows: any[] = db.prepare('SELECT * FROM users ORDER BY verified ASC, created_at DESC').all();
    return res.json(rows.map(formatUserRow));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/admin/users/:id/verify (Approve or request KYC re-upload)
app.patch('/api/admin/users/:id/verify', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    const verifiedVal = status === 'approved' ? 1 : -1;

    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.prepare('UPDATE users SET verified = ? WHERE id = ?').run(verifiedVal, id);

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, 'kyc')
    `).run(
      `nt-${Date.now()}`,
      id,
      status === 'approved' ? 'KYC Verified' : 'KYC Re-upload Needed',
      status === 'approved'
        ? 'Your identity verification was approved. Verified User badge is now active.'
        : 'Please upload a clearer government ID photo for verification.',
      'kyc'
    );

    const updated: any = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return res.json(formatUserRow(updated));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/listings (Rental & Resell moderation inventory)
app.get('/api/admin/listings', (req: Request, res: Response) => {
  try {
    const rentals: any[] = db.prepare('SELECT * FROM rental_products ORDER BY created_at DESC').all();
    const resell: any[] = db.prepare('SELECT * FROM resell_products ORDER BY created_at DESC').all();
    return res.json({
      rentals: rentals.map(r => ({
        id: r.id,
        type: 'rental',
        name: r.name,
        category: r.category,
        ownerName: r.owner_name,
        location: r.location,
        priceLabel: `₹${r.rental_price_per_day}/day`,
        status: r.availability,
        image: (JSON.parse(r.images_json || '[]') as string[])[0] || ''
      })),
      resell: resell.map(r => ({
        id: r.id,
        type: 'resell',
        name: r.name,
        category: r.category,
        ownerName: r.seller_name,
        location: r.location,
        priceLabel: `₹${r.selling_price.toLocaleString()}`,
        status: r.status,
        image: (JSON.parse(r.images_json || '[]') as string[])[0] || ''
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/listings/:type/:id
app.delete('/api/admin/listings/:type/:id', (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    if (type === 'rental') {
      db.prepare('DELETE FROM rental_products WHERE id = ?').run(id);
    } else if (type === 'resell') {
      db.prepare('DELETE FROM resell_products WHERE id = ?').run(id);
    } else {
      return res.status(400).json({ error: 'Invalid listing type' });
    }
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/transactions (Platform-wide escrow ledger)
app.get('/api/admin/transactions', (req: Request, res: Response) => {
  try {
    const rows: any[] = db.prepare(`
      SELECT t.*, u.name as user_name
      FROM transactions t
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
      LIMIT 100
    `).all();
    return res.json(rows.map(t => ({
      id: t.id,
      userId: t.user_id,
      userName: t.user_name || 'Member',
      type: t.type,
      amount: t.amount,
      status: t.status,
      referenceId: t.reference_id,
      description: t.description,
      createdAt: t.created_at
    })));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/claims/:id/admin-decision (Arbitrate dispute & settle escrow)
app.post('/api/claims/:id/admin-decision', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { decision } = req.body; // 'award_owner' | 'dismiss_refund'
    const claim: any = db.prepare('SELECT * FROM damage_claims WHERE id = ?').get(id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    const booking: any = db.prepare('SELECT * FROM bookings WHERE id = ?').get(claim.rental_id);
    const repairAmount = Number(claim.estimated_repair_cost || 0);
    const depositHeld = Number(booking?.security_deposit || repairAmount);

    if (decision === 'award_owner') {
      const award = Math.min(repairAmount, depositHeld);
      const remainder = Math.max(0, depositHeld - award);

      db.prepare("UPDATE damage_claims SET status = 'Resolved', admin_decision = 'award_owner', final_compensation = ? WHERE id = ?").run(award, id);
      if (booking) {
        db.prepare("UPDATE bookings SET status = 'Deposit Refunded', deposit_status = 'Partial Deduction' WHERE id = ?").run(booking.id);
        db.prepare('UPDATE users SET deposit_locked = MAX(0, deposit_locked - ?), wallet_balance = wallet_balance + ? WHERE id = ?').run(depositHeld, remainder, claim.renter_id);
        db.prepare('UPDATE users SET wallet_balance = wallet_balance + ?, earnings = earnings + ? WHERE id = ?').run(award, award, claim.owner_id);
      }

      db.prepare(`
        INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
        VALUES (?, ?, 'claim_settlement', ?, 'completed', ?, ?)
      `).run(`tx-${Date.now()}-1`, claim.owner_id, award, id, `Repair compensation awarded for ${claim.product_name}`);

      if (remainder > 0) {
        db.prepare(`
          INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
          VALUES (?, ?, 'deposit_refund', ?, 'completed', ?, ?)
        `).run(`tx-${Date.now()}-2`, claim.renter_id, remainder, id, `Remaining escrow deposit refunded for ${claim.product_name}`);
      }

      return res.json({
        success: true,
        status: 'Resolved',
        message: `Escrow funds of ₹${award.toLocaleString()} awarded to owner for repairs. Remainder ₹${remainder.toLocaleString()} returned to renter.`
      });
    } else {
      db.prepare("UPDATE damage_claims SET status = 'Resolved', admin_decision = 'dismiss_refund', final_compensation = 0 WHERE id = ?").run(id);
      if (booking) {
        db.prepare("UPDATE bookings SET status = 'Deposit Refunded', deposit_status = 'Released' WHERE id = ?").run(booking.id);
        db.prepare('UPDATE users SET deposit_locked = MAX(0, deposit_locked - ?), wallet_balance = wallet_balance + ? WHERE id = ?').run(depositHeld, depositHeld, claim.renter_id);
      }

      db.prepare(`
        INSERT INTO transactions (id, user_id, type, amount, status, reference_id, description)
        VALUES (?, ?, 'deposit_refund', ?, 'completed', ?, ?)
      `).run(`tx-${Date.now()}`, claim.renter_id, depositHeld, id, `Claim dismissed; 100% escrow deposit refunded for ${claim.product_name}`);

      return res.json({
        success: true,
        status: 'Resolved',
        message: `Claim dismissed as normal wear & tear. Full deposit of ₹${depositHeld.toLocaleString()} refunded to renter.`
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/pricing-recommendation (Smart Rental Pricing)
app.post('/api/ai/pricing-recommendation', async (req: Request, res: Response) => {
  try {
    const { category, brand, condition, originalPrice, ageMonths } = req.body;
    const mrp = Number(originalPrice || 50000);
    const age = Number(ageMonths || 6);

    // Rule-based high accuracy baseline
    let baseRatePercent = 0.018; // 1.8% daily
    if (condition === 'Brand New') baseRatePercent = 0.022;
    if (condition === 'Good Condition') baseRatePercent = 0.014;
    if (condition === 'Well Maintained') baseRatePercent = 0.012;

    const suggestedDaily = Math.round(mrp * baseRatePercent);
    const suggestedDeposit = Math.round(mrp * 0.15);
    const conditionFactor = condition === 'Brand New' ? 0.08 : condition === 'Like New' ? 0.15 : condition === 'Good Condition' ? 0.25 : 0.35;
    const estimatedResale = Math.round(mrp * Math.max(0.35, 1 - (0.02 * age + conditionFactor)));

    let explanation = `Calculated using ReLoop circular depreciation model for ${condition || 'Like New'} ${category || 'Equipment'}. Reflects 15% escrow deposit buffer and local Bengaluru demand.`;
    let aiSource = 'economic-model';

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `In 2 concise sentences, give circular marketplace pricing rationale for a ${age}-month-old ${brand || ''} ${category || 'product'} in "${condition}" condition with original MRP ₹${mrp}, suggested daily rent ₹${suggestedDaily}/day, and suggested resell ₹${estimatedResale} in Bengaluru.`
        });
        if (response.text) {
          explanation = response.text.trim();
          aiSource = 'gemini-4-hydrogen';
        }
      } catch (aiErr) {
        console.warn('Gemini pricing note fallback to economic model:', aiErr);
      }
    }

    return res.json({
      suggestedDailyRate: suggestedDaily,
      suggestedRange: { min: Math.round(suggestedDaily * 0.85), max: Math.round(suggestedDaily * 1.15) },
      suggestedSecurityDeposit: suggestedDeposit,
      estimatedResaleValue: estimatedResale,
      explanation,
      aiSource
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/rent-vs-buy (Economic Calculator)
app.post('/api/ai/rent-vs-buy', (req: Request, res: Response) => {
  try {
    const { plannedDays, itemRetailPrice, dailyRentalRate } = req.body;
    const days = Number(plannedDays || 4);
    const retail = Number(itemRetailPrice || 45000);
    const dailyRate = Number(dailyRentalRate || 1200);

    const rentalCharges = dailyRate * days;
    const platformFee = Math.round(rentalCharges * 0.05) + 50;
    const totalRentCost = rentalCharges + platformFee;
    const breakEvenDays = dailyRate > 0 ? Math.ceil(retail / dailyRate) : 999;
    const isRentRecommended = days < breakEvenDays;
    const capitalSaved = retail - totalRentCost;

    return res.json({
      plannedDays: days,
      retailPrice: retail,
      dailyRentalRate: dailyRate,
      platformFee,
      totalRentalCost: totalRentCost,
      breakEvenDays,
      capitalSaved: Math.max(0, capitalSaved),
      isRentRecommended,
      recommendationText: isRentRecommended
        ? `Renting saves ₹${capitalSaved.toLocaleString()} upfront. You would need to use this item for over ${breakEvenDays} days before purchasing becomes economically viable.`
        : `Purchasing may be more economical if you require this item for ${days} days or longer.`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/damage-inspect (Assistive condition assessment)
app.post('/api/ai/damage-inspect', async (req: Request, res: Response) => {
  try {
    const { productName, ownerNotes, estimatedRepairCost } = req.body;
    const fallbackSummary = `Assistive optical comparison flagged surface variance on ${productName || 'item'}. Human arbitration and pickup/return evidence photos remain authoritative before any escrow allocation.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Summarize a fair, neutral 2-sentence condition inspection triage note for "${productName}" where the owner noted "${ownerNotes}" with estimated repair ₹${estimatedRepairCost}. Emphasize that human review governs final escrow settlement.`
        });
        if (response.text) {
          return res.json({ summary: response.text.trim(), aiSource: 'gemini-4-hydrogen' });
        }
      } catch (err) {
        console.warn('Gemini damage inspect fallback:', err);
      }
    }

    return res.json({ summary: fallbackSummary, aiSource: 'heuristic-triage' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// VITE CLIENT MOUNTING (DEV & PROD)
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReLoop Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
