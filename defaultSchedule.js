/**
 * Standard Universal Immunization Program (UIP) & WHO Recommended Pediatric Vaccine Schedule
 * Offsets are measured in days/weeks from Date of Birth.
 */
export const DEFAULT_VACCINE_SCHEDULE = [
  {
    code: 'BCG',
    name: 'BCG (Bacillus Calmette-Guérin)',
    targetDisease: 'Tuberculosis (TB)',
    dose: 'Dose 1 (Birth Dose)',
    offsetWeeks: 0,
    ageLabel: 'At Birth',
    route: 'Intradermal (Left Upper Arm)',
    mandatory: true,
    description: 'Protects against severe forms of childhood tuberculosis including tubercular meningitis.'
  },
  {
    code: 'OPV-0',
    name: 'OPV 0 (Oral Polio Vaccine)',
    targetDisease: 'Poliomyelitis (Polio)',
    dose: 'Birth Dose',
    offsetWeeks: 0,
    ageLabel: 'At Birth',
    route: 'Oral (2 drops)',
    mandatory: true,
    description: 'Initial dose of oral polio drops administered immediately after delivery.'
  },
  {
    code: 'HepB-0',
    name: 'Hepatitis B (Birth Dose)',
    targetDisease: 'Hepatitis B Virus',
    dose: 'Birth Dose',
    offsetWeeks: 0,
    ageLabel: 'At Birth (within 24 hrs)',
    route: 'Intramuscular (Anterolateral Thigh)',
    mandatory: true,
    description: 'Must be administered within 24 hours of birth to prevent perinatal transmission.'
  },
  {
    code: 'PENTA-1',
    name: 'Pentavalent 1 (DTP-HepB-Hib)',
    targetDisease: 'Diphtheria, Tetanus, Pertussis, Hep B, Hib',
    dose: 'Dose 1',
    offsetWeeks: 6,
    ageLabel: '6 Weeks',
    route: 'Intramuscular (Mid-Thigh)',
    mandatory: true,
    description: '5-in-1 combination vaccine providing protection against 5 life-threatening childhood diseases.'
  },
  {
    code: 'OPV-1',
    name: 'OPV 1 (Oral Polio Vaccine)',
    targetDisease: 'Poliomyelitis (Polio)',
    dose: 'Dose 1',
    offsetWeeks: 6,
    ageLabel: '6 Weeks',
    route: 'Oral (2 drops)',
    mandatory: true,
    description: 'First scheduled childhood oral polio dose.'
  },
  {
    code: 'ROTA-1',
    name: 'Rotavirus Vaccine 1 (RV)',
    targetDisease: 'Rotavirus Diarrhea & Dehydration',
    dose: 'Dose 1',
    offsetWeeks: 6,
    ageLabel: '6 Weeks',
    route: 'Oral (5 drops / oral liquid)',
    mandatory: true,
    description: 'Protects against severe acute dehydrating diarrhea caused by rotavirus.'
  },
  {
    code: 'PCV-1',
    name: 'Pneumococcal Conjugate Vaccine 1 (PCV)',
    targetDisease: 'Pneumococcal Pneumonia & Meningitis',
    dose: 'Dose 1',
    offsetWeeks: 6,
    ageLabel: '6 Weeks',
    route: 'Intramuscular',
    mandatory: true,
    description: 'Protects infants against invasive pneumococcal infections and bacteremia.'
  },
  {
    code: 'PENTA-2',
    name: 'Pentavalent 2 (DTP-HepB-Hib)',
    targetDisease: 'Diphtheria, Tetanus, Pertussis, Hep B, Hib',
    dose: 'Dose 2',
    offsetWeeks: 10,
    ageLabel: '10 Weeks',
    route: 'Intramuscular (Mid-Thigh)',
    mandatory: true,
    description: 'Second dose of the 5-in-1 combo vaccine.'
  },
  {
    code: 'OPV-2',
    name: 'OPV 2 (Oral Polio Vaccine)',
    targetDisease: 'Poliomyelitis (Polio)',
    dose: 'Dose 2',
    offsetWeeks: 10,
    ageLabel: '10 Weeks',
    route: 'Oral (2 drops)',
    mandatory: true,
    description: 'Second scheduled childhood oral polio dose.'
  },
  {
    code: 'ROTA-2',
    name: 'Rotavirus Vaccine 2 (RV)',
    targetDisease: 'Rotavirus Diarrhea',
    dose: 'Dose 2',
    offsetWeeks: 10,
    ageLabel: '10 Weeks',
    route: 'Oral (5 drops)',
    mandatory: true,
    description: 'Second dose for building gastrointestinal immunity against rotavirus.'
  },
  {
    code: 'PENTA-3',
    name: 'Pentavalent 3 (DTP-HepB-Hib)',
    targetDisease: 'Diphtheria, Tetanus, Pertussis, Hep B, Hib',
    dose: 'Dose 3',
    offsetWeeks: 14,
    ageLabel: '14 Weeks',
    route: 'Intramuscular (Mid-Thigh)',
    mandatory: true,
    description: 'Third and primary completing dose of the Pentavalent vaccine series.'
  },
  {
    code: 'OPV-3',
    name: 'OPV 3 & fIPV (Fractional IPV)',
    targetDisease: 'Poliomyelitis',
    dose: 'Dose 3',
    offsetWeeks: 14,
    ageLabel: '14 Weeks',
    route: 'Oral + Intradermal',
    mandatory: true,
    description: 'Combined OPV oral drops and fractional Inactivated Polio Vaccine injection.'
  },
  {
    code: 'ROTA-3',
    name: 'Rotavirus Vaccine 3 (RV)',
    targetDisease: 'Rotavirus Diarrhea',
    dose: 'Dose 3',
    offsetWeeks: 14,
    ageLabel: '14 Weeks',
    route: 'Oral',
    mandatory: true,
    description: 'Final primary dose of oral rotavirus immunization.'
  },
  {
    code: 'PCV-2',
    name: 'Pneumococcal Conjugate Vaccine 2 (PCV)',
    targetDisease: 'Pneumococcal Pneumonia',
    dose: 'Dose 2',
    offsetWeeks: 14,
    ageLabel: '14 Weeks',
    route: 'Intramuscular',
    mandatory: true,
    description: 'Second dose of pneumococcal immunization.'
  },
  {
    code: 'MR-1',
    name: 'MR 1 (Measles & Rubella) + Vit A',
    targetDisease: 'Measles, Congenital Rubella, Vit A Deficiency',
    dose: 'Dose 1',
    offsetWeeks: 39, // approx 9 months
    ageLabel: '9 - 12 Months',
    route: 'Subcutaneous (Right Arm) + Oral',
    mandatory: true,
    description: 'Prevents severe measles epidemics and congenital rubella syndrome, plus 100,000 IU Vit A oral dose.'
  },
  {
    code: 'PCV-BOOST',
    name: 'PCV Booster',
    targetDisease: 'Pneumococcal Infections',
    dose: 'Booster Dose',
    offsetWeeks: 39,
    ageLabel: '9 Months',
    route: 'Intramuscular',
    mandatory: true,
    description: 'Booster dose providing long-lasting antibody titers against Streptococcus pneumoniae.'
  },
  {
    code: 'MR-2',
    name: 'MR 2 (Measles & Rubella Booster)',
    targetDisease: 'Measles, Rubella',
    dose: 'Dose 2 / Booster',
    offsetWeeks: 68, // approx 16-24 months
    ageLabel: '16 - 24 Months',
    route: 'Subcutaneous (Right Arm)',
    mandatory: true,
    description: 'Second dose of Measles-Rubella vaccine to ensure lifelong immunity.'
  },
  {
    code: 'DPT-B1',
    name: 'DPT Booster 1 + OPV Booster',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Polio',
    dose: 'Booster 1',
    offsetWeeks: 68,
    ageLabel: '16 - 24 Months',
    route: 'Intramuscular + Oral drops',
    mandatory: true,
    description: 'Toddler booster reinforcing memory cells against whooping cough, tetanus, and diphtheria.'
  },
  {
    code: 'DPT-B2',
    name: 'DPT Booster 2',
    targetDisease: 'Diphtheria, Pertussis, Tetanus',
    dose: 'Booster 2',
    offsetWeeks: 260, // 5-6 years
    ageLabel: '5 - 6 Years',
    route: 'Intramuscular (Left Upper Arm)',
    mandatory: true,
    description: 'School entry booster dose protecting children through early school years.'
  },
  {
    code: 'TD-10',
    name: 'Td (Tetanus & adult Diphtheria)',
    targetDisease: 'Tetanus, Diphtheria',
    dose: 'Adolescent Dose 1',
    offsetWeeks: 520, // 10 years
    ageLabel: '10 Years',
    route: 'Intramuscular',
    mandatory: true,
    description: 'Adolescent tetanus and adult diphtheria booster.'
  },
  {
    code: 'TD-16',
    name: 'Td (Tetanus & adult Diphtheria)',
    targetDisease: 'Tetanus, Diphtheria',
    dose: 'Adolescent Dose 2',
    offsetWeeks: 832, // 16 years
    ageLabel: '16 Years',
    route: 'Intramuscular',
    mandatory: true,
    description: 'Secondary adolescent tetanus and diphtheria booster.'
  }
];
