import { Request, Response } from 'express';
import pool from '../config/database';

// Simplified Reporting View API: Fetches active (unarchived) items by default
export const getReports = async (req: Request, res: Response) => {
  try {
    const { include_archived } = req.query;
    
    let query = `
      SELECT fr.*, u.full_name as reporter_name 
      FROM facility_reports fr
      LEFT JOIN users u ON fr.reported_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (include_archived !== 'true') {
      query += ' AND fr.is_archived = 0';
    }

    query += ' ORDER BY fr.priority DESC, fr.reported_date DESC';

    const [reports] = await pool.execute(query, params);
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addReport = async (req: Request, res: Response) => {
  try {
    const { item_name, facility_type, item_description, location, room_number, priority, notes } = req.body;
    const report_number = 'REP-' + Math.floor(100000 + Math.random() * 900000);
    const reporter_id = (req as any).user?.id || 1; // Fallback token ID if auth isn't parsed
    
    await pool.execute(
      `INSERT INTO facility_reports 
       (report_number, item_name, facility_type, item_description, location, room_number, priority, notes, reported_by, reported_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [report_number, item_name, facility_type, item_description, location, room_number, priority, notes, reporter_id]
    );

    res.status(201).json({ message: 'Report logged successfully' });
  } catch (error) {
    console.error('Add report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.execute('UPDATE facility_reports SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Report status updated' });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ARCHIVE CORE ACTIONS
export const toggleArchiveReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE facility_reports SET is_archived = NOT is_archived WHERE id = ?', [id]);
    res.json({ message: 'Report archival toggled' });
  } catch (error) {
    console.error('Toggle archive error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveDailyReports = async (req: Request, res: Response) => {
  try {
    // Clean active workspace logs by batch archiving non-pending statuses
    await pool.execute(
      "UPDATE facility_reports SET is_archived = 1 WHERE status IN ('fixed', 'cannot_fix', 'cancelled') AND is_archived = 0"
    );
    res.json({ message: 'Daily log cleanup complete' });
  } catch (error) {
    console.error('Daily log archival error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Dashboard reporting statistics configuration
export const getStats = async (req: Request, res: Response) => {
  try {
    const [[{ totalReports }]]: any = await pool.execute('SELECT COUNT(*) as totalReports FROM facility_reports WHERE is_archived = 0');
    const [[{ pendingReports }]]: any = await pool.execute("SELECT COUNT(*) as pendingReports FROM facility_reports WHERE status = 'reported' AND is_archived = 0");

    res.json({ totalReports, pendingReports });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};