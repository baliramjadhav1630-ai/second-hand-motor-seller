import { Router, Request, Response } from 'express';
import db from '../db/connection.js';
import { AuthRequest, optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/inquiries (List received inquiries for seller's vehicles)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get inquiries for vehicles owned by this seller
    const inquiries = await db.all(
      `SELECT i.*, 
              v.make, v.model, v.year, v.price, v.trim,
              (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as vehicle_image
       FROM inquiries i
       JOIN vehicles v ON i.vehicle_id = v.id
       WHERE v.seller_id = ?
       ORDER BY i.created_at DESC`,
      [userId]
    );

    return res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// POST /api/inquiries (Submit Inquiry / Test Drive / Offer)
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      vehicle_id,
      name,
      email,
      phone,
      type = 'inquiry', // inquiry, test_drive, offer
      message,
      offer_amount,
      preferred_date,
      preferred_time_slot
    } = req.body;

    if (!vehicle_id || !name || !email || !message) {
      return res.status(400).json({ error: 'Vehicle ID, name, email, and message are required' });
    }

    // Check if vehicle exists
    const vehicle = await db.get('SELECT id, make, model FROM vehicles WHERE id = ?', [vehicle_id]);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const userId = req.user?.id || null;

    await db.run(
      `INSERT INTO inquiries (
        id, vehicle_id, user_id, name, email, phone,
        type, message, offer_amount, preferred_date, preferred_time_slot, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inquiryId,
        vehicle_id,
        userId,
        name,
        email,
        phone || null,
        type,
        message,
        offer_amount ? Number(offer_amount) : null,
        preferred_date || null,
        preferred_time_slot || null,
        'pending'
      ]
    );

    return res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiryId,
      details: {
        type,
        vehicle: `${vehicle.make} ${vehicle.model}`,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    if (!['pending', 'accepted', 'declined', 'contacted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Verify ownership of the vehicle associated with this inquiry
    const inquiry = await db.get(
      `SELECT i.id, v.seller_id 
       FROM inquiries i 
       JOIN vehicles v ON i.vehicle_id = v.id 
       WHERE i.id = ?`,
      [id]
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (inquiry.seller_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this inquiry' });
    }

    await db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);

    return res.json({ message: 'Inquiry status updated successfully', status });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

export default router;
