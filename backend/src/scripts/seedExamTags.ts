import mongoose from 'mongoose';
import ExamTag from '../models/ExamTag.model';
import env from '../config/env';

const tags = [
  { name: 'NEET UG',    category: 'Medical',       countryCode: 'IN' },
  { name: 'NEET PG',    category: 'Medical',       countryCode: 'IN' },
  { name: 'AIIMS',      category: 'Medical',       countryCode: 'IN' },
  { name: 'JEE Main',   category: 'Engineering',   countryCode: 'IN' },
  { name: 'JEE Advanced', category: 'Engineering', countryCode: 'IN' },
  { name: 'BITSAT',     category: 'Engineering',   countryCode: 'IN' },
  { name: 'VITEEE',     category: 'Engineering',   countryCode: 'IN' },
  { name: 'UPSC CSE',   category: 'Civil Services',countryCode: 'IN' },
  { name: 'UPSC CAPF',  category: 'Civil Services',countryCode: 'IN' },
  { name: 'IFS',        category: 'Civil Services',countryCode: 'IN' },
  { name: 'IBPS PO',    category: 'Banking',       countryCode: 'IN' },
  { name: 'IBPS Clerk', category: 'Banking',       countryCode: 'IN' },
  { name: 'SBI PO',     category: 'Banking',       countryCode: 'IN' },
  { name: 'RBI Grade B',category: 'Banking',       countryCode: 'IN' },
  { name: 'SSC CGL',    category: 'SSC',           countryCode: 'IN' },
  { name: 'SSC CHSL',   category: 'SSC',           countryCode: 'IN' },
  { name: 'SSC MTS',    category: 'SSC',           countryCode: 'IN' },
  { name: 'CAT',        category: 'MBA',           countryCode: 'IN' },
  { name: 'XAT',        category: 'MBA',           countryCode: 'IN' },
  { name: 'SNAP',       category: 'MBA',           countryCode: 'IN' },
  { name: 'MAT',        category: 'MBA',           countryCode: 'IN' },
  { name: 'CLAT',       category: 'Law',           countryCode: 'IN' },
  { name: 'AILET',      category: 'Law',           countryCode: 'IN' },
  { name: 'NDA',        category: 'Defence',       countryCode: 'IN' },
  { name: 'CDS',        category: 'Defence',       countryCode: 'IN' },
  { name: 'AFCAT',      category: 'Defence',       countryCode: 'IN' },
  { name: 'GATE',       category: 'Tech/PSU',      countryCode: 'IN' },
  { name: 'NIFT',       category: 'Design',        countryCode: 'IN' },
  { name: 'NID',        category: 'Design',        countryCode: 'IN' },
  { name: 'CTET',       category: 'Teaching',      countryCode: 'IN' },
  { name: 'TET',        category: 'Teaching',      countryCode: 'IN' },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  await ExamTag.deleteMany({ countryCode: 'IN' });
  await ExamTag.insertMany(tags);
  console.log(`Seeded ${tags.length} exam tags`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
