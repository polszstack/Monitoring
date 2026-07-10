"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveVisitor = exports.checkOut = exports.checkIn = exports.getVisitors = void 0;
const database_1 = __importDefault(require("../config/database"));
const getVisitors = async (req, res) => {
    try {
        const { status, date, include_archived } = req.query;
        let query = 'SELECT * FROM visitor_logs';
        const params = [];
        const conditions = [];
        if (include_archived !== 'true') {
            conditions.push('is_archived = 0');
        }
        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }
        if (date) {
            conditions.push('DATE(check_in_time) = ?');
            params.push(date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY check_in_time DESC';
        const [visitors] = await database_1.default.execute(query, params);
        res.json(visitors);
    }
    catch (error) {
        console.error('Get visitors error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getVisitors = getVisitors;
const checkIn = async (req, res) => {
    try {
        const { visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes } = req.body;
        const [result] = await database_1.default.execute(`INSERT INTO visitor_logs 
       (visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes, check_in_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, [visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes]);
        res.status(201).json({ message: 'Visitor checked in successfully', id: result.insertId });
    }
    catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.checkIn = checkIn;
const checkOut = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.execute('UPDATE visitor_logs SET check_out_time = NOW(), status = ? WHERE id = ? AND status = ?', ['checked_out', id, 'checked_in']);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Visitor not found or already checked out' });
        }
        res.json({ message: 'Visitor checked out successfully' });
    }
    catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.checkOut = checkOut;
const archiveVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.execute('UPDATE visitor_logs SET is_archived = 1 WHERE id = ? AND status = ? AND is_archived = 0', [id, 'checked_out']);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Visitor not found or not eligible for archive' });
        }
        res.json({ message: 'Visitor archived successfully' });
    }
    catch (error) {
        console.error('Archive visitor error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.archiveVisitor = archiveVisitor;
//# sourceMappingURL=visitorController.js.map