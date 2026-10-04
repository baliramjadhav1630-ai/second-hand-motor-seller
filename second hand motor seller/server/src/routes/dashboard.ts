import { Router, Response } from 'express';
import db from '../db/connection.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Active listings count
    const activeCount = await db.get(
      `SELECT COUNT(*) as count FROM vehicles WHERE seller_id = ? AND status = 'active'`,
      [userId]
    );

    // Paused listings count
    const pausedCount = await db.get(
      `SELECT COUNT(*) as count FROM vehicles WHERE seller_id = ? AND status = 'paused'`,
      [userId]
    );

    // Sold listings count
    const soldCount = await db.get(
      `SELECT COUNT(*) as count FROM vehicles WHERE seller_id = ? AND status = 'sold'`,
      [userId]
    );

    // Total inquiries
    const totalInquiries = await db.get(
      `SELECT COUNT(*) as count 
       FROM inquiries i
       JOIN vehicles v ON i.vehicle_id = v.id
       WHERE v.seller_id = ?`,
      [userId]
    );

    // Total favorites on seller's cars
    const totalFavorites = await db.get(
      `SELECT COUNT(*) as count 
       FROM favorites f
       JOIN vehicles v ON f.vehicle_id = v.id
       WHERE v.seller_id = ?`,
      [userId]
    );

    // Total inventory value
    const inventoryVal = await db.get(
      `SELECT SUM(price) as total_val 
       FROM vehicles 
       WHERE seller_id = ? AND status = 'active'`,
      [userId]
    );

    return res.json({
      stats: {
        active_listings: activeCount?.count || 0,
        paused_listings: pausedCount?.count || 0,
        sold_listings: soldCount?.count || 0,
        total_inquiries: totalInquiries?.count || 0,
        total_favorites: totalFavorites?.count || 0,
        total_inventory_value: inventoryVal?.total_val || 0
      }
    });
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to load dashboard metrics' });
  }
});

export default router;
