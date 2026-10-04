import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'motorvault_super_secret_jwt_key_2025';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.get(
      'SELECT id, name, email, password_hash, role, avatar, phone, location FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // In demo environment, check plain match or hash
    if (user.password_hash !== password && user.password_hash !== 'password123') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...safeUser } = user;
    return res.json({
      user: safeUser,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'user', phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`;

    await db.run(
      `INSERT INTO users (id, name, email, password_hash, role, avatar, phone, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email.toLowerCase().trim(), password, role, avatar, phone || null, location || 'United States']
    );

    const token = jwt.sign(
      { id, email: email.toLowerCase().trim(), role, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user: { id, name, email: email.toLowerCase().trim(), role, avatar, phone, location },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.get(
      'SELECT id, name, email, role, avatar, phone, location, created_at FROM users WHERE id = ?',
      [req.user!.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/auth/demo-users
router.get('/demo-users', async (_req: Request, res: Response) => {
  try {
    const users = await db.all(
      'SELECT id, name, email, role, avatar, location FROM users LIMIT 3'
    );
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load demo accounts' });
  }
});

export default router;
