// Official Standard Vaccine Schedule Guidelines (WHO / IAP / ICMR Benchmark)

export const VACCINE_SCHEDULE_DEFINITIONS = [
  {
    id: 'birth',
    milestone: 'At Birth',
    ageInDays: 0,
    vaccines: [
      {
        code: 'BCG',
        name: 'Bacillus Calmette-Guérin',
        disease: 'Tuberculosis (TB)',
        dose: '0.05 ml',
        route: 'Intradermal',
        site: 'Left Upper Arm',
        mandatory: true,
        description: 'Provides critical immunity against severe pediatric tuberculosis and TB meningitis.'
      },
      {
        code: 'OPV-0',
        name: 'Oral Polio Vaccine Zero Dose',
        disease: 'Poliomyelitis (Polio)',
        dose: '2 Drops',
        route: 'Oral',
        site: 'Mouth',
        mandatory: true,
        description: 'First barrier protection against poliovirus strains.'
      },
      {
        code: 'HepB-0',
        name: 'Hepatitis B Birth Dose',
        disease: 'Hepatitis B Virus',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Anterolateral Thigh',
        mandatory: true,
        description: 'Prevents perinatal transmission of Hepatitis B from mother to newborn.'
      }
    ]
  },
  {
    id: '6weeks',
    milestone: '6 Weeks (1.5 Months)',
    ageInDays: 42,
    vaccines: [
      {
        code: 'DTwP-1 / DTaP-1',
        name: 'Diphtheria, Tetanus, Pertussis 1',
        disease: 'Diphtheria, Tetanus, Whooping Cough',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Anterolateral Thigh',
        mandatory: true,
        description: 'Primary dose against respiratory and nervous system bacterial toxins.'
      },
      {
        code: 'IPV-1',
        name: 'Inactivated Polio Vaccine 1',
        disease: 'Poliomyelitis',
        dose: '0.5 ml',
        route: 'Intramuscular / Subcutaneous',
        site: 'Thigh',
        mandatory: true,
        description: 'Injectable poliovirus protection.'
      },
      {
        code: 'Hib-1',
        name: 'Haemophilus Influenzae Type B 1',
        disease: 'Bacterial Meningitis & Pneumonia',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Prevents invasive Hib disease in young infants.'
      },
      {
        code: 'Rotavirus-1',
        name: 'Rotavirus Vaccine 1',
        disease: 'Severe Diarrheal Dehydration',
        dose: '5 Drops / 1.5 ml',
        route: 'Oral',
        site: 'Mouth',
        mandatory: true,
        description: 'Protects against leading cause of severe infant gastroenteritis.'
      },
      {
        code: 'PCV-1',
        name: 'Pneumococcal Conjugate Vaccine 1',
        disease: 'Pneumonia & Otitis Media',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Fights Streptococcus pneumoniae bacteria.'
      }
    ]
  },
  {
    id: '10weeks',
    milestone: '10 Weeks (2.5 Months)',
    ageInDays: 70,
    vaccines: [
      {
        code: 'DTwP-2',
        name: 'Diphtheria, Tetanus, Pertussis 2',
        disease: 'Diphtheria, Tetanus, Whooping Cough',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Second booster in primary Series.'
      },
      {
        code: 'IPV-2',
        name: 'Inactivated Polio Vaccine 2',
        disease: 'Polio',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Second IPV dose.'
      },
      {
        code: 'Hib-2',
        name: 'Hib Vaccine 2',
        disease: 'Meningitis & Pneumonia',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Second dose of Haemophilus influenzae protection.'
      },
      {
        code: 'Rotavirus-2',
        name: 'Rotavirus Vaccine 2',
        disease: 'Rotavirus Gastroenteritis',
        dose: 'Oral',
        site: 'Mouth',
        mandatory: true,
        description: 'Second oral dose for rotavirus immunity.'
      }
    ]
  },
  {
    id: '14weeks',
    milestone: '14 Weeks (3.5 Months)',
    ageInDays: 98,
    vaccines: [
      {
        code: 'DTwP-3',
        name: 'Diphtheria, Tetanus, Pertussis 3',
        disease: 'Diphtheria, Tetanus, Whooping Cough',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Third dose completing infant primary pentavalent/hexavalent series.'
      },
      {
        code: 'IPV-3',
        name: 'Inactivated Polio Vaccine 3',
        disease: 'Polio',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Third injectable polio dose.'
      },
      {
        code: 'PCV-3',
        name: 'Pneumococcal Conjugate Vaccine 3',
        disease: 'Pneumococcal Disease',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Completes primary series for invasive pneumococcal protection.'
      }
    ]
  },
  {
    id: '6months',
    milestone: '6 Months',
    ageInDays: 180,
    vaccines: [
      {
        code: 'HepB-3',
        name: 'Hepatitis B 3',
        disease: 'Hepatitis B',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Long-term viral hepatitis immunity.'
      },
      {
        code: 'Flu-1',
        name: 'Influenza Vaccine (Annual)',
        disease: 'Seasonal Flu Strain',
        dose: '0.25 ml / 0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh/Arm',
        mandatory: false,
        description: 'Recommended yearly flu protection for young children.'
      }
    ]
  },
  {
    id: '9months',
    milestone: '9 Months',
    ageInDays: 270,
    vaccines: [
      {
        code: 'MMR-1',
        name: 'Measles, Mumps, Rubella 1',
        disease: 'Measles, Epidemic Parotitis, German Measles',
        dose: '0.5 ml',
        route: 'Subcutaneous',
        site: 'Upper Arm',
        mandatory: true,
        description: 'Critical defense against highly contagious childhood viral rashes.'
      },
      {
        code: 'PCV Booster',
        name: 'Pneumococcal Booster',
        disease: 'Pneumococcal Infections',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Thigh',
        mandatory: true,
        description: 'Booster dose for durable antibody defense.'
      }
    ]
  },
  {
    id: '12months',
    milestone: '12 Months (1 Year)',
    ageInDays: 365,
    vaccines: [
      {
        code: 'HepA-1',
        name: 'Hepatitis A 1',
        disease: 'Hepatitis A Jaundice',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Deltoid Arm',
        mandatory: true,
        description: 'Protects liver against food & water-borne viral infection.'
      },
      {
        code: 'JE-1',
        name: 'Japanese Encephalitis 1 (Endemic Areas)',
        disease: 'Brain Infection Virus',
        dose: '0.5 ml',
        route: 'Subcutaneous',
        site: 'Upper Arm',
        mandatory: false,
        description: 'Prevents mosquito-borne encephalitis in designated zones.'
      }
    ]
  },
  {
    id: '15months',
    milestone: '15 Months',
    ageInDays: 455,
    vaccines: [
      {
        code: 'MMR-2',
        name: 'Measles, Mumps, Rubella 2',
        disease: 'Measles, Mumps, Rubella',
        dose: '0.5 ml',
        route: 'Subcutaneous',
        site: 'Upper Arm',
        mandatory: true,
        description: 'Second dose ensuring complete seroconversion.'
      },
      {
        code: 'Varicella-1',
        name: 'Chickenpox Vaccine 1',
        disease: 'Varicella Zoster Virus',
        dose: '0.5 ml',
        route: 'Subcutaneous',
        site: 'Upper Arm',
        mandatory: true,
        description: 'Prevents severe chickenpox rashes and complications.'
      }
    ]
  },
  {
    id: '18months',
    milestone: '18 Months (1.5 Years)',
    ageInDays: 540,
    vaccines: [
      {
        code: 'DTP Booster-1',
        name: 'Diphtheria, Tetanus, Pertussis First Booster',
        disease: 'Diphtheria, Tetanus, Pertussis',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Upper Arm / Thigh',
        mandatory: true,
        description: 'Booster shot to maintain toddler immunity.'
      },
      {
        code: 'IPV Booster',
        name: 'IPV Booster Dose',
        disease: 'Polio',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Arm',
        mandatory: true,
        description: 'Reinforces anti-poliovirus antibodies.'
      }
    ]
  },
  {
    id: '5years',
    milestone: '5 Years',
    ageInDays: 1825,
    vaccines: [
      {
        code: 'DTP Booster-2',
        name: 'DTP Second Booster',
        disease: 'Diphtheria, Tetanus, Pertussis',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Deltoid Arm',
        mandatory: true,
        description: 'Pre-school entry booster.'
      },
      {
        code: 'Typhoid Conjugate',
        name: 'Typhoid Fever Vaccine Booster',
        disease: 'Salmonella Typhi (Typhoid)',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Deltoid Arm',
        mandatory: true,
        description: 'Protects against enteric fever.'
      }
    ]
  },
  {
    id: '10years',
    milestone: '10 Years',
    ageInDays: 3650,
    vaccines: [
      {
        code: 'Tdap / Td',
        name: 'Tetanus & Low Dose Diphtheria / Acellular Pertussis',
        disease: 'Tetanus, Diphtheria, Pertussis',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Deltoid Arm',
        mandatory: true,
        description: 'Adolescent booster shot.'
      },
      {
        code: 'HPV (Girls)',
        name: 'Human Papillomavirus Vaccine (2 Doses)',
        disease: 'Cervical & HPV-related Cancers',
        dose: '0.5 ml',
        route: 'Intramuscular',
        site: 'Deltoid Arm',
        mandatory: true,
        description: 'Prevents HPV strain infection linked to oncogenesis.'
      }
    ]
  }
];
