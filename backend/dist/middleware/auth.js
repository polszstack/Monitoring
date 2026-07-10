"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    // ✅ FIX: Allow browser CORS preflight checks to pass through without a token
    if (req.method === 'OPTIONS') {
        return next();
    }
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default-secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
// Admin only middleware
const adminOnly = (req, res, next) => {
    // ✅ FIX: Allow browser CORS preflight checks to pass through unblocked
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=auth.js.map