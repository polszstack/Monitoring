import express from 'express';
import { authenticateToken, adminOnly } from '../middleware/auth';
import * as authController from '../controllers/authController';
import { Request, Response } from 'express';
import * as teacherController from '../controllers/teacherController';
import * as scheduleController from '../controllers/scheduleController';
import * as attendanceController from '../controllers/attendanceController';
import * as facilityController from '../controllers/facilityController';
import * as visitorController from '../controllers/visitorController';

const router = express.Router();

// Auth routes (public)
router.post('/auth/login', authController.login);

// All routes below require authentication + admin
router.use(authenticateToken);
router.use(adminOnly);

// Auth
// Inline profile handler to avoid relying on a possibly-missing export in authController
router.get('/auth/profile', (req: Request, res: Response) => {
    // authenticateToken middleware should have attached user info to req
    const user = (req as any).user || null;
    return res.json({ user });
});

// Teachers
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teachers/:id', teacherController.getTeacher);
router.post('/teachers', teacherController.createTeacher);

// Schedules
router.get('/schedules', scheduleController.getScheduleTemplates);
router.post('/schedules', scheduleController.createScheduleTemplate);
router.post('/schedules/generate-attendance', scheduleController.generateDailyAttendance);

// Attendance (optimized for room checking with picture verification support)
router.get('/attendance/today', attendanceController.getTodayAttendance);
router.get('/attendance/date/:date', attendanceController.getAttendanceByDate);
router.put('/attendance/:id', attendanceController.markAttendance);
router.put('/attendance/bulk', attendanceController.bulkMarkAttendance);

// NEW: Handover endpoint for handling live camera picture uploads
router.post('/attendance/:id/verify-present', attendanceController.upload.single('photo'), attendanceController.verifyPresent);

// NEW: Archiving endpoints to support Active/Archived toggle functionality
router.post('/attendance/bulk-archive', attendanceController.bulkArchive);
router.post('/attendance/:id/archive', attendanceController.toggleArchive);

// Facilities (full CRUD)
router.get('/facility/inventory', facilityController.getInventory);
router.get('/facility/inventory/:id', facilityController.getInventoryItem);
router.post('/facility/inventory', facilityController.createInventoryItem);
router.put('/facility/inventory/:id', facilityController.updateInventoryItem);
router.get('/facility/reports', facilityController.getReports);
router.post('/facility/reports', facilityController.createReport);
router.put('/facility/reports/:id', facilityController.updateReportStatus);
router.get('/facility/stats', facilityController.getFacilityStats);

// Visitors
router.get('/visitors', visitorController.getVisitors);
router.post('/visitors/check-in', visitorController.checkIn);
router.put('/visitors/:id/check-out', visitorController.checkOut);

export default router;