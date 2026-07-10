import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // ✅ FIX: Allow browser CORS preflight checks to pass through without a token
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      id: number;
      username: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Admin only middleware
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  // ✅ FIX: Allow browser CORS preflight checks to pass through unblocked
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};