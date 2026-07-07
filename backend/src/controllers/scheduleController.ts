import { Request, Response } from 'express';
import pool from '../config/database';

export const getScheduleTemplates = async (req: Request, res: Response) => {
  try {
    const { teacher_id } = req.query;
    let query = `
      SELECT st.*, t.employee_id, u.full_name as teacher_name
      FROM schedule_templates st
      JOIN teachers t ON st.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
    `;
    const params: any[] = [];

    if (teacher_id) {
      query += ' WHERE st.teacher_id = ?';
      params.push(teacher_id);
    }

    query += ' ORDER BY FIELD(st.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), st.start_time';

    const [schedules]: any = await pool.execute(query, params);
    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createScheduleTemplate = async (req: Request, res: Response) => {
  try {
    const { teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section } = req.body;

    const [result]: any = await pool.execute(
      'INSERT INTO schedule_templates (teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section]
    );

    res.status(201).json({ message: 'Schedule template created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateDailyAttendance = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long' });

    // Get all schedule templates for this day
    const [templates]: any = await pool.execute(
      'SELECT * FROM schedule_templates WHERE day_of_week = ?',
      [dayOfWeek]
    );

    let created = 0;
    for (const template of templates) {
      // Check if attendance already exists
      const [existing]: any = await pool.execute(
        'SELECT id FROM daily_attendance WHERE teacher_id = ? AND attendance_date = ? AND start_time = ?',
        [template.teacher_id, targetDate, template.start_time]
      );

      if (existing.length === 0) {
        await pool.execute(
          `INSERT INTO daily_attendance 
           (schedule_template_id, teacher_id, attendance_date, day_of_week, start_time, end_time, subject, room, grade_level, section) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [template.id, template.teacher_id, targetDate, dayOfWeek, template.start_time, template.end_time, template.subject, template.room, template.grade_level, template.section]
        );
        created++;
      }
    }

    res.json({ message: `Generated ${created} attendance records for ${targetDate}` });
  } catch (error) {
    console.error('Generate attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};