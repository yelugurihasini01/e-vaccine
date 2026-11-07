import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { getMongoStatus } from '../config/db.js';
import { User } from './User.js';
import { FamilyMember } from './FamilyMember.js';
import { Vaccine } from './Vaccine.js';
import { VaccinationSchedule } from './VaccinationSchedule.js';
import { VaccinationRecord } from './VaccinationRecord.js';
import { Notification } from './Notification.js';
import { UIP_INDIA_VACCINES } from '../config/uipVaccinesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const FALLBACK_DB_FILE = path.join(DATA_DIR, 'evaccine_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory / File Persistent Store when MongoDB is not connected
class LocalMemoryStore {
  constructor() {
    this.data = {
      users: [],
      familyMembers: [],
      vaccines: UIP_INDIA_VACCINES.map((v, idx) => ({ ...v, _id: `vac_${idx + 1}` })),
      schedules: [],
      records: [],
      notifications: []
    };
    this.load();
    this.seedDefaults();
  }

  load() {
    try {
      if (fs.existsSync(FALLBACK_DB_FILE)) {
        const raw = fs.readFileSync(FALLBACK_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read fallback store file:', e.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(FALLBACK_DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Could not save fallback store file:', e.message);
    }
  }

  generateId(prefix = 'id') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  }

  seedDefaults() {
    // If no demo user exists, seed a demo user for quick testing
    if (this.data.users.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const demoUser = {
        _id: 'usr_demo_101',
        fullName: 'Rajesh Sharma',
        dob: '1990-05-15',
        gender: 'Male',
        mobileNumber: '+919876543210',
        email: 'rajesh.sharma@example.in',
        password: bcrypt.hashSync('Password@123', salt),
        role: 'user',
        isMobileVerified: true,
        isEmailVerified: true,
        notificationPreferences: {
          email: true,
          whatsapp: true,
          reminderIntervalsDays: [7, 3, 1, 0],
          preferredLanguage: 'en'
        },
        createdAt: new Date().toISOString()
      };
      this.data.users.push(demoUser);

      // Seed child for Rajesh: Aarav Sharma (approx 6 weeks old)
      const childDob = new Date();
      childDob.setDate(childDob.getDate() - 40); // ~5.7 weeks old
      const child = {
        _id: 'child_demo_201',
        userId: demoUser._id,
        childName: 'Aarav Sharma',
        dob: childDob.toISOString(),
        gender: 'Male',
        bloodGroup: 'B+',
        relationship: 'Child',
        abhaId: '91-4829-1029-34',
        mcpCardNumber: 'MH-MUM-2026-8910',
        primaryHospital: 'Urban Primary Health Centre (UPHC - Sector 4)',
        doctorOrAnmName: 'Dr. Sunita Patil / ANM Rekha',
        allergies: 'None',
        notes: 'Active and healthy baby',
        createdAt: new Date().toISOString()
      };
      this.data.familyMembers.push(child);

      // Seed schedules for child
      this.data.vaccines.forEach(vac => {
        const dueDate = new Date(childDob);
        dueDate.setDate(dueDate.getDate() + vac.ageInDaysFromBirth);
        const isPast = dueDate < new Date();

        this.data.schedules.push({
          _id: this.generateId('sch'),
          familyMemberId: child._id,
          userId: demoUser._id,
          vaccineId: vac._id,
          dueDate: dueDate.toISOString(),
          status: isPast ? 'Completed' : 'Scheduled',
          remindersSent: [],
          notes: '',
          createdAt: new Date().toISOString()
        });
      });

      this.save();
    }
  }
}

export const localStore = new LocalMemoryStore();

// Wrapper around entity operations that automatically selects Mongoose or Local Store
export const DataStore = {
  isMongooseActive() {
    return getMongoStatus().connected;
  },

  // ------------------ USERS ------------------
  async findUser(query, selectPassword = false) {
    if (this.isMongooseActive()) {
      let q = User.findOne(query);
      if (selectPassword) q = q.select('+password +otpDetails.hash +otpDetails.expiresAt +otpDetails.attempts');
      return await q;
    }

    // Local Store query
    const user = localStore.data.users.find(u => {
      for (const key of Object.keys(query)) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });

    if (!user) return null;

    // Attach comparePassword helper
    const userObj = { ...user };
    userObj.comparePassword = async function(candidate) {
      return await bcrypt.compare(candidate, user.password);
    };
    userObj.save = async function() {
      const idx = localStore.data.users.findIndex(u => u._id === user._id);
      if (idx !== -1) {
        localStore.data.users[idx] = { ...this };
        localStore.save();
      }
      return this;
    };
    return userObj;
  },

  async findUserById(id) {
    if (this.isMongooseActive()) {
      return await User.findById(id).select('-otpDetails');
    }
    const user = localStore.data.users.find(u => u._id === id);
    if (!user) return null;
    const userObj = { ...user };
    userObj.save = async function() {
      const idx = localStore.data.users.findIndex(u => u._id === user._id);
      if (idx !== -1) {
        localStore.data.users[idx] = { ...this };
        localStore.save();
      }
      return this;
    };
    return userObj;
  },

  async createUser(userData) {
    if (this.isMongooseActive()) {
      return await User.create(userData);
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);
    const newUser = {
      _id: localStore.generateId('usr'),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    localStore.data.users.push(newUser);
    localStore.save();
    return newUser;
  },

  async countUsers(query = {}) {
    if (this.isMongooseActive()) {
      return await User.countDocuments(query);
    }
    return localStore.data.users.filter(u => {
      for (const k of Object.keys(query)) {
        if (u[k] !== query[k]) return false;
      }
      return true;
    }).length;
  },

  async getAllUsers() {
    if (this.isMongooseActive()) {
      return await User.find().select('-otpDetails').sort({ createdAt: -1 });
    }
    return [...localStore.data.users].reverse();
  },

  // ------------------ FAMILY MEMBERS ------------------
  async getFamilyMembers(userId) {
    if (this.isMongooseActive()) {
      return await FamilyMember.find({ userId }).sort({ createdAt: -1 });
    }
    return localStore.data.familyMembers.filter(f => f.userId === userId);
  },

  async getFamilyMemberById(id, userId) {
    if (this.isMongooseActive()) {
      return await FamilyMember.findOne({ _id: id, userId });
    }
    const member = localStore.data.familyMembers.find(f => f._id === id && f.userId === userId);
    if (!member) return null;
    const memObj = { ...member };
    memObj.save = async function() {
      const idx = localStore.data.familyMembers.findIndex(f => f._id === member._id);
      if (idx !== -1) {
        localStore.data.familyMembers[idx] = { ...this };
        localStore.save();
      }
      return this;
    };
    memObj.deleteOne = async function() {
      localStore.data.familyMembers = localStore.data.familyMembers.filter(f => f._id !== member._id);
      localStore.save();
    };
    return memObj;
  },

  async createFamilyMember(data) {
    if (this.isMongooseActive()) {
      return await FamilyMember.create(data);
    }
    const newMember = {
      _id: localStore.generateId('child'),
      ...data,
      createdAt: new Date().toISOString()
    };
    localStore.data.familyMembers.push(newMember);
    localStore.save();
    return newMember;
  },

  async countFamilyMembers(query = {}) {
    if (this.isMongooseActive()) {
      return await FamilyMember.countDocuments(query);
    }
    return localStore.data.familyMembers.length;
  },

  // ------------------ VACCINES ------------------
  async getVaccines(query = {}) {
    if (this.isMongooseActive()) {
      return await Vaccine.find(query).sort({ ageInDaysFromBirth: 1 });
    }
    return localStore.data.vaccines;
  },

  // ------------------ SCHEDULES ------------------
  async getSchedules(query = {}) {
    if (this.isMongooseActive()) {
      return await VaccinationSchedule.find(query)
        .populate('familyMemberId')
        .populate('vaccineId')
        .sort({ dueDate: 1 });
    }

    return localStore.data.schedules
      .filter(s => {
        if (query.userId && s.userId !== query.userId.toString()) return false;
        if (query.familyMemberId && s.familyMemberId !== query.familyMemberId.toString()) return false;
        if (query.status && s.status !== query.status) return false;
        return true;
      })
      .map(s => {
        const vac = localStore.data.vaccines.find(v => v._id === s.vaccineId) || {};
        const member = localStore.data.familyMembers.find(m => m._id === s.familyMemberId) || {};
        return {
          ...s,
          vaccineId: vac,
          familyMemberId: member
        };
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async findScheduleById(id, userId) {
    if (this.isMongooseActive()) {
      return await VaccinationSchedule.findOne({ _id: id, userId })
        .populate('familyMemberId')
        .populate('vaccineId');
    }

    const schedule = localStore.data.schedules.find(s => s._id === id && (!userId || s.userId === userId));
    if (!schedule) return null;

    const vac = localStore.data.vaccines.find(v => v._id === schedule.vaccineId) || {};
    const member = localStore.data.familyMembers.find(m => m._id === schedule.familyMemberId) || {};

    const scheduleObj = {
      ...schedule,
      vaccineId: vac,
      familyMemberId: member
    };

    scheduleObj.save = async function() {
      const idx = localStore.data.schedules.findIndex(s => s._id === schedule._id);
      if (idx !== -1) {
        localStore.data.schedules[idx] = {
          _id: this._id,
          familyMemberId: this.familyMemberId?._id || this.familyMemberId,
          userId: this.userId,
          vaccineId: this.vaccineId?._id || this.vaccineId,
          dueDate: this.dueDate,
          status: this.status,
          remindersSent: this.remindersSent || [],
          notes: this.notes || ''
        };
        localStore.save();
      }
      return this;
    };

    return scheduleObj;
  },

  async insertSchedules(schedulesArray) {
    if (this.isMongooseActive()) {
      return await VaccinationSchedule.insertMany(schedulesArray);
    }
    const inserted = schedulesArray.map(s => ({
      _id: localStore.generateId('sch'),
      ...s,
      remindersSent: [],
      createdAt: new Date().toISOString()
    }));
    localStore.data.schedules.push(...inserted);
    localStore.save();
    return inserted;
  },

  async countSchedules(query = {}) {
    if (this.isMongooseActive()) {
      return await VaccinationSchedule.countDocuments(query);
    }
    return localStore.data.schedules.filter(s => {
      if (query.status && s.status !== query.status) return false;
      if (query.familyMemberId && s.familyMemberId !== query.familyMemberId.toString()) return false;
      if (query.userId && s.userId !== query.userId.toString()) return false;
      return true;
    }).length;
  },

  async deleteSchedules(query = {}) {
    if (this.isMongooseActive()) {
      return await VaccinationSchedule.deleteMany(query);
    }
    localStore.data.schedules = localStore.data.schedules.filter(s => {
      if (query.familyMemberId && s.familyMemberId === query.familyMemberId.toString()) return false;
      return true;
    });
    localStore.save();
  },

  // ------------------ RECORDS ------------------
  async getRecords(familyMemberId) {
    if (this.isMongooseActive()) {
      return await VaccinationRecord.find({ familyMemberId })
        .populate('vaccineId')
        .sort({ administeredDate: -1 });
    }
    return localStore.data.records
      .filter(r => r.familyMemberId === familyMemberId.toString())
      .map(r => ({
        ...r,
        vaccineId: localStore.data.vaccines.find(v => v._id === r.vaccineId) || {}
      }));
  },

  async createOrUpdateRecord(data) {
    if (this.isMongooseActive()) {
      let rec = await VaccinationRecord.findOne({ scheduleId: data.scheduleId });
      if (!rec) {
        rec = await VaccinationRecord.create(data);
      } else {
        Object.assign(rec, data);
        await rec.save();
      }
      return rec;
    }

    const idx = localStore.data.records.findIndex(r => r.scheduleId === data.scheduleId);
    if (idx !== -1) {
      localStore.data.records[idx] = { ...localStore.data.records[idx], ...data };
      localStore.save();
      return localStore.data.records[idx];
    } else {
      const newRec = {
        _id: localStore.generateId('rec'),
        ...data,
        createdAt: new Date().toISOString()
      };
      localStore.data.records.push(newRec);
      localStore.save();
      return newRec;
    }
  },

  async deleteRecords(query = {}) {
    if (this.isMongooseActive()) {
      return await VaccinationRecord.deleteMany(query);
    }
    localStore.data.records = localStore.data.records.filter(r => {
      if (query.scheduleId && r.scheduleId === query.scheduleId.toString()) return false;
      if (query.familyMemberId && r.familyMemberId === query.familyMemberId.toString()) return false;
      return true;
    });
    localStore.save();
  },

  // ------------------ NOTIFICATIONS ------------------
  async getNotifications(query = {}) {
    if (this.isMongooseActive()) {
      return await Notification.find(query).sort({ sentAt: -1 });
    }
    return localStore.data.notifications
      .filter(n => {
        if (query.userId && n.userId !== query.userId.toString()) return false;
        if (query.channel && n.channel !== query.channel) return false;
        if (query.status && n.status !== query.status) return false;
        return true;
      })
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  },

  async createNotification(notifData) {
    if (this.isMongooseActive()) {
      return await Notification.create(notifData);
    }
    const newNotif = {
      _id: localStore.generateId('notif'),
      ...notifData,
      sentAt: new Date().toISOString()
    };
    localStore.data.notifications.unshift(newNotif);
    localStore.save();
    return newNotif;
  },

  async countNotifications(query = {}) {
    if (this.isMongooseActive()) {
      return await Notification.countDocuments(query);
    }
    return localStore.data.notifications.filter(n => {
      if (query.channel && n.channel !== query.channel) return false;
      return true;
    }).length;
  },

  async clearNotifications(userId) {
    if (this.isMongooseActive()) {
      const q = userId ? { userId } : {};
      return await Notification.deleteMany(q);
    }
    if (userId) {
      localStore.data.notifications = localStore.data.notifications.filter(n => n.userId !== userId.toString());
    } else {
      localStore.data.notifications = [];
    }
    localStore.save();
  }
};

export default DataStore;
