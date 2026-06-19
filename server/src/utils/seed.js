import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import Setting from '../models/Setting.js';
import TeamMember from '../models/TeamMember.js';

dotenv.config();
await connectDB();

const email = process.env.ADMIN_EMAIL || 'admin@elalmani.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';

await Admin.findOneAndUpdate(
  { email },
  { email, password: await bcrypt.hash(password, 10) },
  { upsert: true, new: true }
);

const services = [
  'Classic Haircut',
  'Beard Styling',
  'Luxury Grooming',
  'Modern Fade',
  'Hair Treatment',
  'Content Shoots',
];

for (const title of services) {
  await Service.findOneAndUpdate(
    { title },
    { title, description: 'Professional service with premium finishing.', icon: '*', coverImage: '/logo.png', coverPublicId: '' },
    { upsert: true }
  );
}

await Setting.findOneAndUpdate(
  {},
  {
    phone: '+20 100 000 0000',
    whatsapp: '201000000000',
    address: 'مصر',
    addresses: [
      { label: 'فرع وسط البلد', url: 'https://maps.google.com/?q=Downtown+Cairo' },
    ],
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  },
  { upsert: true }
);

const teamSeed = [
  {
    name: 'Ahmed El Almani',
    role: 'Senior Barber',
    shortBio: 'Known for luxury fades, beard detailing, and camera-ready finishes.',
    fullBio:
      'Ahmed leads the creative direction of the salon team and focuses on premium cuts, beard work, and polished client experiences.',
    socialLinks: {
      facebook: '#',
      instagram: '#',
      whatsapp: '201000000000',
    },
  },
  {
    name: 'Omar Salah',
    role: 'Hair Stylist',
    shortBio: 'Specialized in modern styling, texture control, and trend-based looks.',
    fullBio:
      'Omar works closely with clients on styling consultation, shape design, and social-ready grooming looks for daily and event-based appointments.',
    socialLinks: {
      facebook: '#',
      instagram: '#',
      whatsapp: '201000000000',
    },
  },
];

for (const member of teamSeed) {
  await TeamMember.findOneAndUpdate(
    { name: member.name },
    {
      ...member,
      avatar: '/logo.png',
      avatarPublicId: '',
    },
    { upsert: true, new: true }
  );
}

console.log('Seed done. Admin:', email, password);
process.exit();
