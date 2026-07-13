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
  // Allow browser CORS preflight checks to pass through without a token
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Try multiple ways to get the token
  let token = null;
  
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  // 2. Check x-access-token header
  if (!token) {
    token = req.headers['x-access-token'] as string;
  }
  
  // 3. Check query parameter (for debugging)
  if (!token && req.query.token) {
    token = req.query.token as string;
  }

  // 4. Check cookies (if you're using cookies)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('❌ No token found in request');
    console.log('Headers:', req.headers);
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      id: number;
      username: string;
      role: string;
    };
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded.username);
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log('❌ Token verification failed:', message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Admin only middleware
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Allow browser CORS preflight checks to pass through unblocked
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.user) {
    console.log('❌ Admin check failed: No user object');
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    console.log('❌ Admin check failed: User role is', req.user.role);
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  console.log('✅ Admin access granted for user:', req.user.username);
  next();
};

// Optional: Debug middleware to log all requests
export const debugAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('📝 Request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  next();
};