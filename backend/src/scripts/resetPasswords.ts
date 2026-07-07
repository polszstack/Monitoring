import bcrypt from 'bcrypt';
import pool from '../config/database';

const resetPasswords = async () => {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('New password:', password);
    console.log('New hash:', hashedPassword);

    // Update all users with new password
    await pool.execute(
      'UPDATE users SET password = ?',
      [hashedPassword]
    );

    console.log('✅ All passwords reset to: admin123');

    // Verify
    const [users]: any = await pool.execute('SELECT id, username, password FROM users');
    console.log('\nUpdated users:');
    users.forEach((user: any) => {
      console.log(`- ${user.username}: ${user.password.substring(0, 20)}...`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPasswords();