import { Request, Response } from 'express';
import pool from '../config/database';

// Get all inventory items
export const getInventory = async (req: Request, res: Response) => {
  try {
    const { category, condition, search } = req.query;
    let query = 'SELECT * FROM facility_inventory WHERE 1=1';
    const params: any[] = [];

    if (category && category !== '') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (condition && condition !== '') {
      query += ' AND condition_status = ?';
      params.push(condition);
    }

    if (search && search !== '') {
      query += ' AND (item_name LIKE ? OR item_code LIKE ? OR location LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY category, item_name';

    const [inventory]: any = await pool.execute(query, params);
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single inventory item
export const getInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [items]: any = await pool.execute(
      'SELECT * FROM facility_inventory WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create inventory item
export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const { 
      item_code, item_name, category, description, location, 
      room_number, quantity, condition_status, purchase_date, 
      purchase_cost, notes 
    } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO facility_inventory 
       (item_code, item_name, category, description, location, room_number, quantity, condition_status, purchase_date, purchase_cost, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item_code, item_name, category, description || null, location || null, room_number || null, 
       quantity || 1, condition_status || 'good', purchase_date || null, purchase_cost || null, notes || null]
    );

    res.status(201).json({ 
      message: 'Item created successfully', 
      id: result.insertId 
    });
  } catch (error: any) {
    console.error('Create inventory item error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Item code already exists' });
    }
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// Update inventory item
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      item_name, category, description, location, 
      room_number, quantity, condition_status, 
      last_maintenance_date, notes 
    } = req.body;

    await pool.execute(
      `UPDATE facility_inventory 
       SET item_name = ?, category = ?, description = ?, location = ?, 
           room_number = ?, quantity = ?, condition_status = ?, 
           last_maintenance_date = ?, notes = ?
       WHERE id = ?`,
      [item_name, category, description, location, room_number, 
       quantity, condition_status, last_maintenance_date, notes, id]
    );

    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate report number
const generateReportNumber = async (): Promise<string> => {
  try {
    const [reports]: any = await pool.execute(
      'SELECT report_number FROM facility_reports ORDER BY id DESC LIMIT 1'
    );
    
    if (!reports || reports.length === 0) {
      return 'RPT-001';
    }
    
    const lastNumber = parseInt(reports[0].report_number.split('-')[1]);
    return `RPT-${String(lastNumber + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating report number:', error);
    const timestamp = Date.now().toString().slice(-6);
    return `RPT-${timestamp}`;
  }
};

// Create facility report
export const createReport = async (req: any, res: Response) => {
  try {
    const { 
      facility_type, item_name, item_description, location, 
      room_number, priority, notes 
    } = req.body;

    console.log('=== Creating Report ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?.id);

    // Validate required fields
    if (!item_name) {
      return res.status(400).json({ error: 'Item name is required' });
    }
    if (!facility_type) {
      return res.status(400).json({ error: 'Facility type is required' });
    }
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const report_number = await generateReportNumber();
    console.log('Report number:', report_number);

    const [result]: any = await pool.execute(
      `INSERT INTO facility_reports 
       (report_number, facility_type, item_name, item_description, location, room_number, priority, status, reported_by, reported_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'reported', ?, NOW(), ?)`,
      [
        report_number,
        facility_type,
        item_name,
        item_description || null,
        location,
        room_number || null,
        priority || 'medium',
        req.user.id,
        notes || null
      ]
    );

    console.log('Report created with ID:', result.insertId);

    res.status(201).json({ 
      message: 'Report created successfully', 
      id: result.insertId,
      report_number 
    });
  } catch (error: any) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report: ' + error.message });
  }
};

// Get all reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;
    let query = `
      SELECT 
        fr.*,
        u1.full_name as reporter_name,
        u2.full_name as assignee_name
      FROM facility_reports fr
      JOIN users u1 ON fr.reported_by = u1.id
      LEFT JOIN users u2 ON fr.assigned_to = u2.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== '') {
      query += ' AND fr.status = ?';
      params.push(status);
    }

    if (priority && priority !== '') {
      query += ' AND fr.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY fr.reported_date DESC';

    console.log('Fetching reports...');
    const [reports]: any = await pool.execute(query, params);
    console.log(`Found ${reports.length} reports`);
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update report status
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assigned_to, cost_estimate, actual_cost, notes } = req.body;

    console.log('Updating report:', id, 'to status:', status);

    if (status === 'fixed') {
      await pool.execute(
        `UPDATE facility_reports 
         SET status = ?, fixed_date = NOW(), actual_cost = ?, notes = ?
         WHERE id = ?`,
        [status, actual_cost || null, notes || null, id]
      );
    } else {
      await pool.execute(
        `UPDATE facility_reports 
         SET status = ?, assigned_to = ?, cost_estimate = ?, notes = ?
         WHERE id = ?`,
        [status, assigned_to || null, cost_estimate || null, notes || null, id]
      );
    }

    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

// Get facility stats
export const getFacilityStats = async (req: Request, res: Response) => {
  try {
    const [inventory]: any = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN condition_status = "broken" THEN 1 ELSE 0 END) as broken FROM facility_inventory'
    );
    
    const [reports]: any = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status IN ("reported", "in_progress") THEN 1 ELSE 0 END) as pending FROM facility_reports'
    );

    const stats = {
      totalItems: inventory[0]?.total || 0,
      brokenItems: inventory[0]?.broken || 0,
      totalReports: reports[0]?.total || 0,
      pendingReports: reports[0]?.pending || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get facility stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};