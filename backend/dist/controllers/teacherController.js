"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacher = exports.getTeacher = exports.getAllTeachers = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await database_1.default.execute(`
      SELECT t.*, u.full_name, u.email, u.username, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
    `);
        res.json(teachers);
    }
    catch (error) {
        console.error('Get all teachers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllTeachers = getAllTeachers;
const getTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const [teachers] = await database_1.default.execute(`
      SELECT t.*, u.full_name, u.email, u.username, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);
        if (teachers.length === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(teachers[0]);
    }
    catch (error) {
        console.error('Get teacher error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTeacher = getTeacher;
const createTeacher = async (req, res) => {
    const connection = await database_1.default.getConnection();
    try {
        const { username, password, email, full_name, employee_id, department, position, contact_number, address } = req.body;
        await connection.beginTransaction();
        // Create user
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.execute('INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)', [username, hashedPassword, email, full_name, 'teacher']);
        // Create teacher profile
        const [teacherResult] = await connection.execute('INSERT INTO teachers (user_id, employee_id, department, position, contact_number, address) VALUES (?, ?, ?, ?, ?, ?)', [userResult.insertId, employee_id, department, position, contact_number, address]);
        await connection.commit();
        res.status(201).json({ message: 'Teacher created successfully', id: teacherResult.insertId });
    }
    catch (error) {
        await connection.rollback();
        console.error('Create teacher error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        connection.release();
    }
};
exports.createTeacher = createTeacher;
//# sourceMappingURL=teacherController.js.map