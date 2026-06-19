import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.warn('Admin bootstrap skipped: missing ADMIN_EMAIL or ADMIN_PASSWORD');
    return;
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return;
  }

  await Admin.create({
    email,
    password: await bcrypt.hash(password, 10),
  });

  console.log('Default admin created:', email);
}
