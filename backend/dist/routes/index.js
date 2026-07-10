"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController = __importStar(require("../controllers/authController"));
const teacherController = __importStar(require("../controllers/teacherController"));
const scheduleController = __importStar(require("../controllers/scheduleController"));
const attendanceController = __importStar(require("../controllers/attendanceController"));
const facilityController = __importStar(require("../controllers/facilityController"));
const visitorController = __importStar(require("../controllers/visitorController"));
const router = express_1.default.Router();
// Auth routes (public)
router.post('/auth/login', authController.login);
// All routes below require authentication
router.use(auth_1.authenticateToken);
// Auth Profile
router.get('/auth/profile', (req, res) => {
    const user = req.user || null;
    return res.json({ user });
});
// Facilities reporting routes are available to authenticated users
router.get('/facility/stats', facilityController.getStats);
router.get('/facility/reports', facilityController.getReports);
router.post('/facility/reports', facilityController.addReport);
// Admin-only routes below
router.use(auth_1.adminOnly);
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
exports.default = router;
//# sourceMappingURL=index.js.map