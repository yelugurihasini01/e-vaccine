// Clinical Pediatric Hydration & Post-Vaccination Recovery Dataset
// Based on WHO, Indian Academy of Pediatrics (IAP), and AAP Clinical Guidelines

/**
 * Calculates daily maintenance fluid requirements using the Holliday-Segar formula:
 * - 0 to 10 kg: 100 mL/kg/day
 * - 11 to 20 kg: 1000 mL + 50 mL/kg for each kg over 10 kg
 * - > 20 kg: 1500 mL + 20 mL/kg for each kg over 20 kg
 */
export function calculateHollidaySegar(weightKg) {
  const w = parseFloat(weightKg);
  if (isNaN(w) || w <= 0) return { dailyMl: 0, hourlyMl: 0, cups: 0, guidance: 'Please enter a valid weight.' };

  let dailyMl = 0;
  if (w <= 10) {
    dailyMl = w * 100;
  } else if (w <= 20) {
    dailyMl = 1000 + (w - 10) * 50;
  } else {
    dailyMl = 1500 + (w - 20) * 20;
  }

  // Cap at normal adult max 2500 ml unless indicated
  dailyMl = Math.min(Math.round(dailyMl), 2600);
  const hourlyMl = Math.round(dailyMl / 24);
  const cups = (dailyMl / 180).toFixed(1); // Standard 180ml pediatric feeding cup

  let guidance = '';
  if (w < 6) {
    guidance = 'Exclusive breastfeeding or formula feeding on demand. Clean water is not recommended for infants under 6 months unless prescribed.';
  } else if (w <= 12) {
    guidance = 'Complementary feeding age: Offer small, frequent sips of boiled, cooled water alongside breastmilk and fruit purées.';
  } else {
    guidance = 'Active toddler stage: Offer clean water, tender coconut water, or fresh diluted juices throughout the day.';
  }

  return { dailyMl, hourlyMl, cups, guidance };
}

export const AGE_HYDRATION_BENCHMARKS = [
  {
    ageGroup: '0 - 6 Months (Infants)',
    averageWeight: '3 - 7 kg',
    recommendedFluid: '700 - 800 mL / day',
    source: 'Exclusive Breastmilk / Infant Formula only',
    waterAdvice: 'Do NOT give plain water before 6 months. Frequent nursing provides 88% water and all essential antibodies.',
    postVaxTip: 'Nurse frequently for comfort and immune hydration during post-shot fussiness.'
  },
  {
    ageGroup: '6 - 12 Months (Older Infants)',
    averageWeight: '7 - 10 kg',
    recommendedFluid: '800 - 1000 mL / day',
    source: 'Breastmilk + 120-240 mL Boiled Cool Water',
    waterAdvice: 'Introduce 120-240 mL of clean, boiled and cooled water in an open cup with meals.',
    postVaxTip: 'Offer a few sips of water after every feed to flush oral cavity and soothe fever.'
  },
  {
    ageGroup: '1 - 3 Years (Toddlers)',
    averageWeight: '10 - 15 kg',
    recommendedFluid: '1100 - 1300 mL / day (~4-5 cups)',
    source: 'Water, Milk, Clear Broths, Diluted Fresh Juices',
    waterAdvice: 'Encourage drinking water before outdoor play and consistently post-vaccination.',
    postVaxTip: 'Hydrate with room-temperature water or homemade ORS if a low-grade fever occurs.'
  },
  {
    ageGroup: '4 - 8 Years (Young Children)',
    averageWeight: '15 - 25 kg',
    recommendedFluid: '1400 - 1700 mL / day (~5-7 cups)',
    source: 'Plain Clean Water, Electrolytes, Soups',
    waterAdvice: 'Ensure child carries a refillable water bottle to school and clinic appointments.',
    postVaxTip: 'Extra water consumption helps lymph nodes circulate vaccine-generated antibodies efficiently.'
  }
];

export const POST_VAX_24HR_TIMELINE = [
  {
    hourRange: 'Hour 0 - 2 (Immediate Post-Shot)',
    focus: 'Comfort & Calming',
    hydrationAction: 'Offer a feeding or a drink of water within 15 minutes of injection to relieve stress-induced dry mouth.',
    careAction: 'Hold child securely. Check injection site for bleeding. Do not massage the injection area.',
    status: 'Crucial'
  },
  {
    hourRange: 'Hour 3 - 6 (Early Immune Response)',
    focus: 'Temperature & Lymphatic Flow',
    hydrationAction: 'Ensure child sips 50-100 mL fluids every hour. Proper hydration cushions against sudden fever spikes.',
    careAction: 'Apply a clean, cool damp cloth if injection site feels warm or tender.',
    status: 'Monitor'
  },
  {
    hourRange: 'Hour 7 - 12 (Peak Immune Induction)',
    focus: 'Fever & Rest Management',
    hydrationAction: 'Keep a water cup or feeding bottle bedside. If fever develops, fluid loss through sweating increases.',
    careAction: 'Dress child in light, breathable cotton clothes. Administer pediatric drops only if pediatrician advised.',
    status: 'Rest'
  },
  {
    hourRange: 'Hour 13 - 24 (Stabilization)',
    focus: 'Recovery & Nourishment',
    hydrationAction: 'Return to normal fluid intake schedule. Check for regular wet diapers (at least 4-6 wet diapers in 24 hrs).',
    careAction: 'Gentle, quiet play. Most soreness and irritability resolves completely by 24-48 hours.',
    status: 'Recovery'
  }
];

export const DEHYDRATION_SYMPTOM_TRIAGE = [
  {
    sign: 'Normal Post-Vaccine Reaction',
    symptoms: [
      'Low-grade fever (< 38.5°C / 101.3°F)',
      'Mild soreness or redness at injection site',
      'Sleepier than usual for first 12-24 hours',
      'Mild crankiness soothed by cuddling and water'
    ],
    action: 'Continue frequent fluids, cool cloth on injection site, lots of rest. Normal recovery in 24-48 hours.',
    severity: 'normal'
  },
  {
    sign: 'Mild Dehydration Warning',
    symptoms: [
      'Fewer wet diapers (dry for > 6 hours)',
      'Dry mouth, cracked lips, or sticky saliva',
      'Dark yellow, strong-smelling urine',
      'Crying with fewer tears than usual'
    ],
    action: 'Immediately increase fluid intake (ORS, breastmilk, water). Re-check urine output in 3 hours.',
    severity: 'warning'
  },
  {
    sign: 'Urgent Pediatric Red Flag',
    symptoms: [
      'Sunken soft spot (fontanelle) on baby\'s head',
      'High persistent fever (> 39°C / 102.2°F)',
      'Severe lethargy or difficulty waking up',
      'Continuous inconsolable crying for > 3 hours'
    ],
    action: 'Contact your pediatrician or visit the nearest pediatric emergency clinic immediately.',
    severity: 'critical'
  }
];
