import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    const ok = await bcrypt.compare(password, admin.password);

    if (!ok) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }

    if (!process.env.JWT_SECRET?.trim()) {
      throw new Error('Missing JWT_SECRET');
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    console.error('Admin login failed:', error.message);
    res.status(500).json({ message: 'Server configuration error during login' });
  }
}
