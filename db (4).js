import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_VACCINE_SCHEDULE } from '../config/defaultSchedule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate unique ID helper
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

class Database {
  constructor() {
    this.data = {
      beneficiaries: [],
      schedules: [],
      vaccines: [],
      notifications: [],
      settings: {}
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        ['beneficiaries', 'schedules', 'vaccines', 'notifications'].forEach(col => {
          if (!this.data[col]) this.data[col] = [];
        });
        if (!this.data.settings) this.data.settings = {};
      } else {
        this.seedInitialData();
        this.persist();
      }
    } catch (err) {
      console.error('Error initializing database, using fresh seeded store:', err.message);
      this.seedInitialData();
      this.persist();
    }
  }

  persist() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err.message);
    }
  }

  seedInitialData() {
    // 1. Seed Master Vaccines
    this.data.vaccines = DEFAULT_VACCINE_SCHEDULE.map(v => ({
      ...v,
      id: generateId('vac')
    }));

    // 2. Helper to compute due date from DOB and offsetWeeks
    const addWeeks = (dateStr, weeks) => {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + weeks * 7);
      return d.toISOString().split('T')[0];
    };

    // Reference dates for demonstration
    const today = new Date();
    
    // Child 1: Liam Miller (approx 10 weeks old - has upcoming 10-week dose due in 3 days)
    const dob1 = new Date(today);
    dob1.setDate(dob1.getDate() - 67); // ~9.5 weeks ago
    const dobStr1 = dob1.toISOString().split('T')[0];

    const child1 = {
      id: generateId('child'),
      fullName: 'Liam Miller',
      dateOfBirth: dobStr1,
      gender: 'Male',
      bloodGroup: 'O+',
      guardianName: 'Sarah Miller',
      guardianRelationship: 'Mother',
      email: 'sarah.miller.test@gmail.com',
      phone: '+14155552671',
      address: '742 Evergreen Terrace, Springfield',
      allergies: 'None known',
      createdAt: new Date().toISOString()
    };

    // Child 2: Sophia Chen (approx 7 months old - has an overdue 6-week booster & upcoming 9-month MR)
    const dob2 = new Date(today);
    dob2.setDate(dob2.getDate() - 210); // ~7 months ago
    const dobStr2 = dob2.toISOString().split('T')[0];

    const child2 = {
      id: generateId('child'),
      fullName: 'Sophia Chen',
      dateOfBirth: dobStr2,
      gender: 'Female',
      bloodGroup: 'A+',
      guardianName: 'David Chen',
      guardianRelationship: 'Father',
      email: 'david.chen.demo@gmail.com',
      phone: '+14155559812',
      address: '88 Lotus Lane, San Francisco, CA',
      allergies: 'Mild egg allergy (pediatrician noted)',
      createdAt: new Date().toISOString()
    };

    // Child 3: Aarav Sharma (Newborn - 10 days old, due for 6-week vaccines soon)
    const dob3 = new Date(today);
    dob3.setDate(dob3.getDate() - 10);
    const dobStr3 = dob3.toISOString().split('T')[0];

    const child3 = {
      id: generateId('child'),
      fullName: 'Aarav Sharma',
      dateOfBirth: dobStr3,
      gender: 'Male',
      bloodGroup: 'B+',
      guardianName: 'Priya Sharma',
      guardianRelationship: 'Mother',
      email: 'priya.sharma.sample@gmail.com',
      phone: '+14155554321',
      address: '320 Sunshine Blvd, Austin, TX',
      allergies: 'None',
      createdAt: new Date().toISOString()
    };

    this.data.beneficiaries = [child1, child2, child3];

    // 3. Generate Schedules for the 3 sample children
    const createSchedulesForChild = (child, administeredUntilWeeks = -1) => {
      return this.data.vaccines.map(vac => {
        const dueDate = addWeeks(child.dateOfBirth, vac.offsetWeeks);
        const isPast = new Date(dueDate) < today;
        const isGiven = vac.offsetWeeks <= administeredUntilWeeks;

        let status = 'upcoming';
        let administeredDate = null;
        let batchNumber = null;
        let clinic = null;
        let administeredBy = null;

        if (isGiven) {
          status = 'completed';
          administeredDate = dueDate;
          batchNumber = `LOT-${Math.floor(100000 + Math.random() * 900000)}`;
          clinic = 'CareWell Immunization Center';
          administeredBy = 'Dr. Emily Vance, MD';
        } else if (isPast) {
          status = 'overdue';
        }

        return {
          id: generateId('sch'),
          beneficiaryId: child.id,
          vaccineId: vac.id,
          vaccineCode: vac.code,
          vaccineName: vac.name,
          targetDisease: vac.targetDisease,
          dose: vac.dose,
          offsetWeeks: vac.offsetWeeks,
          ageLabel: vac.ageLabel,
          dueDate: dueDate,
          status: status, // 'upcoming' | 'completed' | 'overdue' | 'rescheduled'
          administeredDate: administeredDate,
          batchNumber: batchNumber,
          clinic: clinic,
          administeredBy: administeredBy,
          notes: isGiven ? 'Standard tolerance, no immediate adverse events.' : '',
          reminderSentCount: 0,
          lastReminderAt: null
        };
      });
    };

    // Child 1 completed birth & 6-week vaccines; 10-week is due very soon
    const sch1 = createSchedulesForChild(child1, 6);
    // Child 2 completed birth vaccines, missed some 14-week ones -> has overdue
    const sch2 = createSchedulesForChild(child2, 10);
    // Child 3 completed birth dose only
    const sch3 = createSchedulesForChild(child3, 0);

    this.data.schedules = [...sch1, ...sch2, ...sch3];

    // 4. Seed initial notification history log
    this.data.notifications = [
      {
        id: generateId('notif'),
        beneficiaryId: child1.id,
        beneficiaryName: child1.fullName,
        guardianName: child1.guardianName,
        channel: 'whatsapp',
        recipient: child1.phone,
        vaccineName: 'Pentavalent 2 (DTP-HepB-Hib)',
        dueDate: addWeeks(child1.dateOfBirth, 10),
        status: 'delivered',
        messagePreview: `Reminder from CareWell: Liam's 10-week vaccination (Pentavalent 2, OPV-2) is due on ${addWeeks(child1.dateOfBirth, 10)}. Please visit clinic or confirm appointment.`,
        sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        deliveryDetails: { provider: 'simulator', messageId: 'sim_wa_991823' }
      },
      {
        id: generateId('notif'),
        beneficiaryId: child1.id,
        beneficiaryName: child1.fullName,
        guardianName: child1.guardianName,
        channel: 'email',
        recipient: child1.email,
        vaccineName: 'Pentavalent 2 (DTP-HepB-Hib)',
        dueDate: addWeeks(child1.dateOfBirth, 10),
        status: 'delivered',
        messagePreview: `Vaccination Reminder: Liam Miller's Pentavalent 2 is scheduled for ${addWeeks(child1.dateOfBirth, 10)}`,
        sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        deliveryDetails: { provider: 'smtp', messageId: 'msg_em_88412' }
      }
    ];
  }

  // Generic collection operations
  getCollection(name) {
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }

  getAll(collection) {
    return this.getCollection(collection);
  }

  getById(collection, id) {
    return this.getCollection(collection).find(item => item.id === id) || null;
  }

  find(collection, predicate) {
    return this.getCollection(collection).filter(predicate);
  }

  findOne(collection, predicate) {
    return this.getCollection(collection).find(predicate) || null;
  }

  insert(collection, item) {
    const list = this.getCollection(collection);
    const newItem = {
      ...item,
      id: item.id || generateId(collection.substring(0, 3)),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newItem);
    this.persist();
    return newItem;
  }

  update(collection, id, updates) {
    const list = this.getCollection(collection);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return list[index];
  }

  delete(collection, id) {
    const list = this.getCollection(collection);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    this.persist();
    return true;
  }
}

export const db = new Database();
