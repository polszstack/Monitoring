import { Request, Response } from 'express';
import pool from '../config/database';
import multer from 'multer';
import path from 'path';

// --- Configure Multer Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/verification_photos/'); // Make sure this folder exists in your project
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'verify-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

// Get today's attendance for room checking
export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [attendance]: any = await pool.execute(`
      SELECT 
        da.id,
        da.teacher_id,
        da.attendance_date,
        da.day_of_week,
        da.start_time,
        da.end_time,
        da.subject,
        da.room,
        da.grade_level,
        da.section,
        da.attendance_status,
        da.time_marked,
        da.remarks,
        da.marked_by,
        da.verification_photo, -- Added this column
        u.full_name as teacher_name,
        t.employee_id,
        t.department,
        u2.full_name as marked_by_name
      FROM daily_attendance da
      JOIN teachers t ON da.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users u2 ON da.marked_by = u2.id
      WHERE da.attendance_date = ?
      ORDER BY da.start_time ASC, da.room ASC
    `, [today]);
    
    res.json(attendance);
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    
    const [attendance]: any = await pool.execute(`
      SELECT 
        da.id,
        da.teacher_id,
        da.attendance_date,
        da.day_of_week,
        da.start_time,
        da.end_time,
        da.subject,
        da.room,
        da.grade_level,
        da.section,
        da.attendance_status,
        da.time_marked,
        da.remarks,
        da.marked_by,
        da.verification_photo, -- Added this column
        u.full_name as teacher_name,
        t.employee_id,
        t.department,
        u2.full_name as marked_by_name
      FROM daily_attendance da
      JOIN teachers t ON da.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users u2 ON da.marked_by = u2.id
      WHERE da.attendance_date = ?
      ORDER BY da.start_time ASC, da.room ASC
    `, [date]);
    
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// NEW: Verify Present with Photo Upload
export const verifyPresent = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Verification photo is required to mark teacher as present.' });
    }

    // Save relative image path or URL to your database column
    const photoPath = `/uploads/verification_photos/${req.file.filename}`;

    const [result]: any = await pool.execute(
      `UPDATE daily_attendance 
       SET attendance_status = 'present', 
           time_marked = ?, 
           marked_by = ?,
           verification_photo = ? 
       WHERE id = ?`,
      [currentTime, req.user.id, photoPath, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json({ 
      message: 'Attendance verified with photo successfully',
      photoPath
    });
  } catch (error) {
    console.error('Verify present photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark attendance (Keep this for handling regular 'absent', 'late', etc.)
export const markAttendance = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { attendance_status, remarks } = req.body;
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const validStatuses = ['present', 'absent', 'late', 'excused'];
    if (!validStatuses.includes(attendance_status)) {
      return res.status(400).json({ error: 'Invalid attendance status' });
    }

    const [result]: any = await pool.execute(
      `UPDATE daily_attendance 
       SET attendance_status = ?, 
           time_marked = ?, 
           remarks = ?, 
           marked_by = ? 
       WHERE id = ?`,
      [attendance_status, currentTime, remarks || null, req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    const [updated]: any = await pool.execute(`
      SELECT da.*, u.full_name as teacher_name, t.employee_id
      FROM daily_attendance da
      JOIN teachers t ON da.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE da.id = ?
    `, [id]);

    res.json({ 
      message: 'Attendance marked successfully',
      attendance: updated[0]
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk mark attendance (Unchanged)
export const bulkMarkAttendance = async (req: any, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { attendances } = req.body;
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    await connection.beginTransaction();
    
    for (const att of attendances) {
      await connection.execute(
        `UPDATE daily_attendance 
         SET attendance_status = ?, 
             time_marked = ?, 
             remarks = ?, 
             marked_by = ? 
         WHERE id = ?`,
        [att.attendance_status, currentTime, att.remarks || null, req.user.id, att.id]
      );
    }
    
    await connection.commit();
    res.json({ message: `${attendances.length} attendance records marked successfully` });
  } catch (error) {
    await connection.rollback();
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};