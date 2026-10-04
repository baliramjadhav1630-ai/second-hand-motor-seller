import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'motorvault_super_secret_jwt_key_2025';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo purposes, allow fallback to demo user if requested
    const demoUserHeader = req.headers['x-demo-user'];
    if (demoUserHeader) {
      req.user = {
        id: demoUserHeader as string,
        email: 'demo@motorvault.com',
        role: 'seller'
      };
      return next();
    }
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const demoUserHeader = req.headers['x-demo-user'];
    if (demoUserHeader) {
      req.user = {
        id: demoUserHeader as string,
        email: 'demo@motorvault.com',
        role: 'seller'
      };
    }
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  });
}
