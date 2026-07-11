 import express from 'express';
import { authenticateToken, adminOnly } from '../middleware/auth';
import { Request, Response } from 'express';
import * as authController from '../controllers/authController';
import * as teacherController from '../controllers/teacherController';
import * as scheduleController from '../controllers/scheduleController';
import * as attendanceController from '../controllers/attendanceController';
import * as facilityController from '../controllers/facilityController';
import * as visitorController from '../controllers/visitorController';

const router = express.Router();

// Auth routes (public)
router.post('/auth/login', authController.login);

// All routes below require authentication
router.use(authenticateToken);

// Auth Profile
router.get('/auth/profile', (req: Request, res: Response) => {
    const user = (req as any).user || null;
    return res.json({ user });
});

// Facilities reporting routes are available to authenticated users
router.get('/facility/stats', facilityController.getStats);
router.get('/facility/reports', facilityController.getReports);
router.post('/facility/reports', facilityController.addReport);

// Admin-only routes below
router.use(adminOnly);

// Teachers
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teachers/:id', teacherController.getTeacher);
router.post('/teachers', teacherController.createTeacher);

// Schedules
router.get('/schedules', scheduleController.getScheduleTemplates);
router.post('/schedules', scheduleController.createScheduleTemplate);

// Attendance
router.get('/attendance/date/:date', attendanceController.getAttendanceByDate);
router.put('/attendance/:id', attendanceController.markAttendance);
router.put('/attendance/bulk', attendanceController.bulkMarkAttendance);

// Attendance picture upload handler
router.post('/attendance/:id/verify-present', attendanceController.upload.single('photo'), attendanceController.verifyPresent);

// Attendance Archiving
router.post('/attendance/bulk-archive', attendanceController.bulkArchive);
router.post('/attendance/:id/archive', attendanceController.toggleArchive);

// ==========================================
// Facilities Management & Reporting Logs (Inventory Registry Disabled)
// ==========================================

// Reporting Log Entries
router.put('/facility/reports/:id', facilityController.updateReportStatus);

// Reporting Retention & Archiving Core Controls
router.put('/facility/reports/:id/archive', facilityController.toggleArchiveReport);
router.post('/facility/reports/archive-daily', facilityController.archiveDailyReports);

// ==========================================
// Visitors Control Hub
// ==========================================
router.get('/visitors', visitorController.getVisitors);
router.post('/visitors/check-in', visitorController.checkIn);
router.put('/visitors/:id/check-out', visitorController.checkOut);
router.put('/visitors/:id/archive', visitorController.archiveVisitor);

export default router;