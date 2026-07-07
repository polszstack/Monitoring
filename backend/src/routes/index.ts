import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as teacherController from '../controllers/teacherController';
import * as scheduleController from '../controllers/scheduleController';
import * as attendanceController from '../controllers/attendanceController';
import * as facilityController from '../controllers/facilityController';
import * as visitorController from '../controllers/visitorController';

const router = express.Router();

// Auth routes
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);

// Teacher routes
router.get('/teachers', authenticateToken, teacherController.getAllTeachers);
router.get('/teachers/:id', authenticateToken, teacherController.getTeacher);
router.post('/teachers', authenticateToken, authorizeRoles('admin'), teacherController.createTeacher);

// Schedule routes
router.get('/schedules', authenticateToken, scheduleController.getScheduleTemplates);
router.post('/schedules', authenticateToken, authorizeRoles('admin'), scheduleController.createScheduleTemplate);
router.post('/schedules/generate-attendance', authenticateToken, authorizeRoles('admin'), scheduleController.generateDailyAttendance);

// Attendance routes
router.get('/attendance', authenticateToken, attendanceController.getDailyAttendance);
router.put('/attendance/:id', authenticateToken, attendanceController.markAttendance);

// Facility routes
router.get('/facility/inventory', authenticateToken, facilityController.getInventory);
router.post('/facility/inventory', authenticateToken, authorizeRoles('admin', 'staff'), facilityController.createInventoryItem);
router.post('/facility/reports', authenticateToken, facilityController.createReport);

// Visitor routes
router.get('/visitors', authenticateToken, visitorController.getVisitors);
router.post('/visitors/check-in', authenticateToken, visitorController.checkIn);
router.put('/visitors/:id/check-out', authenticateToken, visitorController.checkOut);

export default router;