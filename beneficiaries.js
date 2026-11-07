import express from 'express';
import { db, generateId } from '../models/db.js';

const router = express.Router();

/**
 * Helper to calculate due date from DOB and offsetWeeks
 */
function calculateDueDate(dobStr, offsetWeeks) {
  const d = new Date(dobStr);
  d.setDate(d.getDate() + offsetWeeks * 7);
  return d.toISOString().split('T')[0];
}

/**
 * GET /api/beneficiaries
 * Returns all registered children with summary metrics
 */
router.get('/', (req, res) => {
  const beneficiaries = db.getAll('beneficiaries');
  const schedules = db.getAll('schedules');

  const todayStr = new Date().toISOString().split('T')[0];

  const enriched = beneficiaries.map(child => {
    const childSchedules = schedules.filter(s => s.beneficiaryId === child.id);
    const total = childSchedules.length;
    const completed = childSchedules.filter(s => s.status === 'completed').length;
    const overdue = childSchedules.filter(s => s.status === 'overdue' || (s.status === 'upcoming' && s.dueDate < todayStr)).length;
    const upcoming = total - completed - overdue;

    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...child,
      metrics: {
        totalDoses: total,
        completedDoses: completed,
        overdueDoses: overdue,
        upcomingDoses: upcoming,
        progressPercent: progressPercent
      }
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    data: enriched
  });
});

/**
 * GET /api/beneficiaries/:id
 * Returns single child details, complete vaccine timeline, and notifications
 */
router.get('/:id', (req, res) => {
  const child = db.getById('beneficiaries', req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, error: 'Beneficiary not found' });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const schedules = db.find('schedules', s => s.beneficiaryId === child.id)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Update dynamic overdue status for response
  schedules.forEach(s => {
    if (s.status === 'upcoming' && s.dueDate < todayStr) {
      s.status = 'overdue';
    }
  });

  const notifications = db.find('notifications', n => n.beneficiaryId === child.id)
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  const total = schedules.length;
  const completed = schedules.filter(s => s.status === 'completed').length;
  const overdue = schedules.filter(s => s.status === 'overdue').length;

  res.json({
    success: true,
    data: {
      ...child,
      metrics: {
        totalDoses: total,
        completedDoses: completed,
        overdueDoses: overdue,
        progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0
      },
      schedules,
      notifications
    }
  });
});

/**
 * POST /api/beneficiaries
 * Register a new child & automatically generate immunization timeline
 */
router.post('/', (req, res) => {
  const {
    fullName,
    dateOfBirth,
    gender,
    bloodGroup,
    guardianName,
    guardianRelationship,
    email,
    phone,
    address,
    allergies
  } = req.body;

  if (!fullName || !dateOfBirth || !guardianName || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      error: 'Required fields missing: fullName, dateOfBirth, guardianName, and at least one contact (email or phone).'
    });
  }

  // 1. Create Beneficiary
  const newChild = db.insert('beneficiaries', {
    id: generateId('child'),
    fullName: fullName.trim(),
    dateOfBirth,
    gender: gender || 'Unspecified',
    bloodGroup: bloodGroup || 'Unknown',
    guardianName: guardianName.trim(),
    guardianRelationship: guardianRelationship || 'Parent',
    email: (email || '').trim().toLowerCase(),
    phone: (phone || '').trim(),
    address: (address || '').trim(),
    allergies: (allergies || '').trim() || 'None',
    createdAt: new Date().toISOString()
  });

  // 2. Auto-generate schedules from master vaccines
  const masterVaccines = db.getAll('vaccines');
  const todayStr = new Date().toISOString().split('T')[0];

  const generatedSchedules = masterVaccines.map(vac => {
    const dueDate = calculateDueDate(dateOfBirth, vac.offsetWeeks);
    const isPast = dueDate < todayStr;

    return db.insert('schedules', {
      id: generateId('sch'),
      beneficiaryId: newChild.id,
      vaccineId: vac.id,
      vaccineCode: vac.code,
      vaccineName: vac.name,
      targetDisease: vac.targetDisease,
      dose: vac.dose,
      offsetWeeks: vac.offsetWeeks,
      ageLabel: vac.ageLabel,
      dueDate: dueDate,
      status: isPast ? 'overdue' : 'upcoming',
      administeredDate: null,
      batchNumber: null,
      clinic: null,
      administeredBy: null,
      notes: '',
      reminderSentCount: 0,
      lastReminderAt: null
    });
  });

  res.status(201).json({
    success: true,
    message: `Beneficiary registered successfully with ${generatedSchedules.length} scheduled vaccine doses.`,
    data: {
      ...newChild,
      schedulesCount: generatedSchedules.length
    }
  });
});

/**
 * PUT /api/beneficiaries/:id
 */
router.put('/:id', (req, res) => {
  const existing = db.getById('beneficiaries', req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Beneficiary not found' });
  }

  const { fullName, gender, bloodGroup, guardianName, guardianRelationship, email, phone, address, allergies } = req.body;

  const updated = db.update('beneficiaries', req.params.id, {
    fullName: fullName ? fullName.trim() : existing.fullName,
    gender: gender || existing.gender,
    bloodGroup: bloodGroup || existing.bloodGroup,
    guardianName: guardianName ? guardianName.trim() : existing.guardianName,
    guardianRelationship: guardianRelationship || existing.guardianRelationship,
    email: email !== undefined ? email.trim().toLowerCase() : existing.email,
    phone: phone !== undefined ? phone.trim() : existing.phone,
    address: address !== undefined ? address.trim() : existing.address,
    allergies: allergies !== undefined ? allergies.trim() : existing.allergies
  });

  res.json({ success: true, data: updated });
});

/**
 * DELETE /api/beneficiaries/:id
 */
router.delete('/:id', (req, res) => {
  const child = db.getById('beneficiaries', req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, error: 'Beneficiary not found' });
  }

  // Delete child
  db.delete('beneficiaries', req.params.id);

  // Delete associated schedules
  const childSchedules = db.find('schedules', s => s.beneficiaryId === req.params.id);
  childSchedules.forEach(s => db.delete('schedules', s.id));

  res.json({
    success: true,
    message: `Deleted beneficiary ${child.fullName} and ${childSchedules.length} schedules.`
  });
});

export default router;
