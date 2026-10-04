import { getDb, saveDb } from './connection.js';

export async function seed() {
  console.log('🌱 Initializing SQLite and seeding database...');
  const database = await getDb();

  // Clear existing data
  database.run(`
    DELETE FROM inquiries;
    DELETE FROM favorites;
    DELETE FROM vehicle_hotspots;
    DELETE FROM service_records;
    DELETE FROM vehicle_specs;
    DELETE FROM vehicle_images;
    DELETE FROM vehicles;
    DELETE FROM users;
  `);

  // 1. Insert Demo Users
  const users = [
    {
      id: 'usr-demo-seller',
      name: 'Alex Mercer',
      email: 'demo@motorvault.com',
      password_hash: 'password123',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '+1 (555) 234-8901',
      location: 'Silicon Valley, CA'
    },
    {
      id: 'usr-demo-buyer',
      name: 'Jordan Vance',
      email: 'buyer@motorvault.com',
      password_hash: 'password123',
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      phone: '+1 (555) 987-6543',
      location: 'Austin, TX'
    },
    {
      id: 'usr-vault-certified',
      name: 'MotorVault Certified Dealer',
      email: 'certified@motorvault.com',
      password_hash: 'password123',
      role: 'dealer',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      phone: '+1 (800) 555-VAULT',
      location: 'Los Angeles, CA'
    }
  ];

  for (const u of users) {
    database.run(
      `INSERT INTO users (id, name, email, password_hash, role, avatar, phone, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.name, u.email, u.password_hash, u.role, u.avatar, u.phone, u.location]
    );
  }

  // Vehicles Dataset
  const vehicles = [
    {
      id: 'veh-001',
      make: 'Porsche',
      model: 'Taycan Turbo S',
      year: 2023,
      trim: 'AWD Performance Battery Plus',
      price: 112500,
      mileage: 8900,
      fuel: 'Electric',
      transmission: 'Automatic 2-Speed',
      body_type: 'Sedan',
      exterior_color: 'Frozen Blue Metallic',
      interior_color: 'Black / Slate Grey Leather',
      vin: 'WP0AB2Y15PSA98231',
      registration: 'CA-8TYC99',
      location: 'San Francisco, CA',
      condition_score: 98,
      title_status: 'Clean',
      description: 'Pristine one-owner 2023 Porsche Taycan Turbo S with full carbon aero package, Porsche Ceramic Composite Brakes (PCCB), Rear-Axle Steering, and Burmester 3D Surround Sound. Always garaged and ceramic coated from delivery.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'hyper_ev',
      specs: {
        horsepower: 750,
        top_speed: 161,
        acceleration: 2.6,
        range_or_mpg: '278 Miles',
        drivetrain: 'Dual-Motor AWD',
        battery_capacity: '93.4 kWh',
        battery_health: 99
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Front 3/4 Exterior Profile' },
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Side Aero Stance' },
        { url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Driver Cockpit & Displays' },
        { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Ceramic Brakes & 21" Mission E Wheels' }
      ],
      hotspots: [
        { label: 'Battery', title: '800V Architecture', description: '99% Battery Health. 270kW peak fast charging speed verified.', x: 0, y: -0.2, z: 0, category: 'battery' },
        { label: 'Powertrain', title: 'Permanent Magnet Synchronous Motors', description: 'Dual motors producing 750 hp overboost and 774 lb-ft instant torque.', x: 0, y: 0.1, z: 1.2, category: 'powertrain' },
        { label: 'Brakes', title: 'PCCB Ceramic Composite', description: 'Brembo 10-piston front calipers. 95% pad life remaining.', x: 1.0, y: -0.25, z: 1.1, category: 'brakes' },
        { label: 'Aero', title: 'Adaptive Carbon Rear Spoiler', description: '3-stage active rear wing with zero defect actuator.', x: 0, y: 0.5, z: -1.7, category: 'aero' }
      ],
      records: [
        { date: '2024-01-15', mileage: 8200, service_type: 'Annual Inspection', description: 'Completed Porsche 10,000-mile comprehensive service, software ECU update, cabin filter replacement.' },
        { date: '2023-06-10', mileage: 4100, service_type: 'Tire & Brake Telemetry', description: 'Wheel alignment and brake fluid moisture check (passed 100%).' }
      ]
    },
    {
      id: 'veh-002',
      make: 'Tesla',
      model: 'Model S Plaid',
      year: 2024,
      trim: 'Tri-Motor AWD Carbon Edition',
      price: 84900,
      mileage: 12400,
      fuel: 'Electric',
      transmission: 'Direct Drive',
      body_type: 'Sedan',
      exterior_color: 'Midnight Cherry Red',
      interior_color: 'Cream / Carbon Fiber',
      vin: '5YJSA1E67PF781902',
      registration: 'CA-9PLD01',
      location: 'Palo Alto, CA',
      condition_score: 97,
      title_status: 'Clean',
      description: 'Sub-2-second rocket ship in flawless condition. Equipped with FSD (Full Self-Driving Capability), 21" Arachnid Wheels, Carbon Fiber interior decor, and yoke steering. Single non-smoker enthusiast owner.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'cyber_coupe',
      specs: {
        horsepower: 1020,
        top_speed: 200,
        acceleration: 1.99,
        range_or_mpg: '396 Miles',
        drivetrain: 'Tri-Motor AWD',
        battery_capacity: '100.0 kWh',
        battery_health: 98
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Model S Plaid Front View' },
        { url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Dynamic Profile Angle' },
        { url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Rear Carbon Lip Spoiler' }
      ],
      hotspots: [
        { label: 'Tri-Motor', title: 'Carbon-Sleeved Rotors', description: 'Independent torque vectoring front and rear. 1,020 peak horsepower.', x: 0, y: 0.1, z: 1.1, category: 'powertrain' },
        { label: 'Battery', title: '100 kWh High Discharge Pack', description: '98% capacity retention. Battery degradation test certified.', x: 0, y: -0.2, z: 0, category: 'battery' },
        { label: 'Cabin', title: '17" Cinematic 2200x1300 Touchscreen', description: 'Equipped with 10 teraflops gaming computer and ambient acoustics.', x: 0, y: 0.4, z: 0.1, category: 'interior' }
      ],
      records: [
        { date: '2024-03-20', mileage: 11800, service_type: 'Tesla Certification Check', description: 'Factory diagnostics, suspension dampening calibration, and tire rotation.' }
      ]
    },
    {
      id: 'veh-003',
      make: 'Audi',
      model: 'RS e-tron GT',
      year: 2023,
      trim: 'Carbon Year One Package',
      price: 94000,
      mileage: 14200,
      fuel: 'Electric',
      transmission: 'Automatic 2-Speed',
      body_type: 'Sedan',
      exterior_color: 'Daytona Gray Pearl',
      interior_color: 'Arras Red Fine Nappa Leather',
      vin: 'WAUZZZF84NA009182',
      registration: 'NV-7RSE22',
      location: 'Las Vegas, NV',
      condition_score: 96,
      title_status: 'Clean',
      description: 'Stunning Audi RS e-tron GT with every optional feature ticked. Dynamic Package Plus, Carbon Ceramic Brakes with Anthracite Calipers, Matrix-Design LED Headlights with Audi Laser Light, and Bang & Olufsen 3D Sound.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-vault-certified',
      model_3d_type: 'gran_turismo',
      specs: {
        horsepower: 637,
        top_speed: 155,
        acceleration: 3.1,
        range_or_mpg: '232 Miles',
        drivetrain: 'quattro AWD',
        battery_capacity: '93.4 kWh',
        battery_health: 97
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Audi RS e-tron GT Metallic Stance' },
        { url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Laser Headlights & Grille' },
        { url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Rear Light Strip' }
      ],
      hotspots: [
        { label: 'quattro', title: 'Electric Torque Vectoring', description: 'Sub-millisecond AWD power shifts for optimal track and street grip.', x: 0, y: 0.1, z: 1.0, category: 'powertrain' },
        { label: 'Laser Light', title: 'Audi Laser Light System', description: 'Doubles high-beam visual range at speeds over 43 mph.', x: 0.8, y: 0.2, z: 1.7, category: 'aero' }
      ],
      records: [
        { date: '2024-02-12', mileage: 13900, service_type: 'Factory 15k Service', description: '150-point safety inspection completed. 100% brake and suspension health.' }
      ]
    },
    {
      id: 'veh-004',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2022,
      trim: 'xDrive M Carbon Bucket Seats',
      price: 72800,
      mileage: 18500,
      fuel: 'Petrol',
      transmission: 'Automatic 8-Speed',
      body_type: 'Coupe',
      exterior_color: 'Isle of Man Green Metallic',
      interior_color: 'Kyalami Orange / Black Merino',
      vin: 'WBA43AZ00NFK29341',
      registration: 'TX-4M4COMP',
      location: 'Austin, TX',
      condition_score: 95,
      title_status: 'Clean',
      description: 'Iconic Isle of Man Green M4 Competition with rare M Carbon Bucket Seats and M Driver’s Package. M xDrive allows instant switching between AWD, AWD Sport, and 100% Rear-Wheel Drive drift mode.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'm_spec',
      specs: {
        horsepower: 503,
        top_speed: 180,
        acceleration: 3.4,
        range_or_mpg: '23 MPG',
        drivetrain: 'M xDrive AWD (2WD Switchable)',
        battery_capacity: 'N/A',
        battery_health: 100
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Isle of Man Green BMW M4' },
        { url: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'M Carbon Twin Exhaust Profile' }
      ],
      hotspots: [
        { label: 'S58 Engine', title: '3.0L Twin-Turbo S58 Inline-6', description: 'Forged crankshaft and 3D-printed cylinder head core producing 503 hp.', x: 0, y: 0.3, z: 1.2, category: 'powertrain' },
        { label: 'M xDrive', title: 'Active M Differential', description: 'Switchable to 100% RWD with 10-stage M Traction Control.', x: 0, y: -0.1, z: -1.0, category: 'powertrain' }
      ],
      records: [
        { date: '2023-11-04', mileage: 15200, service_type: 'M Oil Service & Spark Plugs', description: 'BMW certified synthetic oil service, differential fluid service.' }
      ]
    },
    {
      id: 'veh-005',
      make: 'Mercedes-Benz',
      model: 'AMG GT R',
      year: 2021,
      trim: 'V8 Biturbo Beast of the Green Hell',
      price: 138000,
      mileage: 11200,
      fuel: 'Petrol',
      transmission: 'Automatic 7-Speed Dual-Clutch',
      body_type: 'Coupe',
      exterior_color: 'Green Hell Magno',
      interior_color: 'Exclusive Nappa / DINAMICA',
      vin: 'WDDYJ8GA9MF039481',
      registration: 'FL-GTR900',
      location: 'Miami, FL',
      condition_score: 99,
      title_status: 'Clean',
      description: 'The legendary "Beast of the Green Hell". Carbon ceramic braking system, active aerodynamics underbody louvers, manually adjustable coil-over suspension, and AMG Track Pace telemetry. Collector grade condition.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-vault-certified',
      model_3d_type: 'cyber_coupe',
      specs: {
        horsepower: 577,
        top_speed: 198,
        acceleration: 3.5,
        range_or_mpg: '20 MPG',
        drivetrain: 'Rear-Wheel Drive (RWD)',
        battery_capacity: 'N/A',
        battery_health: 100
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'AMG GT R Coupe Aerodynamic Profile' },
        { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Panamericana Front Grille' }
      ],
      hotspots: [
        { label: 'Hot Inside V', title: '4.0L Handcrafted AMG V8 Biturbo', description: 'Dual turbochargers nestled between cylinder banks for zero lag.', x: 0, y: 0.3, z: 1.1, category: 'powertrain' },
        { label: 'Aero', title: 'Active Carbon Underbody Aerofoil', description: 'Extends 40mm downward in RACE mode creating Venturi suction effect.', x: 0, y: -0.3, z: 0.8, category: 'aero' }
      ],
      records: [
        { date: '2024-01-20', mileage: 10800, service_type: 'Mercedes-AMG Comprehensive Service', description: 'Transaxle transmission fluid replaced, ceramic pads inspected.' }
      ]
    },
    {
      id: 'veh-006',
      make: 'Rivian',
      model: 'R1T Launch Edition',
      year: 2023,
      trim: 'Quad-Motor Large Pack',
      price: 68500,
      mileage: 16800,
      fuel: 'Electric',
      transmission: 'Automatic 1-Speed',
      body_type: 'Truck',
      exterior_color: 'Rivian Blue',
      interior_color: 'Black Mountain / Dark Ash Wood',
      vin: '7FCTGAAA3PN008432',
      registration: 'CO-RIV835',
      location: 'Denver, CO',
      condition_score: 96,
      title_status: 'Clean',
      description: 'Adventure-ready Rivian R1T Launch Edition with Camp Kitchen prep, Gear Tunnel shuttle, Powered Tonneau Cover, and 20" All-Terrain wheels. Includes portable charger and Rivian wall charger.',
      is_certified: 1,
      is_featured: 0,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'sport_suv',
      specs: {
        horsepower: 835,
        top_speed: 115,
        acceleration: 3.0,
        range_or_mpg: '314 Miles',
        drivetrain: 'Quad-Motor AWD',
        battery_capacity: '135.0 kWh',
        battery_health: 98
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Rivian R1T Adventure Truck' },
        { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Off-Road Clearance Profile' }
      ],
      hotspots: [
        { label: 'Quad Motors', title: '4 Independent Motors', description: 'Zero lag torque distribution per wheel. Tank Turn capable architecture.', x: 0, y: 0.0, z: 0, category: 'powertrain' },
        { label: 'Air Suspense', title: 'Air Suspension 14.9" Max Clearance', description: 'Electro-hydraulic roll control replaces traditional anti-roll bars.', x: 0.9, y: -0.2, z: 1.0, category: 'brakes' }
      ],
      records: [
        { date: '2023-12-18', mileage: 15400, service_type: 'Tire Balancing & Firmware Update', description: 'Rivian mobile service completed routine multi-point inspection.' }
      ]
    },
    {
      id: 'veh-007',
      make: 'Porsche',
      model: '911 Carrera 4S',
      year: 2024,
      trim: '992 Generation Sport Chrono',
      price: 129900,
      mileage: 6500,
      fuel: 'Petrol',
      transmission: 'Automatic 8-Speed PDK',
      body_type: 'Coupe',
      exterior_color: 'Chalk Gray',
      interior_color: 'Bordeaux Red / Black Leather',
      vin: 'WP0AB2A93RS129845',
      registration: 'CA-992C4S',
      location: 'Newport Beach, CA',
      condition_score: 99,
      title_status: 'Clean',
      description: 'Like-new 2024 Porsche 911 Carrera 4S in coveted Chalk exterior over Bordeaux Red leather. Sport Chrono package with mode switch, Sport Exhaust System with black tailpipes, PASM Sport Suspension (-10mm), Front Axle Lift system.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'cyber_coupe',
      specs: {
        horsepower: 443,
        top_speed: 190,
        acceleration: 3.2,
        range_or_mpg: '24 MPG',
        drivetrain: 'All-Wheel Drive (AWD)',
        battery_capacity: 'N/A',
        battery_health: 100
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Porsche 911 Carrera 4S Chalk' },
        { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Aerodynamic Silhouette' }
      ],
      hotspots: [
        { label: 'Flat-6', title: '3.0L Twin-Turbo Boxer 6', description: 'Rear-mounted low center of gravity powerhouse with 443 hp.', x: 0, y: 0.2, z: -1.3, category: 'powertrain' },
        { label: 'Chrono', title: 'Sport Chrono Dial & Launch Control', description: 'Sub-3.2 second 0-60 with launch control active.', x: 0, y: 0.4, z: 0.1, category: 'interior' }
      ],
      records: [
        { date: '2024-04-10', mileage: 5900, service_type: 'Porsche First-Year Inspection', description: 'Authorized Porsche service completed with oil and filter change.' }
      ]
    },
    {
      id: 'veh-008',
      make: 'Lucid',
      model: 'Air Grand Touring',
      year: 2023,
      trim: 'AWD 819 HP Glass Canopy',
      price: 89500,
      mileage: 9100,
      fuel: 'Electric',
      transmission: 'Direct Drive',
      body_type: 'Sedan',
      exterior_color: 'Stellar White Metallic',
      interior_color: 'Tahoe Full Leather / Walnut',
      vin: '7LNAE2DA8PA001923',
      registration: 'WA-AIR819',
      location: 'Seattle, WA',
      condition_score: 97,
      title_status: 'Clean',
      description: 'The longest range production EV in the world. 516 miles EPA range, 819 horsepower, 900V+ ultra-fast charging architecture, Surreal Sound Pro audio with 21 speakers, and full Glass Canopy panoramic roof.',
      is_certified: 1,
      is_featured: 0,
      status: 'active',
      seller_id: 'usr-vault-certified',
      model_3d_type: 'gran_turismo',
      specs: {
        horsepower: 819,
        top_speed: 168,
        acceleration: 3.0,
        range_or_mpg: '516 Miles',
        drivetrain: 'Dual-Motor AWD',
        battery_capacity: '112.0 kWh',
        battery_health: 99
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Lucid Air Grand Touring Stance' },
        { url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Micro Lens Array Headlights' }
      ],
      hotspots: [
        { label: 'Wunderbox', title: '900V+ Wunderbox Architecture', description: 'Can add up to 300 miles of range in just 20 minutes.', x: 0, y: -0.1, z: 0.2, category: 'battery' }
      ],
      records: [
        { date: '2024-02-05', mileage: 8400, service_type: 'Lucid Certified Health Check', description: 'Battery pack balancing and OTA diagnostic sign-off.' }
      ]
    },
    {
      id: 'veh-009',
      make: 'Hyundai',
      model: 'Ioniq 5 N',
      year: 2024,
      trim: 'AWD N e-Shift Performance',
      price: 59900,
      mileage: 4200,
      fuel: 'Electric',
      transmission: 'Simulated 8-Speed Dual-Clutch',
      body_type: 'SUV',
      exterior_color: 'Performance Blue Matte',
      interior_color: 'N Alcantara & Recaro Bucket Seats',
      vin: 'KM8KR4AE6RU098124',
      registration: 'OR-5N641',
      location: 'Portland, OR',
      condition_score: 98,
      title_status: 'Clean',
      description: 'The award-winning enthusiast EV that changed the industry. Features N e-Shift virtual paddle shift gears, N Active Sound+, N Drift Optimizer, 641 hp N Grin Boost, and track endurance battery cooling.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'sport_suv',
      specs: {
        horsepower: 641,
        top_speed: 162,
        acceleration: 3.25,
        range_or_mpg: '221 Miles',
        drivetrain: 'Dual-Motor AWD',
        battery_capacity: '84.0 kWh',
        battery_health: 100
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Hyundai Ioniq 5 N Matte Blue' },
        { url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'N Aero Wing and Luminous Trim' }
      ],
      hotspots: [
        { label: 'N Grin Boost', title: '641 HP Peak Output', description: 'Overclocks inverter output for 10 seconds of max track acceleration.', x: 0, y: 0.2, z: 1.1, category: 'powertrain' }
      ],
      records: [
        { date: '2024-05-18', mileage: 3800, service_type: 'Hyundai N-Service Track Inspection', description: 'Fluid inspection, electronic differential calibration.' }
      ]
    },
    {
      id: 'veh-010',
      make: 'Ford',
      model: 'Mustang Mach-E GT',
      year: 2022,
      trim: 'GT Performance Edition eAWD',
      price: 41200,
      mileage: 22100,
      fuel: 'Electric',
      transmission: 'Automatic 1-Speed',
      body_type: 'SUV',
      exterior_color: 'Cyber Orange Metallic',
      interior_color: 'Black Onyx ActiveX w/ Copper Stitching',
      vin: '3FMTK4SX1NMA91823',
      registration: 'AZ-MCHE480',
      location: 'Phoenix, AZ',
      condition_score: 94,
      title_status: 'Clean',
      description: 'Vibrant Cyber Orange Mustang Mach-E GT Performance Edition. MagneRide Damping System, Brembo 19" performance red brakes, Ford Co-Pilot360 Active 2.0 with BlueCruise hands-free highway driving.',
      is_certified: 1,
      is_featured: 0,
      status: 'active',
      seller_id: 'usr-vault-certified',
      model_3d_type: 'sport_suv',
      specs: {
        horsepower: 480,
        top_speed: 130,
        acceleration: 3.5,
        range_or_mpg: '260 Miles',
        drivetrain: 'eAWD',
        battery_capacity: '91.0 kWh',
        battery_health: 96
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Cyber Orange Mach-E GT' },
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Illuminated Pony Badge' }
      ],
      hotspots: [
        { label: 'MagneRide', title: 'Magnetorheological Suspension', description: 'Adjusts damping 1,000 times per second for smooth or track dampening.', x: 0.8, y: -0.2, z: 1.0, category: 'brakes' }
      ],
      records: [
        { date: '2023-10-14', mileage: 19800, service_type: 'Ford BlueCruise Calibration', description: 'Sensor cleaning, multi-point EV check, tire rotation.' }
      ]
    },
    {
      id: 'veh-011',
      make: 'Chevrolet',
      model: 'Corvette Z06',
      year: 2023,
      trim: '3LZ Carbon Flash Package',
      price: 119500,
      mileage: 5800,
      fuel: 'Petrol',
      transmission: 'Automatic 8-Speed Dual-Clutch',
      body_type: 'Coupe',
      exterior_color: 'Rapid Blue',
      interior_color: 'Tension Blue / Twilight Leather',
      vin: '1G1YC2D32P5602931',
      registration: 'NC-Z06LT6',
      location: 'Charlotte, NC',
      condition_score: 99,
      title_status: 'Clean',
      description: 'Pure naturally-aspirated perfection. The LT6 flat-plane crank 5.5L V8 revs to 8,600 RPM producing the highest horsepower of any naturally aspirated production V8 in history. 3LZ equipment group with carbon fiber steering wheel.',
      is_certified: 1,
      is_featured: 1,
      status: 'active',
      seller_id: 'usr-demo-seller',
      model_3d_type: 'cyber_coupe',
      specs: {
        horsepower: 670,
        top_speed: 195,
        acceleration: 2.6,
        range_or_mpg: '19 MPG',
        drivetrain: 'Rear-Wheel Drive (RWD)',
        battery_capacity: 'N/A',
        battery_health: 100
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'Rapid Blue Corvette Z06' },
        { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Center Four-Exhaust Signature' }
      ],
      hotspots: [
        { label: 'LT6 Engine', title: '5.5L Flat-Plane Crank V8', description: '8,600 RPM redline generating 670 horsepower without forced induction.', x: 0, y: 0.2, z: -0.6, category: 'powertrain' }
      ],
      records: [
        { date: '2024-03-01', mileage: 4900, service_type: 'Factory 500-Mile & 5k Fluid Service', description: 'Dry sump engine oil change and transaxle filter replacement.' }
      ]
    },
    {
      id: 'veh-012',
      make: 'BMW',
      model: 'i4 M50',
      year: 2022,
      trim: 'M Sport Gran Coupe AWD',
      price: 54900,
      mileage: 20400,
      fuel: 'Electric',
      transmission: 'Automatic 1-Speed',
      body_type: 'Sedan',
      exterior_color: 'Portimao Blue Metallic',
      interior_color: 'Tacora Red Vernasca Leather',
      vin: 'WBA33AW04NFJ98104',
      registration: 'IL-I4M536',
      location: 'Chicago, IL',
      condition_score: 95,
      title_status: 'Clean',
      description: 'Daily drivable M-engineered dual motor electric Gran Coupe. 536 hp Sport Boost function, Harman Kardon Surround Sound, BMW Curved Display with iDrive 8, and Adaptive M Suspension.',
      is_certified: 1,
      is_featured: 0,
      status: 'active',
      seller_id: 'usr-vault-certified',
      model_3d_type: 'gran_turismo',
      specs: {
        horsepower: 536,
        top_speed: 140,
        acceleration: 3.7,
        range_or_mpg: '270 Miles',
        drivetrain: 'Dual-Motor AWD',
        battery_capacity: '83.9 kWh',
        battery_health: 97
      },
      images: [
        { url: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80', is_primary: 1, caption: 'BMW i4 M50 Gran Coupe' },
        { url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', is_primary: 0, caption: 'Aerodynamic Wheel & Grille' }
      ],
      hotspots: [
        { label: 'Dual Motors', title: '536 HP Sport Boost', description: 'Dual electrically excited synchronous motors with zero rare-earth metals.', x: 0, y: 0.1, z: 1.0, category: 'powertrain' }
      ],
      records: [
        { date: '2023-09-12', mileage: 16500, service_type: 'BMW 2-Year Service', description: 'Brake fluid renewal, vehicle health check, cabin microfilter.' }
      ]
    }
  ];

  // Insert all vehicles and child records
  for (const v of vehicles) {
    database.run(
      `INSERT INTO vehicles (
        id, make, model, year, trim, price, mileage, fuel, transmission,
        body_type, exterior_color, interior_color, vin, registration, location,
        condition_score, title_status, description, is_certified, is_featured,
        status, seller_id, model_3d_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.make, v.model, v.year, v.trim, v.price, v.mileage, v.fuel, v.transmission,
        v.body_type, v.exterior_color, v.interior_color, v.vin, v.registration, v.location,
        v.condition_score, v.title_status, v.description, v.is_certified, v.is_featured,
        v.status, v.seller_id, v.model_3d_type
      ]
    );

    database.run(
      `INSERT INTO vehicle_specs (
        id, vehicle_id, horsepower, top_speed, acceleration,
        range_or_mpg, drivetrain, battery_capacity, battery_health
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `spec-${v.id}`, v.id, v.specs.horsepower, v.specs.top_speed, v.specs.acceleration,
        v.specs.range_or_mpg, v.specs.drivetrain, v.specs.battery_capacity, v.specs.battery_health
      ]
    );

    v.images.forEach((img, idx) => {
      database.run(
        `INSERT INTO vehicle_images (id, vehicle_id, url, is_primary, caption, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`img-${v.id}-${idx}`, v.id, img.url, img.is_primary, img.caption, idx]
      );
    });

    v.hotspots.forEach((hs, idx) => {
      database.run(
        `INSERT INTO vehicle_hotspots (id, vehicle_id, label, title, description, x, y, z, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [`hs-${v.id}-${idx}`, v.id, hs.label, hs.title, hs.description, hs.x, hs.y, hs.z, hs.category]
      );
    });

    v.records.forEach((rec, idx) => {
      database.run(
        `INSERT INTO service_records (id, vehicle_id, date, mileage, service_type, description, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`rec-${v.id}-${idx}`, v.id, rec.date, rec.mileage, rec.service_type, rec.description, 1]
      );
    });
  }

  // Demo Inquiries
  database.run(
    `INSERT INTO inquiries (id, vehicle_id, user_id, name, email, phone, type, message, offer_amount, preferred_date, preferred_time_slot, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'inq-001', 'veh-001', 'usr-demo-buyer', 'Jordan Vance', 'buyer@motorvault.com', '+1 (555) 987-6543',
      'test_drive', 'Hello Alex, I would love to schedule a test drive for the Taycan Turbo S this coming Saturday afternoon. Please let me know if that time works.',
      null, '2026-09-26', '2:00 PM - 3:00 PM', 'pending'
    ]
  );

  database.run(
    `INSERT INTO inquiries (id, vehicle_id, user_id, name, email, phone, type, message, offer_amount, preferred_date, preferred_time_slot, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'inq-002', 'veh-002', 'usr-demo-buyer', 'Jordan Vance', 'buyer@motorvault.com', '+1 (555) 987-6543',
      'offer', 'Offering $82,000 all-cash with immediate wire transfer and local pickup in Palo Alto.',
      82000, null, null, 'pending'
    ]
  );

  // Demo Favorites
  database.run(`INSERT INTO favorites (id, user_id, vehicle_id) VALUES (?, ?, ?)`, ['fav-001', 'usr-demo-seller', 'veh-001']);
  database.run(`INSERT INTO favorites (id, user_id, vehicle_id) VALUES (?, ?, ?)`, ['fav-002', 'usr-demo-seller', 'veh-002']);
  database.run(`INSERT INTO favorites (id, user_id, vehicle_id) VALUES (?, ?, ?)`, ['fav-003', 'usr-demo-buyer', 'veh-001']);

  saveDb();
  console.log(`✅ Seeded ${vehicles.length} vehicles, demo accounts, hotspots, specs, and inquiries!`);
}

seed().catch(err => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
