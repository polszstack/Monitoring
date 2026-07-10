"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const resetPasswords = async () => {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        console.log('New password:', password);
        console.log('New hash:', hashedPassword);
        // Update all users with new password
        await database_1.default.execute('UPDATE users SET password = ?', [hashedPassword]);
        console.log('✅ All passwords reset to: admin123');
        // Verify
        const [users] = await database_1.default.execute('SELECT id, username, password FROM users');
        console.log('\nUpdated users:');
        users.forEach((user) => {
            console.log(`- ${user.username}: ${user.password.substring(0, 20)}...`);
        });
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};
resetPasswords();
//# sourceMappingURL=resetPasswords.js.map