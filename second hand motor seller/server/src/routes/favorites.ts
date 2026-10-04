import { Router, Response } from 'express';
import db from '../db/connection.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/favorites
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const favorites = await db.all(
      `SELECT v.*, 
              s.horsepower, s.top_speed, s.acceleration, s.range_or_mpg, s.drivetrain, s.battery_health,
              f.created_at as favorited_at
       FROM favorites f
       JOIN vehicles v ON f.vehicle_id = v.id
       LEFT JOIN vehicle_specs s ON v.id = s.vehicle_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    // Attach primary images
    const vehiclesWithImages = await Promise.all(
      favorites.map(async (v) => {
        const image = await db.get(
          'SELECT url FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, order_index ASC LIMIT 1',
          [v.id]
        );
        return {
          ...v,
          primary_image: image?.url || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
          is_favorited: true
        };
      })
    );

    return res.json({ favorites: vehiclesWithImages });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ error: 'vehicleId is required' });
    }

    const existing = await db.get(
      'SELECT id FROM favorites WHERE user_id = ? AND vehicle_id = ?',
      [userId, vehicleId]
    );

    if (existing) {
      return res.json({ message: 'Already in favorites', id: existing.id });
    }

    const id = `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.run(
      'INSERT INTO favorites (id, user_id, vehicle_id) VALUES (?, ?, ?)',
      [id, userId, vehicleId]
    );

    return res.status(201).json({ message: 'Added to favorites', id });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:vehicleId
router.delete('/:vehicleId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { vehicleId } = req.params;

    await db.run(
      'DELETE FROM favorites WHERE user_id = ? AND vehicle_id = ?',
      [userId, vehicleId]
    );

    return res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
