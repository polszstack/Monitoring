import { Request, Response } from 'express';
import pool from '../config/database';

export const getDailyAttendance = async (req: Request, res: Response) => {
  try {
    const { date, teacher_id } = req.query;
    let query = `
      SELECT da.*, u.full_name as teacher_name, t.employee_id
      FROM daily_attendance da
      JOIN teachers t ON da.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (date) {
      conditions.push('da.attendance_date = ?');
      params.push(date);
    }

    if (teacher_id) {
      conditions.push('da.teacher_id = ?');
      params.push(teacher_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY da.attendance_date DESC, da.start_time';

    const [attendance]: any = await pool.execute(query, params);
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { attendance_status, remarks, marked_by } = req.body;
    const currentTime = new Date().toTimeString().split(' ')[0];

    const [result]: any = await pool.execute(
      'UPDATE daily_attendance SET attendance_status = ?, time_marked = ?, remarks = ?, marked_by = ? WHERE id = ?',
      [attendance_status, currentTime, remarks, marked_by, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};