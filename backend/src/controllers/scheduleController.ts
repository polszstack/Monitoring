import { Request, Response } from 'express';
import pool from '../config/database';

export const getScheduleTemplates = async (req: Request, res: Response) => {
  try {
    const { teacher_id } = req.query;
    let query = `
      SELECT st.*, 
             t.employee_id, 
             u.full_name as teacher_name
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
    const { 
      teacher_name, 
      employee_id, 
      day_of_week, 
      start_time, 
      end_time, 
      subject, 
      room, 
      grade_level, 
      section 
    } = req.body;

    console.log('📝 Creating schedule with data:', req.body);

    // Validate required fields
    if (!teacher_name || !day_of_week || !start_time || !end_time || !subject) {
      return res.status(400).json({ 
        error: 'Missing required fields: teacher_name, day_of_week, start_time, end_time, subject' 
      });
    }

    let teacherId: number;

    // Check if teacher already exists by name
    const [existingTeachers]: any = await pool.execute(
      'SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.full_name = ?',
      [teacher_name]
    );

    if (existingTeachers.length > 0) {
      teacherId = existingTeachers[0].id;
      console.log('✅ Found existing teacher:', teacherId);
    } else {
      // Create new user for teacher
      let username = teacher_name.toLowerCase().replace(/\s/g, '');
      
      // Check if username exists and make it unique if needed
      const [existingUser]: any = await pool.execute(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      
      if (existingUser.length > 0) {
        username = `${username}${Date.now()}`;
      }
      
      const email = `${username}@school.com`;
      
      console.log('🆕 Creating new teacher:', teacher_name);
      
      const [userResult]: any = await pool.execute(
        'INSERT INTO users (username, password, email, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          username,
          '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2',
          email,
          teacher_name,
          'teacher',
          'active'
        ]
      );

      const userId = userResult.insertId;
      console.log('✅ Created user:', userId);

      // Generate unique employee_id
      let empId = employee_id;
      
      // If employee_id is provided, check if it exists
      if (empId) {
        const [existingEmp]: any = await pool.execute(
          'SELECT id FROM teachers WHERE employee_id = ?',
          [empId]
        );
        
        if (existingEmp.length > 0) {
          // Employee ID exists, generate a new one
          empId = `TCH-${Date.now()}`;
          console.log(`⚠️ Employee ID ${employee_id} already exists, using ${empId} instead`);
        }
      } else {
        // No employee_id provided, generate one
        empId = `TCH-${Date.now()}`;
      }

      // Create teacher record
      const [teacherResult]: any = await pool.execute(
        'INSERT INTO teachers (user_id, employee_id, department) VALUES (?, ?, ?)',
        [userId, empId, 'General']
      );

      teacherId = teacherResult.insertId;
      console.log('✅ Created teacher:', teacherId, 'with employee_id:', empId);
    }

    // Check for duplicate schedule before inserting
    const [existingSchedule]: any = await pool.execute(
      'SELECT id FROM schedule_templates WHERE teacher_id = ? AND day_of_week = ? AND start_time = ?',
      [teacherId, day_of_week, start_time]
    );

    if (existingSchedule.length > 0) {
      return res.status(400).json({ 
        error: `A schedule already exists for this teacher on ${day_of_week} at ${start_time}` 
      });
    }

    // Create schedule template
    const [result]: any = await pool.execute(
      `INSERT INTO schedule_templates 
       (teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [teacherId, day_of_week, start_time, end_time, subject, room, grade_level, section]
    );

    const scheduleId = result.insertId;
    console.log('✅ Created schedule:', scheduleId);

    // ============================================
    // 🔥 AUTO-GENERATE ATTENDANCE FOR THIS SCHEDULE
    // ============================================
    console.log('📅 Generating attendance for this schedule...');
    
    let attendanceCreated = 0;
    
    // Generate attendance for today and next 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Only generate for the specific day of week
      if (dayName === day_of_week) {
        // Check if attendance already exists
        const [existing]: any = await pool.execute(
          'SELECT id FROM daily_attendance WHERE teacher_id = ? AND attendance_date = ? AND start_time = ?',
          [teacherId, dateStr, start_time]
        );

        if (existing.length === 0) {
          await pool.execute(
            `INSERT INTO daily_attendance 
             (schedule_template_id, teacher_id, attendance_date, day_of_week, start_time, end_time, subject, room, grade_level, section, attendance_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [scheduleId, teacherId, dateStr, dayName, start_time, end_time, subject, room, grade_level, section, 'pending']
          );
          attendanceCreated++;
        }
      }
    }
    
    console.log(`✅ Generated ${attendanceCreated} attendance records for future ${day_of_week}s`);

    // Get the created schedule with teacher info
    const [newSchedule]: any = await pool.execute(
      `SELECT st.*, u.full_name as teacher_name, t.employee_id 
       FROM schedule_templates st
       JOIN teachers t ON st.teacher_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE st.id = ?`,
      [scheduleId]
    );

    res.status(201).json({ 
      message: `Schedule template created successfully with ${attendanceCreated} attendance records`, 
      id: scheduleId,
      schedule: newSchedule[0],
      attendance_generated: attendanceCreated
    });
  } catch (error: any) {
    console.error('❌ Create schedule error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
};

export const generateDailyAttendance = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long' });

    console.log(`📅 Generating attendance for ${targetDate} (${dayOfWeek})`);

    // Get all schedule templates for this day with teacher info
    const [templates]: any = await pool.execute(
      `SELECT st.*, t.employee_id, u.full_name as teacher_name
       FROM schedule_templates st
       JOIN teachers t ON st.teacher_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE st.day_of_week = ?`,
      [dayOfWeek]
    );

    console.log(`📚 Found ${templates.length} templates for ${dayOfWeek}`);

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
           (schedule_template_id, teacher_id, attendance_date, day_of_week, start_time, end_time, subject, room, grade_level, section, attendance_status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [template.id, template.teacher_id, targetDate, dayOfWeek, template.start_time, template.end_time, template.subject, template.room, template.grade_level, template.section, 'pending']
        );
        created++;
      }
    }

    res.json({ 
      message: `Generated ${created} attendance records for ${targetDate}`,
      total: templates.length,
      created: created
    });
  } catch (error) {
    console.error('Generate attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};