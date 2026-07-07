import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const [teachers]: any = await pool.execute(`
      SELECT t.*, u.full_name, u.email, u.username, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
    `);
    res.json(teachers);
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [teachers]: any = await pool.execute(`
      SELECT t.*, u.full_name, u.email, u.username, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(teachers[0]);
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { username, password, email, full_name, employee_id, department, position, contact_number, address } = req.body;
    
    await connection.beginTransaction();

    // Create user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult]: any = await connection.execute(
      'INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, full_name, 'teacher']
    );

    // Create teacher profile
    const [teacherResult]: any = await connection.execute(
      'INSERT INTO teachers (user_id, employee_id, department, position, contact_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userResult.insertId, employee_id, department, position, contact_number, address]
    );

    await connection.commit();
    res.status(201).json({ message: 'Teacher created successfully', id: teacherResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};