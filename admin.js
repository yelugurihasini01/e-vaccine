import express from 'express';
import { DataStore } from '../models/dataStore.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { reminderEngine } from '../services/reminderEngine.js';

const router = express.Router();
router.use(protect, adminOnly);

/**
 * @route   GET /api/admin/metrics
 * @desc    Get system-wide health and immunization statistics
 */
router.get('/metrics', async (req, res) => {
  try {
    const totalUsers = await DataStore.countUsers();
    const totalChildren = await DataStore.countFamilyMembers();
    const totalSchedules = await DataStore.countSchedules();
    const completedSchedules = await DataStore.countSchedules({ status: 'Completed' });
    const overdueSchedules = await DataStore.countSchedules({ status: 'Overdue' });
    const scheduledUpcoming = await DataStore.countSchedules({ status: 'Scheduled' });

    const totalNotifications = await DataStore.countNotifications();
    const whatsappNotifications = await DataStore.countNotifications({ channel: 'whatsapp' });
    const emailNotifications = await DataStore.countNotifications({ channel: 'email' });

    const coverageRate = totalSchedules > 0 ? Math.round((completedSchedules / totalSchedules) * 100) : 0;

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalChildren,
        totalSchedules,
        completedSchedules,
        overdueSchedules,
        scheduledUpcoming,
        coverageRate,
        totalNotifications,
        whatsappNotifications,
        emailNotifications,
        schedulerStatus: reminderEngine.isRunning ? 'Running (IST 08:00 AM)' : 'Stopped'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    List all registered parents/users with their child count
 */
router.get('/users', async (req, res) => {
  try {
    const users = await DataStore.getAllUsers();

    const userList = await Promise.all(
      users.map(async (u) => {
        const children = await DataStore.getFamilyMembers(u._id);
        return {
          ...u,
          childrenRegistered: children.length
        };
      })
    );

    res.json({
      success: true,
      count: userList.length,
      users: userList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
