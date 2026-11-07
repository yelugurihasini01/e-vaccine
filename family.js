import express from 'express';
import { DataStore } from '../models/dataStore.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

function calculateDueDate(dob, ageInDays) {
  const d = new Date(dob);
  d.setDate(d.getDate() + ageInDays);
  return d;
}

/**
 * @route   GET /api/family
 * @desc    Get all family members/children for logged in parent/user
 */
router.get('/', async (req, res) => {
  try {
    const familyMembers = await DataStore.getFamilyMembers(req.user._id);

    const membersWithStats = await Promise.all(
      familyMembers.map(async (member) => {
        const totalSchedules = await DataStore.countSchedules({ familyMemberId: member._id });
        const completedCount = await DataStore.countSchedules({ familyMemberId: member._id, status: 'Completed' });
        const overdueCount = await DataStore.countSchedules({ familyMemberId: member._id, status: 'Overdue' });
        const scheduledCount = await DataStore.countSchedules({ familyMemberId: member._id, status: 'Scheduled' });

        return {
          ...member,
          stats: {
            total: totalSchedules,
            completed: completedCount,
            overdue: overdueCount,
            scheduled: scheduledCount,
            completionPercentage: totalSchedules > 0 ? Math.round((completedCount / totalSchedules) * 100) : 0
          }
        };
      })
    );

    res.json({
      success: true,
      count: membersWithStats.length,
      familyMembers: membersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/family
 * @desc    Register a new child / family member & generate full UIP vaccine schedules
 */
router.post('/', async (req, res) => {
  try {
    const {
      childName,
      dob,
      gender,
      bloodGroup,
      relationship,
      abhaId,
      mcpCardNumber,
      birthWeightKg,
      primaryHospital,
      doctorOrAnmName,
      allergies,
      notes
    } = req.body;

    if (!childName || !dob) {
      return res.status(400).json({
        success: false,
        message: 'Child Name and Date of Birth (DOB) are required.'
      });
    }

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid Date of Birth format.' });
    }

    // 1. Create family member
    const newMember = await DataStore.createFamilyMember({
      userId: req.user._id,
      childName: childName.trim(),
      dob: birthDate.toISOString(),
      gender: gender || 'Male',
      bloodGroup: bloodGroup || 'Unknown',
      relationship: relationship || 'Child',
      abhaId: abhaId || undefined,
      mcpCardNumber: mcpCardNumber || '',
      birthWeightKg: birthWeightKg || null,
      primaryHospital: primaryHospital || 'Urban Primary Health Centre (UPHC)',
      doctorOrAnmName: doctorOrAnmName || 'Medical Officer / ANM',
      allergies: allergies || 'None',
      notes: notes || ''
    });

    // 2. Fetch all official UIP vaccines
    const vaccines = await DataStore.getVaccines();
    const today = new Date();

    // 3. Generate schedules for each vaccine based on child's DOB
    const scheduleDocs = vaccines.map((vac) => {
      const dueDate = calculateDueDate(birthDate, vac.ageInDaysFromBirth);
      const isPast = dueDate < today;

      return {
        familyMemberId: newMember._id,
        userId: req.user._id,
        vaccineId: vac._id,
        dueDate: dueDate.toISOString(),
        status: isPast ? 'Overdue' : 'Scheduled',
        remindersSent: []
      };
    });

    if (scheduleDocs.length > 0) {
      await DataStore.insertSchedules(scheduleDocs);
    }

    res.status(201).json({
      success: true,
      message: `Successfully registered ${newMember.childName} and generated ${scheduleDocs.length} UIP vaccination schedules!`,
      familyMember: newMember,
      schedulesGenerated: scheduleDocs.length
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/family/:id
 * @desc    Get detailed child profile with full vaccination history & upcoming schedule
 */
router.get('/:id', async (req, res) => {
  try {
    const member = await DataStore.getFamilyMemberById(req.params.id, req.user._id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found.' });
    }

    const schedules = await DataStore.getSchedules({ familyMemberId: member._id, userId: req.user._id });
    const records = await DataStore.getRecords(member._id);

    res.json({
      success: true,
      familyMember: member,
      schedules,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/family/:id
 * @desc    Update family member / child information
 */
router.put('/:id', async (req, res) => {
  try {
    const member = await DataStore.getFamilyMemberById(req.params.id, req.user._id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found.' });
    }

    const updatableFields = [
      'childName',
      'gender',
      'bloodGroup',
      'relationship',
      'abhaId',
      'mcpCardNumber',
      'birthWeightKg',
      'primaryHospital',
      'doctorOrAnmName',
      'allergies',
      'notes'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        member[field] = req.body[field];
      }
    });

    await member.save();

    res.json({
      success: true,
      message: 'Family member details updated successfully.',
      familyMember: member
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/family/:id
 * @desc    Delete family member and cascade delete their schedules & records
 */
router.delete('/:id', async (req, res) => {
  try {
    const member = await DataStore.getFamilyMemberById(req.params.id, req.user._id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found.' });
    }

    await DataStore.deleteSchedules({ familyMemberId: member._id });
    await DataStore.deleteRecords({ familyMemberId: member._id });
    await member.deleteOne();

    res.json({
      success: true,
      message: `Record for ${member.childName} and all associated vaccination schedules deleted.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
