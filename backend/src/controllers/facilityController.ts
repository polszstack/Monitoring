import { Request, Response } from 'express';
import pool from '../config/database';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { category, condition } = req.query;
    let query = 'SELECT * FROM facility_inventory';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (condition) {
      conditions.push('condition_status = ?');
      params.push(condition);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY category, item_name';

    const [inventory]: any = await pool.execute(query, params);
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const { item_code, item_name, category, description, location, room_number, quantity, condition_status, purchase_date, purchase_cost, notes } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO facility_inventory 
       (item_code, item_name, category, description, location, room_number, quantity, condition_status, purchase_date, purchase_cost, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item_code, item_name, category, description, location, room_number, quantity, condition_status, purchase_date, purchase_cost, notes]
    );

    res.status(201).json({ message: 'Item created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { report_number, facility_type, item_name, item_description, location, room_number, priority, reported_by } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO facility_reports 
       (report_number, facility_type, item_name, item_description, location, room_number, priority, reported_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [report_number, facility_type, item_name, item_description, location, room_number, priority, reported_by]
    );

    res.status(201).json({ message: 'Report created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};