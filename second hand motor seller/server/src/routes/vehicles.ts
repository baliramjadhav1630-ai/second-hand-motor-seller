import { Router, Request, Response } from 'express';
import db from '../db/connection.js';
import { AuthRequest, optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/vehicles
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      q,
      make,
      model,
      bodyType,
      fuel,
      transmission,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      maxMileage,
      isCertified,
      isFeatured,
      sellerId,
      status = 'active',
      sort = 'newest'
    } = req.query;

    let sql = `
      SELECT v.*, 
             s.horsepower, s.top_speed, s.acceleration, s.range_or_mpg, s.drivetrain, s.battery_health,
             u.name as seller_name, u.role as seller_role, u.avatar as seller_avatar
      FROM vehicles v
      LEFT JOIN vehicle_specs s ON v.id = s.vehicle_id
      LEFT JOIN users u ON v.seller_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // Filter by status (unless seller requesting their own listings)
    if (sellerId) {
      sql += ` AND v.seller_id = ?`;
      params.push(sellerId);
      if (status && status !== 'all') {
        sql += ` AND v.status = ?`;
        params.push(status);
      }
    } else {
      sql += ` AND v.status = 'active'`;
    }

    if (q) {
      const searchTerm = `%${String(q).trim()}%`;
      sql += ` AND (v.make LIKE ? OR v.model LIKE ? OR v.trim LIKE ? OR v.description LIKE ? OR v.location LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (make) {
      sql += ` AND LOWER(v.make) = LOWER(?)`;
      params.push(String(make));
    }

    if (model) {
      sql += ` AND LOWER(v.model) = LOWER(?)`;
      params.push(String(model));
    }

    if (bodyType && bodyType !== 'All') {
      sql += ` AND LOWER(v.body_type) = LOWER(?)`;
      params.push(String(bodyType));
    }

    if (fuel && fuel !== 'All') {
      sql += ` AND LOWER(v.fuel) = LOWER(?)`;
      params.push(String(fuel));
    }

    if (transmission && transmission !== 'All') {
      sql += ` AND LOWER(v.transmission) LIKE LOWER(?)`;
      params.push(`%${String(transmission)}%`);
    }

    if (minPrice) {
      sql += ` AND v.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ` AND v.price <= ?`;
      params.push(Number(maxPrice));
    }

    if (minYear) {
      sql += ` AND v.year >= ?`;
      params.push(Number(minYear));
    }

    if (maxYear) {
      sql += ` AND v.year <= ?`;
      params.push(Number(maxYear));
    }

    if (maxMileage) {
      sql += ` AND v.mileage <= ?`;
      params.push(Number(maxMileage));
    }

    if (isCertified === '1' || isCertified === 'true') {
      sql += ` AND v.is_certified = 1`;
    }

    if (isFeatured === '1' || isFeatured === 'true') {
      sql += ` AND v.is_featured = 1`;
    }

    // Sort order
    switch (sort) {
      case 'price_asc':
        sql += ` ORDER BY v.price ASC`;
        break;
      case 'price_desc':
        sql += ` ORDER BY v.price DESC`;
        break;
      case 'year_desc':
        sql += ` ORDER BY v.year DESC`;
        break;
      case 'mileage_asc':
        sql += ` ORDER BY v.mileage ASC`;
        break;
      case 'newest':
      default:
        sql += ` ORDER BY v.created_at DESC`;
        break;
    }

    const rawVehicles = await db.all(sql, params);

    // Fetch images and favorites for returned vehicles
    const vehiclesWithMeta = await Promise.all(
      rawVehicles.map(async (v) => {
        const images = await db.all(
          'SELECT url, is_primary, caption FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, order_index ASC',
          [v.id]
        );

        let isFavorited = false;
        if (req.user) {
          const fav = await db.get(
            'SELECT id FROM favorites WHERE user_id = ? AND vehicle_id = ?',
            [req.user.id, v.id]
          );
          isFavorited = !!fav;
        }

        return {
          ...v,
          primary_image: images[0]?.url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
          images,
          is_favorited: isFavorited
        };
      })
    );

    return res.json({ vehicles: vehiclesWithMeta });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/:id
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await db.get(
      `SELECT v.*, 
              u.name as seller_name, u.email as seller_email, u.phone as seller_phone, 
              u.role as seller_role, u.avatar as seller_avatar, u.location as seller_location
       FROM vehicles v
       LEFT JOIN users u ON v.seller_id = u.id
       WHERE v.id = ?`,
      [id]
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const specs = await db.get(
      'SELECT * FROM vehicle_specs WHERE vehicle_id = ?',
      [id]
    );

    const images = await db.all(
      'SELECT id, url, is_primary, caption, order_index FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, order_index ASC',
      [id]
    );

    const hotspots = await db.all(
      'SELECT * FROM vehicle_hotspots WHERE vehicle_id = ?',
      [id]
    );

    const records = await db.all(
      'SELECT * FROM service_records WHERE vehicle_id = ? ORDER BY date DESC',
      [id]
    );

    let isFavorited = false;
    if (req.user) {
      const fav = await db.get(
        'SELECT id FROM favorites WHERE user_id = ? AND vehicle_id = ?',
        [req.user.id, id]
      );
      isFavorited = !!fav;
    }

    return res.json({
      vehicle: {
        ...vehicle,
        primary_image: images[0]?.url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
        specs: specs || {
          horsepower: 400,
          top_speed: 155,
          acceleration: 4.2,
          range_or_mpg: '280 Miles',
          drivetrain: 'AWD',
          battery_capacity: 'N/A',
          battery_health: 98
        },
        images,
        hotspots,
        service_records: records,
        is_favorited: isFavorited
      }
    });
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    return res.status(500).json({ error: 'Failed to fetch vehicle details' });
  }
});

// POST /api/vehicles (Create Listing)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      make,
      model,
      year,
      trim,
      price,
      mileage,
      fuel,
      transmission,
      body_type,
      exterior_color,
      interior_color,
      vin,
      registration,
      location,
      condition_score = 95,
      title_status = 'Clean',
      description,
      is_certified = 1,
      model_3d_type = 'cyber_coupe',
      specs = {},
      images = [],
      condition_checklist = {}
    } = req.body;

    if (!make || !model || !year || !price || !mileage) {
      return res.status(400).json({ error: 'Make, model, year, price, and mileage are required' });
    }

    const vehicleId = `veh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Insert vehicle
    await db.run(
      `INSERT INTO vehicles (
        id, make, model, year, trim, price, mileage, fuel, transmission,
        body_type, exterior_color, interior_color, vin, registration, location,
        condition_score, title_status, description, is_certified, is_featured,
        status, seller_id, model_3d_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicleId,
        make,
        model,
        Number(year),
        trim || '',
        Number(price),
        Number(mileage),
        fuel || 'Petrol',
        transmission || 'Automatic',
        body_type || 'Coupe',
        exterior_color || 'Metallic Silver',
        interior_color || 'Black Leather',
        vin || `VIN-${Date.now().toString(16).toUpperCase()}`,
        registration || 'PENDING',
        location || 'San Francisco, CA',
        Number(condition_score),
        title_status,
        description || `${year} ${make} ${model} in excellent condition with complete service records.`,
        is_certified ? 1 : 0,
        0,
        'active',
        userId,
        model_3d_type
      ]
    );

    // Insert specs
    await db.run(
      `INSERT INTO vehicle_specs (
        id, vehicle_id, horsepower, top_speed, acceleration,
        range_or_mpg, drivetrain, battery_capacity, battery_health
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `spec-${vehicleId}`,
        vehicleId,
        specs.horsepower ? Number(specs.horsepower) : 450,
        specs.top_speed ? Number(specs.top_speed) : 160,
        specs.acceleration ? Number(specs.acceleration) : 3.8,
        specs.range_or_mpg || (fuel === 'Electric' ? '280 Miles' : '24 MPG'),
        specs.drivetrain || 'All-Wheel Drive (AWD)',
        specs.battery_capacity || (fuel === 'Electric' ? '90 kWh' : 'N/A'),
        specs.battery_health ? Number(specs.battery_health) : (fuel === 'Electric' ? 98 : 100)
      ]
    );

    // Insert images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url;
        await db.run(
          `INSERT INTO vehicle_images (id, vehicle_id, url, is_primary, caption, order_index)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [`img-${vehicleId}-${i}`, vehicleId, imgUrl, i === 0 ? 1 : 0, `Photo ${i + 1}`, i]
        );
      }
    } else {
      // Default placeholder car image
      await db.run(
        `INSERT INTO vehicle_images (id, vehicle_id, url, is_primary, caption, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`img-${vehicleId}-0`, vehicleId, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', 1, 'Main Exterior View', 0]
      );
    }

    // Insert default 3D Hotspots
    const defaultHotspots = [
      { label: fuel === 'Electric' ? 'Battery' : 'Engine', title: fuel === 'Electric' ? 'High-Voltage Traction Pack' : 'High-Performance Engine', description: `Condition Score: ${condition_score}/100. Fully inspected and certified.`, x: 0, y: -0.1, z: 0.8, category: 'powertrain' },
      { label: 'Brakes', title: 'Performance Brakes', description: 'Tire and brake system inspected with over 90% wear life remaining.', x: 0.9, y: -0.2, z: 1.0, category: 'brakes' },
      { label: 'Aero', title: 'Aero Bodywork', description: 'Certified body panel alignment and clean ceramic paint finish.', x: 0, y: 0.4, z: -1.4, category: 'aero' }
    ];

    for (let i = 0; i < defaultHotspots.length; i++) {
      const hs = defaultHotspots[i];
      await db.run(
        `INSERT INTO vehicle_hotspots (id, vehicle_id, label, title, description, x, y, z, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [`hs-${vehicleId}-${i}`, vehicleId, hs.label, hs.title, hs.description, hs.x, hs.y, hs.z, hs.category]
      );
    }

    // Insert initial service record
    await db.run(
      `INSERT INTO service_records (id, vehicle_id, date, mileage, service_type, description, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `rec-${vehicleId}-0`,
        vehicleId,
        new Date().toISOString().split('T')[0],
        Number(mileage),
        'Pre-Sale Certification',
        'MotorVault 150-point inspection completed. All diagnostic telemetry passed.',
        1
      ]
    );

    return res.status(201).json({
      message: 'Vehicle listing created successfully',
      vehicleId
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return res.status(500).json({ error: 'Failed to create vehicle listing' });
  }
});

// PUT /api/vehicles/:id (Edit Listing)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check ownership
    const existing = await db.get('SELECT seller_id FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (existing.seller_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this listing' });
    }

    const {
      price,
      status,
      description,
      mileage,
      exterior_color,
      interior_color,
      is_certified,
      is_featured
    } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (price !== undefined) { updates.push('price = ?'); params.push(Number(price)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (mileage !== undefined) { updates.push('mileage = ?'); params.push(Number(mileage)); }
    if (exterior_color !== undefined) { updates.push('exterior_color = ?'); params.push(exterior_color); }
    if (interior_color !== undefined) { updates.push('interior_color = ?'); params.push(interior_color); }
    if (is_certified !== undefined) { updates.push('is_certified = ?'); params.push(is_certified ? 1 : 0); }
    if (is_featured !== undefined) { updates.push('is_featured = ?'); params.push(is_featured ? 1 : 0); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length > 1) {
      params.push(id);
      await db.run(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    return res.json({ message: 'Vehicle listing updated successfully' });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return res.status(500).json({ error: 'Failed to update vehicle listing' });
  }
});

// DELETE /api/vehicles/:id (Delete Listing)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await db.get('SELECT seller_id FROM vehicles WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (existing.seller_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await db.run('DELETE FROM vehicles WHERE id = ?', [id]);
    return res.json({ message: 'Vehicle listing removed successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return res.status(500).json({ error: 'Failed to delete vehicle listing' });
  }
});

export default router;
