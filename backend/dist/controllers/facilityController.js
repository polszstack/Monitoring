"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.archiveDailyReports = exports.toggleArchiveReport = exports.updateReportStatus = exports.addReport = exports.getReports = void 0;
const database_1 = __importDefault(require("../config/database"));
// Simplified Reporting View API: Fetches active (unarchived) items by default
const getReports = async (req, res) => {
    try {
        const { include_archived } = req.query;
        let query = `
      SELECT fr.*, u.full_name as reporter_name 
      FROM facility_reports fr
      LEFT JOIN users u ON fr.reported_by = u.id
      WHERE 1=1
    `;
        const params = [];
        if (include_archived !== 'true') {
            query += ' AND fr.is_archived = 0';
        }
        query += ' ORDER BY fr.priority DESC, fr.reported_date DESC';
        const [reports] = await database_1.default.execute(query, params);
        res.json(reports);
    }
    catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getReports = getReports;
const addReport = async (req, res) => {
    try {
        const { item_name, facility_type, item_description, location, room_number, priority, notes } = req.body;
        const report_number = 'REP-' + Math.floor(100000 + Math.random() * 900000);
        const reporter_id = req.user?.id || 1; // Fallback token ID if auth isn't parsed
        await database_1.default.execute(`INSERT INTO facility_reports 
       (report_number, item_name, facility_type, item_description, location, room_number, priority, notes, reported_by, reported_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, [report_number, item_name, facility_type, item_description, location, room_number, priority, notes, reporter_id]);
        res.status(201).json({ message: 'Report logged successfully' });
    }
    catch (error) {
        console.error('Add report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.addReport = addReport;
const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await database_1.default.execute('UPDATE facility_reports SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Report status updated' });
    }
    catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateReportStatus = updateReportStatus;
// ARCHIVE CORE ACTIONS
const toggleArchiveReport = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.execute('UPDATE facility_reports SET is_archived = NOT is_archived WHERE id = ?', [id]);
        res.json({ message: 'Report archival toggled' });
    }
    catch (error) {
        console.error('Toggle archive error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleArchiveReport = toggleArchiveReport;
const archiveDailyReports = async (req, res) => {
    try {
        // Clean active workspace logs by batch archiving non-pending statuses
        await database_1.default.execute("UPDATE facility_reports SET is_archived = 1 WHERE status IN ('fixed', 'cannot_fix', 'cancelled') AND is_archived = 0");
        res.json({ message: 'Daily log cleanup complete' });
    }
    catch (error) {
        console.error('Daily log archival error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.archiveDailyReports = archiveDailyReports;
// Dashboard reporting statistics configuration
const getStats = async (req, res) => {
    try {
        const [[{ totalReports }]] = await database_1.default.execute('SELECT COUNT(*) as totalReports FROM facility_reports WHERE is_archived = 0');
        const [[{ pendingReports }]] = await database_1.default.execute("SELECT COUNT(*) as pendingReports FROM facility_reports WHERE status = 'reported' AND is_archived = 0");
        res.json({ totalReports, pendingReports });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getStats = getStats;
//# sourceMappingURL=facilityController.js.map