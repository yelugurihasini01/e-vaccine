import express from 'express';
import { Vaccine } from '../models/Vaccine.js';
import { UIP_INDIA_VACCINES } from '../config/uipVaccinesData.js';

const router = express.Router();

/**
 * @route   GET /api/vaccines
 * @desc    Get all vaccines with optional search, category, or mandatory filters
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, mandatory } = req.query;

    let query = {};
    if (category && category !== 'All') {
      query.milestoneCategory = category;
    }
    if (mandatory !== undefined) {
      query.isMandatory = mandatory === 'true';
    }

    let vaccines = await Vaccine.find(query).sort({ ageInDaysFromBirth: 1 });

    // Fallback to static list if database has not been seeded yet
    if (!vaccines || vaccines.length === 0) {
      vaccines = UIP_INDIA_VACCINES;
      if (category && category !== 'All') {
        vaccines = vaccines.filter(v => v.milestoneCategory === category);
      }
    }

    if (search) {
      const term = search.toLowerCase();
      vaccines = vaccines.filter(v =>
        v.code.toLowerCase().includes(term) ||
        v.name.toLowerCase().includes(term) ||
        v.diseasePrevented.toLowerCase().includes(term) ||
        (v.hindiName && v.hindiName.includes(term))
      );
    }

    res.json({
      success: true,
      count: vaccines.length,
      vaccines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/vaccines/:code
 * @desc    Get detailed vaccine info by code (e.g. BCG, MR-1)
 */
router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    let vaccine = await Vaccine.findOne({ code });

    if (!vaccine) {
      vaccine = UIP_INDIA_VACCINES.find(v => v.code.toUpperCase() === code);
    }

    if (!vaccine) {
      return res.status(404).json({ success: false, message: `Vaccine with code '${code}' not found.` });
    }

    res.json({
      success: true,
      vaccine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
