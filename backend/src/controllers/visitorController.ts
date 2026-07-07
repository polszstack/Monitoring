import { Request, Response } from 'express';
import pool from '../config/database';

export const getVisitors = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;
    let query = 'SELECT * FROM visitor_logs';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('DATE(check_in_time) = ?');
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY check_in_time DESC';

    const [visitors]: any = await pool.execute(query, params);
    res.json(visitors);
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkIn = async (req: Request, res: Response) => {
  try {
    const { visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO visitor_logs 
       (visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes, check_in_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes]
    );

    res.status(201).json({ message: 'Visitor checked in successfully', id: result.insertId });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await pool.execute(
      'UPDATE visitor_logs SET check_out_time = NOW(), status = ? WHERE id = ? AND status = ?',
      ['checked_out', id, 'checked_in']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Visitor not found or already checked out' });
    }

    res.json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};