-- MotorVault SQLite Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  avatar TEXT,
  phone TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  price REAL NOT NULL,
  mileage INTEGER NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  body_type TEXT NOT NULL,
  exterior_color TEXT NOT NULL,
  interior_color TEXT NOT NULL,
  vin TEXT NOT NULL,
  registration TEXT,
  location TEXT NOT NULL,
  condition_score INTEGER NOT NULL DEFAULT 95,
  title_status TEXT NOT NULL DEFAULT 'Clean',
  description TEXT NOT NULL,
  is_certified INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, sold
  seller_id TEXT NOT NULL,
  model_3d_type TEXT DEFAULT 'cyber_coupe', -- cyber_coupe, hyper_ev, m_spec, sport_suv, gran_turismo
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_images (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  url TEXT NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_specs (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT UNIQUE NOT NULL,
  horsepower INTEGER NOT NULL,
  top_speed INTEGER NOT NULL,
  acceleration REAL NOT NULL, -- 0-60 mph seconds
  range_or_mpg TEXT NOT NULL,
  drivetrain TEXT NOT NULL,
  battery_capacity TEXT,
  battery_health INTEGER, -- % (for EVs)
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_records (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  date TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vehicle_hotspots (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  z REAL NOT NULL,
  category TEXT NOT NULL, -- powertrain, aero, brakes, interior, battery
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, vehicle_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL, -- inquiry, test_drive, offer
  message TEXT NOT NULL,
  offer_amount REAL,
  preferred_date TEXT,
  preferred_time_slot TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, contacted
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_fuel ON vehicles(fuel);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vid ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_favorites_uid ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_vid ON inquiries(vehicle_id);
