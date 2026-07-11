import { Request, Response } from 'express';
import pool from '../config/database';

export const getVisitors = async (req: Request, res: Response) => {
  try {
    const { status, date, include_archived } = req.query;
    let query = 'SELECT * FROM visitor_logs';
    const params: any[] = [];
    const conditions: string[] = [];

    if (include_archived !== 'true') {
      conditions.push('is_archived = 0');
    }

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
    const { 
      visitor_name, 
      contact_number, 
      email, 
      purpose_of_visit, 
      person_to_visit, 
      department, 
      id_proof_type, 
      id_proof_number, 
      vehicle_number, 
      notes 
    } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO visitor_logs 
       (visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes, check_in_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'checked_in')`,
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

    // First, check if the visitor exists and is checked in
    const [existing]: any = await pool.execute(
      'SELECT * FROM visitor_logs WHERE id = ? AND status = ?',
      [id, 'checked_in']
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Visitor not found or already checked out' });
    }

    // Only update status to checked_out - DO NOT auto-archive
    const [result]: any = await pool.execute(
      'UPDATE visitor_logs SET check_out_time = NOW(), status = ? WHERE id = ? AND status = ?',
      ['checked_out', id, 'checked_in']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Visitor not found or already checked out' });
    }

    // REMOVED: Auto-archive functionality
    // Visitors will remain in active list until manually archived

    // Get the updated visitor data
    const [updated]: any = await pool.execute(
      'SELECT * FROM visitor_logs WHERE id = ?',
      [id]
    );

    res.json({ message: 'Visitor checked out successfully', visitor: updated[0] });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveVisitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if visitor exists and can be archived (must be checked out)
    const [existing]: any = await pool.execute(
      'SELECT * FROM visitor_logs WHERE id = ? AND is_archived = 0',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Visitor not found or already archived' });
    }

    // Only allow archiving of checked out visitors
    if (existing[0].status !== 'checked_out') {
      return res.status(400).json({ error: 'Cannot archive an active visitor. Please check them out first.' });
    }

    const [result]: any = await pool.execute(
      'UPDATE visitor_logs SET is_archived = 1 WHERE id = ? AND is_archived = 0',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Visitor not found or not eligible for archive' });
    }

    // Return the updated visitor data
    const [updated]: any = await pool.execute(
      'SELECT * FROM visitor_logs WHERE id = ?',
      [id]
    );

    res.json({ message: 'Visitor archived successfully', visitor: updated[0] });
  } catch (error) {
    console.error('Archive visitor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};