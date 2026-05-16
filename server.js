const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

// ============================================
// TRUST PROXY - مهم جداً لـ Railway
// ============================================
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'escapeo-secret-key-2026';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ✅ FIX 1: BASE_URL كامل لازم يتحدد صح
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: IS_PRODUCTION ? BASE_URL : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================
// SESSION & PASSPORT SETUP
// ============================================
app.use(session({
  secret: process.env.SESSION_SECRET || 'escapeo-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION,           // true على Railway (HTTPS)
    sameSite: IS_PRODUCTION ? 'none' : 'lax', // ✅ FIX 2: 'none' مهمة للـ OAuth redirect
    maxAge: 24 * 60 * 60 * 1000     // 24 ساعة
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ✅ FIX 3: callbackURL كامل مش relative
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${BASE_URL}/auth/google/callback`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  proxy: true
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
  const firstName = profile.name ? profile.name.givenName : '';
  const lastName = profile.name ? profile.name.familyName : '';

  if (!email) {
    return done(new Error('No email found in Google profile'), null);
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return done(err, null);

    if (user) {
      db.run(`UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`,
        [firstName || user.first_name, lastName || user.last_name, user.id], (err) => {
        if (err) console.error('Error updating user:', err);
      });
      return done(null, {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      });
    } else {
      db.run(`INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
        [email, bcrypt.hashSync(Math.random().toString(36), 10), firstName, lastName, 'customer'],
        function(err) {
          if (err) return done(err, null);
          return done(null, {
            id: this.lastID,
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: 'customer'
          });
        }
      );
    }
  });
}));

// ============================================
// GOOGLE AUTH ROUTES
// ============================================
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'  // بيخلي المستخدم يختار الأكونت دايماً
  })
);

// ✅ FIX 4: callback route منفصل تماماً قبل أي wildcard
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/?error=google_auth_failed',
    session: true
  }),
  (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect('/?error=google_auth_failed');
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/?error=google_auth_failed');
    }
  }
);

// ============================================
// MULTER FILE UPLOAD SETUP
// ============================================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'dest-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use('/uploads', express.static(uploadsDir));

// ============================================
// SQLITE DATABASE SETUP
// ============================================
const db = new sqlite3.Database('./escapeo.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image TEXT,
    price_per_night INTEGER NOT NULL,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    destination_id INTEGER,
    destination_name TEXT,
    duration TEXT NOT NULL,
    description TEXT,
    image TEXT,
    price INTEGER NOT NULL,
    highlights TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_number TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    destination_id INTEGER,
    package_id INTEGER,
    check_in DATE,
    check_out DATE,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    room_type TEXT DEFAULT 'standard',
    extras TEXT,
    total_price INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'card',
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, destination_id)
  )`);

  db.get("SELECT COUNT(*) as count FROM destinations", (err, row) => {
    if (err) return;
    if (row.count === 0) {
      seedData();
    }
  });
});

// ============================================
// SEED DATA
// ============================================
function seedData() {
  const seedDestinations = [
    { name: "Bali", location: "Indonesia", country: "Indonesia", category: "beach", description: "Tropical paradise with stunning beaches", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", price: 89, rating: 4.8, reviews: 234 },
    { name: "Santorini", location: "Greece", country: "Greece", category: "beach", description: "Iconic white buildings and blue domes", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", price: 145, rating: 4.9, reviews: 189 },
    { name: "Kyoto", location: "Japan", country: "Japan", category: "cultural", description: "Ancient temples and traditional culture", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", price: 120, rating: 4.7, reviews: 312 },
    { name: "Swiss Alps", location: "Switzerland", country: "Switzerland", category: "mountain", description: "Breathtaking mountain scenery", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", price: 175, rating: 4.9, reviews: 156 },
    { name: "Marrakech", location: "Morocco", country: "Morocco", category: "cultural", description: "Vibrant markets and rich history", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80", price: 75, rating: 4.6, reviews: 198 },
    { name: "Istanbul", location: "Turkey", country: "Turkey", category: "city", description: "Where East meets West - a vibrant city spanning two continents with rich history", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", price: 135, rating: 4.8, reviews: 145 },
    { name: "Maldives", location: "Maldives", country: "Maldives", category: "beach", description: "Crystal clear waters and overwater villas", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", price: 250, rating: 4.9, reviews: 267 },
    { name: "New York", location: "USA", country: "USA", category: "city", description: "The city that never sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", price: 180, rating: 4.5, reviews: 423 }
  ];

  const seedPackages = [
    { title: "Bali Bliss", destination_name: "Bali, Indonesia", duration: "7 Days", description: "Ultimate Bali experience", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", price: 1299, highlights: "Private Villa,Sunset Cruise,Temple Tour,Spa Treatment" },
    { title: "Alpine Adventure", destination_name: "Swiss Alps", duration: "10 Days", description: "Mountain adventure package", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", price: 2499, highlights: "Ski Pass,Mountain Hiking,Cable Car,Fondue Dinner" },
    { title: "Tokyo Discovery", destination_name: "Tokyo, Japan", duration: "5 Days", description: "Explore Tokyo's wonders", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", price: 1899, highlights: "Bullet Train,Sushi Masterclass,Temple Visit,Shopping Tour" },
    { title: "Greek Island Hopper", destination_name: "Santorini, Greece", duration: "8 Days", description: "Island hopping adventure", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", price: 2199, highlights: "Island Cruise,Wine Tasting,Sunset Dinner,Beach Club" }
  ];

  seedDestinations.forEach(d => {
    db.run(`INSERT INTO destinations (name, location, country, category, description, image, price_per_night, rating, reviews_count) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [d.name, d.location, d.country, d.category, d.description, d.image, d.price, d.rating, d.reviews]);
  });

  seedPackages.forEach(p => {
    db.run(`INSERT INTO packages (title, destination_name, duration, description, image, price, highlights) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [p.title, p.destination_name, p.duration, p.description, p.image, p.price, p.highlights]);
  });

  const hashedPassword = bcrypt.hashSync('demo123', 10);
  const adminPassword = bcrypt.hashSync('admin123', 10);

  db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
         ['demo@escapeo.com', hashedPassword, 'Demo', 'User', 'customer']);
  db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
         ['admin@escapeo.com', adminPassword, 'Admin', 'User', 'admin']);

  console.log('Database seeded successfully!');
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
           [email, hashedPassword, firstName, lastName], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      const token = jwt.sign({ id: this.lastID, email, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({
        token,
        user: { id: this.lastID, email, firstName, lastName, role: 'customer' }
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        phone: user.phone,
        preferredCurrency: user.preferred_currency,
        language: user.language
      }
    });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, email, first_name, last_name, role, phone, preferred_currency, language FROM users WHERE id = ?`,
         [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phone: user.phone,
      preferredCurrency: user.preferred_currency,
      language: user.language
    });
  });
});

// ============================================
// DESTINATIONS ROUTES
// ============================================
app.get('/api/destinations', (req, res) => {
  const { category, search } = req.query;
  let sql = `SELECT * FROM destinations WHERE is_active = 1`;
  const params = [];

  if (category && category !== 'all') {
    sql += ` AND category = ?`;
    params.push(category);
  }

  if (search) {
    sql += ` AND (name LIKE ? OR location LIKE ? OR country LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY rating DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/destinations/:id', (req, res) => {
  db.get(`SELECT * FROM destinations WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Destination not found' });
    res.json(row);
  });
});

app.post('/api/destinations', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  const { name, location, country, category, description, price_per_night } = req.body;

  let image = req.body.image;
  if (req.file) {
    image = '/uploads/' + req.file.filename;
  }

  db.run(`INSERT INTO destinations (name, location, country, category, description, image, price_per_night) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [name, location, country, category, description, image, price_per_night], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Destination created', image: image });
  });
});

app.put('/api/destinations/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, location, country, category, description, image, price_per_night, is_active } = req.body;

  db.run(`UPDATE destinations SET name=?, location=?, country=?, category=?, description=?, image=?, price_per_night=?, is_active=? WHERE id=?`,
         [name, location, country, category, description, image, price_per_night, is_active, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Destination updated' });
  });
});

app.delete('/api/destinations/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(`DELETE FROM destinations WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Destination deleted' });
  });
});

// ============================================
// PACKAGES ROUTES
// ============================================
app.get('/api/packages', (req, res) => {
  db.all(`SELECT * FROM packages WHERE is_active = 1`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/packages/:id', (req, res) => {
  db.get(`SELECT * FROM packages WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Package not found' });
    res.json(row);
  });
});

app.post('/api/packages', authenticateToken, requireAdmin, (req, res) => {
  const { title, destination_name, duration, description, image, price, highlights } = req.body;

  db.run(`INSERT INTO packages (title, destination_name, duration, description, image, price, highlights) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [title, destination_name, duration, description, image, price, highlights], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Package created' });
  });
});

// ============================================
// BOOKINGS ROUTES
// ============================================
app.get('/api/bookings', authenticateToken, (req, res) => {
  let sql = `SELECT b.*, u.first_name || ' ' || u.last_name as customer_name, u.email as customer_email, u.phone as customer_phone, d.name as destination_name, d.image as destination_image, d.location as destination_location, p.title as package_title, p.image as package_image, p.destination_name as package_destination 
             FROM bookings b
             LEFT JOIN users u ON b.user_id = u.id
             LEFT JOIN destinations d ON b.destination_id = d.id
             LEFT JOIN packages p ON b.package_id = p.id`;
  const params = [];

  if (req.user.role !== 'admin') {
    sql += ` WHERE b.user_id = ?`;
    params.push(req.user.id);
  }

  sql += ` ORDER BY b.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { destination_id, package_id, check_in, check_out, adults, children, room_type, extras, total_price, payment_method, special_requests } = req.body;

  const refNumber = 'ESC-' + Date.now().toString(36).toUpperCase();

  let extrasValue = null;
  if (extras !== undefined && extras !== null) {
    if (typeof extras === 'string') {
      extrasValue = extras;
    } else {
      try {
        extrasValue = JSON.stringify(extras);
      } catch (e) {
        extrasValue = String(extras);
      }
    }
  }

  db.run(`INSERT INTO bookings (ref_number, user_id, destination_id, package_id, check_in, check_out, adults, children, room_type, extras, total_price, payment_method, special_requests) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [refNumber, req.user.id, destination_id || null, package_id || null, check_in || null, check_out || null,
          adults || 1, children || 0, room_type || 'standard', extrasValue, total_price, payment_method || 'card',
          special_requests || null], function(err) {
    if (err) {
      console.error('Booking error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, ref_number: refNumber, message: 'Booking created successfully' });
  });
});

app.put('/api/bookings/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;

  db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Booking status updated' });
  });
});

app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  let sql = `DELETE FROM bookings WHERE id = ?`;
  const params = [req.params.id];

  if (req.user.role !== 'admin') {
    sql += ` AND user_id = ?`;
    params.push(req.user.id);
  }

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking cancelled' });
  });
});

// ============================================
// WISHLIST ROUTES
// ============================================
app.get('/api/wishlist', authenticateToken, (req, res) => {
  db.all(`SELECT d.* FROM wishlist w JOIN destinations d ON w.destination_id = d.id WHERE w.user_id = ?`,
         [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/wishlist', authenticateToken, (req, res) => {
  const { destination_id } = req.body;

  db.run(`INSERT OR IGNORE INTO wishlist (user_id, destination_id) VALUES (?, ?)`,
         [req.user.id, destination_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Added to wishlist' });
  });
});

app.delete('/api/wishlist/:destinationId', authenticateToken, (req, res) => {
  db.run(`DELETE FROM wishlist WHERE user_id = ? AND destination_id = ?`,
         [req.user.id, req.params.destinationId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removed from wishlist' });
  });
});

// ============================================
// ADMIN ROUTES
// ============================================
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  db.get(`SELECT COUNT(*) as total_bookings, COALESCE(SUM(total_price), 0) as total_revenue FROM bookings`, [], (err, bookingStats) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(`SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'`, [], (err, userStats) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(`SELECT COUNT(*) as pending_bookings FROM bookings WHERE status = 'pending'`, [], (err, pendingStats) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(`SELECT 
                  strftime('%Y-%m', created_at) as month,
                  COUNT(*) as bookings_count,
                  COALESCE(SUM(total_price), 0) as revenue
                FROM bookings 
                WHERE created_at >= date('now', '-6 months')
                GROUP BY strftime('%Y-%m', created_at)
                ORDER BY month`, [], (err, monthlyStats) => {
          if (err) return res.status(500).json({ error: err.message });

          db.all(`SELECT status, COUNT(*) as count FROM bookings GROUP BY status`, [], (err, statusStats) => {
            if (err) return res.status(500).json({ error: err.message });

            db.all(`SELECT d.name, COUNT(b.id) as bookings_count 
                    FROM bookings b 
                    LEFT JOIN destinations d ON b.destination_id = d.id 
                    WHERE b.destination_id IS NOT NULL
                    GROUP BY b.destination_id 
                    ORDER BY bookings_count DESC 
                    LIMIT 5`, [], (err, topDestinations) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({
                total_bookings: bookingStats.total_bookings || 0,
                total_revenue: bookingStats.total_revenue || 0,
                total_customers: userStats.total_customers || 0,
                pending_bookings: pendingStats.pending_bookings || 0,
                monthly_stats: monthlyStats || [],
                status_stats: statusStats || [],
                top_destinations: topDestinations || []
              });
            });
          });
        });
      });
    });
  });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/recent-bookings', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT b.*, u.first_name || ' ' || u.last_name as customer_name, u.email as customer_email,
          d.name as destination_name
          FROM bookings b
          LEFT JOIN users u ON b.user_id = u.id
          LEFT JOIN destinations d ON b.destination_id = d.id
          ORDER BY b.created_at DESC
          LIMIT 10`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ============================================
// USER PROFILE ROUTES
// ============================================
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, preferredCurrency, language } = req.body;

  db.run(`UPDATE users SET first_name = ?, last_name = ?, phone = ?, preferred_currency = ?, language = ? WHERE id = ?`,
         [firstName, lastName, phone, preferredCurrency, language, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile updated' });
  });
});

app.put('/api/users/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  db.get(`SELECT password FROM users WHERE id = ?`, [req.user.id], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Password updated' });
    });
  });
});

// ============================================
// CONTACT / NEWSLETTER
// ============================================
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact form:', { name, email, subject, message });
  res.json({ message: 'Message received! We will get back to you soon.' });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  console.log('Newsletter subscription:', email);
  res.json({ message: 'Thanks for subscribing!' });
});

// ============================================
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// SPA FALLBACK
// ============================================
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('============================================');
  console.log('  ESCAPEO SERVER RUNNING');
  console.log(`  ${BASE_URL}`);
  console.log('============================================');
  console.log('');
  console.log('Environment:', IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('Google OAuth Callback:', `${BASE_URL}/auth/google/callback`);
  console.log('');
  console.log('Demo Login:');
  console.log('  Customer: demo@escapeo.com / demo123');
  console.log('  Admin:    admin@escapeo.com / admin123');
  console.log('');
});