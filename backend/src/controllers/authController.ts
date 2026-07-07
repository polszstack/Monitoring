import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('=== Login Attempt ===');
    console.log('Username:', username);
    console.log('Password provided:', password);

    const [users]: any = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    console.log('Users found:', users.length);
    
    if (users.length === 0) {
      console.log('❌ No user found with username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    console.log('User found:', user.username);
    console.log('User status:', user.status);
    console.log('Stored password hash:', user.password);

    // Test password comparison
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password match:', validPassword);

    if (!validPassword) {
      console.log('❌ Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      console.log('❌ User is not active');
      return res.status(401).json({ error: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', username);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};