/**
 * Seed script — Creates the test user and sample leads in Firebase.
 * Run: npm run seed
 */
require('dotenv').config();
const { auth, db } = require('./config/firebase');

const SAMPLE_LEADS = [
  {
    name: 'Sarah Johnson',
    company: 'TechFlow Solutions',
    email: 'sarah@techflow.com',
    phone: '+1 (555) 123-4567',
    source: 'LinkedIn',
    assignedTo: 'Admin User',
    status: 'Qualified',
    dealValue: 45000,
  },
  {
    name: 'Michael Chen',
    company: 'DataWave Inc',
    email: 'michael@datawave.io',
    phone: '+1 (555) 234-5678',
    source: 'Website',
    assignedTo: 'Admin User',
    status: 'New',
    dealValue: 28000,
  },
  {
    name: 'Emily Rodriguez',
    company: 'CloudNine Systems',
    email: 'emily@cloudnine.com',
    phone: '+1 (555) 345-6789',
    source: 'Referral',
    assignedTo: 'Admin User',
    status: 'Proposal Sent',
    dealValue: 72000,
  },
  {
    name: 'James Wilson',
    company: 'GreenLeaf Corp',
    email: 'james@greenleaf.co',
    phone: '+1 (555) 456-7890',
    source: 'Cold Email',
    assignedTo: 'Admin User',
    status: 'Won',
    dealValue: 35000,
  },
  {
    name: 'Lisa Park',
    company: 'Nexus Digital',
    email: 'lisa@nexusdigital.com',
    phone: '+1 (555) 567-8901',
    source: 'Event',
    assignedTo: 'Admin User',
    status: 'Contacted',
    dealValue: 55000,
  },
  {
    name: 'David Brown',
    company: 'Apex Industries',
    email: 'david@apexind.com',
    phone: '+1 (555) 678-9012',
    source: 'LinkedIn',
    assignedTo: 'Admin User',
    status: 'Lost',
    dealValue: 40000,
  },
  {
    name: 'Anna Martinez',
    company: 'Bright Horizon Ltd',
    email: 'anna@brighthorizon.com',
    phone: '+1 (555) 789-0123',
    source: 'Website',
    assignedTo: 'Admin User',
    status: 'New',
    dealValue: 62000,
  },
  {
    name: 'Robert Taylor',
    company: 'Quantum Labs',
    email: 'robert@quantumlabs.io',
    phone: '+1 (555) 890-1234',
    source: 'Referral',
    assignedTo: 'Admin User',
    status: 'Won',
    dealValue: 88000,
  },
];

async function seed() {
  console.log('Starting seed process...\n');

  // 1. Create test user
  try {
    let user;
    try {
      user = await auth.getUserByEmail('admin@example.com');
      console.log('Test user already exists:', user.uid);
    } catch (e) {
      user = await auth.createUser({
        email: 'admin@example.com',
        password: 'password123',
        displayName: 'Admin User',
      });
      console.log('Created test user:', user.uid);
    }
  } catch (error) {
    console.error('Error creating test user:', error.message);
  }

  // 2. Create sample leads
  console.log('\nSeeding sample leads...');
  for (const lead of SAMPLE_LEADS) {
    const now = new Date();
    // Stagger creation dates for realism
    const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    const docRef = await db.collection('leads').add({
      ...lead,
      createdAt,
      updatedAt: createdAt,
      createdBy: 'admin@example.com',
    });
    console.log(`  Created lead: ${lead.name} (${docRef.id})`);

    // Add a sample note to each lead
    await db.collection('leads').doc(docRef.id).collection('notes').add({
      content: `Initial contact with ${lead.name} from ${lead.company}. Discussed potential opportunities.`,
      createdBy: 'admin@example.com',
      createdAt,
    });
  }

  console.log('\nSeed completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: admin@example.com');
  console.log('  Password: password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
