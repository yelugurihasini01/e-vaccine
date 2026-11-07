// Official Universal Immunization Programme (UIP) - Ministry of Health and Family Welfare (MoHFW), Govt. of India

export const UIP_INDIA_VACCINES = [
  // --- AT BIRTH ---
  {
    code: 'BCG',
    name: 'Bacillus Calmette-Guérin',
    hindiName: 'बीसीजी (तपेदिक / टीबी से बचाव)',
    diseasePrevented: 'Childhood Tuberculosis (TB) & TB Meningitis',
    milestoneCategory: 'At Birth',
    ageInDaysFromBirth: 0,
    standardDose: '0.05 ml (until 1 month); 0.1 ml thereafter',
    route: 'Intradermal',
    site: 'Left upper arm',
    isMandatory: true,
    description: 'Vital live-attenuated vaccine guarding against severe pediatric tuberculosis and tubercular meningitis.'
  },
  {
    code: 'OPV-0',
    name: 'Oral Polio Vaccine (Zero Dose)',
    hindiName: 'ओ.पी.वी. शून्य खुराक (पोलियो)',
    diseasePrevented: 'Poliomyelitis (Infantile Paralysis)',
    milestoneCategory: 'At Birth',
    ageInDaysFromBirth: 0,
    standardDose: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'First mucosal defense given within the first 14 days of birth to establish gut immunity.'
  },
  {
    code: 'HepB-0',
    name: 'Hepatitis B (Birth Dose)',
    hindiName: 'हेपेटाइटिस बी जन्म खुराक (पीलिया)',
    diseasePrevented: 'Perinatal Hepatitis B Virus Infection & Chronic Liver Disease',
    milestoneCategory: 'At Birth',
    ageInDaysFromBirth: 0,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh',
    isMandatory: true,
    description: 'Administered within 24 hours of birth to block mother-to-child transmission.'
  },

  // --- 6 WEEKS ---
  {
    code: 'PENTAVALENT-1',
    name: 'Pentavalent Vaccine Dose 1',
    hindiName: 'पेंटावेलेंट १ (गलघोंटू, काली खांसी, टिटनेस, हेपेटाइटिस बी, हिब)',
    diseasePrevented: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, and Hib pneumonia/meningitis',
    milestoneCategory: '6 Weeks',
    ageInDaysFromBirth: 42,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Left)',
    isMandatory: true,
    description: 'Single combination 5-in-1 formulation replacing individual shots.'
  },
  {
    code: 'OPV-1',
    name: 'Oral Polio Vaccine Dose 1',
    hindiName: 'ओ.पी.वी. खुराक १',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '6 Weeks',
    ageInDaysFromBirth: 42,
    standardDose: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Primary oral poliovirus booster.'
  },
  {
    code: 'ROTA-1',
    name: 'Rotavirus Vaccine Dose 1',
    hindiName: 'रोटावायरस खुराक १ (गंभीर दस्त)',
    diseasePrevented: 'Severe Rotavirus Diarrhea and Dehydration',
    milestoneCategory: '6 Weeks',
    ageInDaysFromBirth: 42,
    standardDose: '5 drops / 2.5 ml',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Guards against the leading cause of lethal watery diarrhea in infants.'
  },
  {
    code: 'FIPV-1',
    name: 'Fractional Inactivated Polio Vaccine 1',
    hindiName: 'एफ.आई.पी.वी. खुराक १',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '6 Weeks',
    ageInDaysFromBirth: 42,
    standardDose: '0.1 ml (Fractional)',
    route: 'Intradermal',
    site: 'Right upper arm',
    isMandatory: true,
    description: 'Injectable poliovirus vaccine giving systemic circulating humoral immunity.'
  },
  {
    code: 'PCV-1',
    name: 'Pneumococcal Conjugate Vaccine Dose 1',
    hindiName: 'पी.सी.वी. खुराक १ (न्यूमोनिया व दिमागी बुखार)',
    diseasePrevented: 'Streptococcus pneumoniae (Severe Pneumonia, Bacteremia, Sepsis)',
    milestoneCategory: '6 Weeks',
    ageInDaysFromBirth: 42,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Right)',
    isMandatory: true,
    description: 'Essential respiratory defense introduced across all Indian states under UIP.'
  },

  // --- 10 WEEKS ---
  {
    code: 'PENTAVALENT-2',
    name: 'Pentavalent Vaccine Dose 2',
    hindiName: 'पेंटावेलेंट २',
    diseasePrevented: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    milestoneCategory: '10 Weeks',
    ageInDaysFromBirth: 70,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Left)',
    isMandatory: true,
    description: 'Second primary priming dose for 5 critical childhood infections.'
  },
  {
    code: 'OPV-2',
    name: 'Oral Polio Vaccine Dose 2',
    hindiName: 'ओ.पी.वी. खुराक २',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '10 Weeks',
    ageInDaysFromBirth: 70,
    standardDose: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Second mucosal polio immunization.'
  },
  {
    code: 'ROTA-2',
    name: 'Rotavirus Vaccine Dose 2',
    hindiName: 'रोटावायरस खुराक २',
    diseasePrevented: 'Rotavirus Gastroenteritis',
    milestoneCategory: '10 Weeks',
    ageInDaysFromBirth: 70,
    standardDose: '5 drops / 2.5 ml',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Second dose reinforcing intestinal antibody titers.'
  },

  // --- 14 WEEKS ---
  {
    code: 'PENTAVALENT-3',
    name: 'Pentavalent Vaccine Dose 3',
    hindiName: 'पेंटावेलेंट ३',
    diseasePrevented: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    milestoneCategory: '14 Weeks',
    ageInDaysFromBirth: 98,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Left)',
    isMandatory: true,
    description: 'Completes primary infancy immunization series.'
  },
  {
    code: 'OPV-3',
    name: 'Oral Polio Vaccine Dose 3',
    hindiName: 'ओ.पी.वी. खुराक ३',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '14 Weeks',
    ageInDaysFromBirth: 98,
    standardDose: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Third oral poliovirus protection.'
  },
  {
    code: 'ROTA-3',
    name: 'Rotavirus Vaccine Dose 3',
    hindiName: 'रोटावायरस खुराक ३',
    diseasePrevented: 'Rotavirus Gastroenteritis',
    milestoneCategory: '14 Weeks',
    ageInDaysFromBirth: 98,
    standardDose: '5 drops / 2.5 ml',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Completes the oral rotavirus protection schedule.'
  },
  {
    code: 'FIPV-2',
    name: 'Fractional Inactivated Polio Vaccine 2',
    hindiName: 'एफ.आई.पी.वी. खुराक २',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '14 Weeks',
    ageInDaysFromBirth: 98,
    standardDose: '0.1 ml (Fractional)',
    route: 'Intradermal',
    site: 'Right upper arm',
    isMandatory: true,
    description: 'Second dose of IPV.'
  },
  {
    code: 'PCV-2',
    name: 'Pneumococcal Conjugate Vaccine Dose 2',
    hindiName: 'पी.सी.वी. खुराक २',
    diseasePrevented: 'Pneumococcal Pneumonia & Sepsis',
    milestoneCategory: '14 Weeks',
    ageInDaysFromBirth: 98,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Right)',
    isMandatory: true,
    description: 'Second dose of pneumococcal conjugate.'
  },

  // --- 9-12 MONTHS ---
  {
    code: 'MR-1',
    name: 'Measles & Rubella Vaccine Dose 1',
    hindiName: 'एम.आर. खुराक १ (खसरा व रूबेला)',
    diseasePrevented: 'Measles and Congenital Rubella Syndrome (CRS)',
    milestoneCategory: '9-12 Months',
    ageInDaysFromBirth: 270,
    standardDose: '0.5 ml',
    route: 'Subcutaneous',
    site: 'Right upper arm',
    isMandatory: true,
    description: 'First dose targeting national elimination of measles and rubella in India.'
  },
  {
    code: 'PCV-BOOSTER',
    name: 'PCV Booster Dose',
    hindiName: 'पी.सी.वी. बूस्टर खुराक',
    diseasePrevented: 'Pneumococcal Pneumonia',
    milestoneCategory: '9-12 Months',
    ageInDaysFromBirth: 270,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Right)',
    isMandatory: true,
    description: 'Critical booster providing long-term antibody memory.'
  },
  {
    code: 'VIT-A-1',
    name: 'Vitamin A First Dose (1 Lakh IU)',
    hindiName: 'विटामिन ए पहली खुराक (रतौंधी से बचाव)',
    diseasePrevented: 'Night Blindness & Nutritional Blindness',
    milestoneCategory: '9-12 Months',
    ageInDaysFromBirth: 270,
    standardDose: '1 ml (1,00,000 IU)',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Administered simultaneously with MR-1 to support epithelial integrity and immunity.'
  },

  // --- 16-24 MONTHS ---
  {
    code: 'MR-2',
    name: 'Measles & Rubella Vaccine Dose 2',
    hindiName: 'एम.आर. खुराक २',
    diseasePrevented: 'Measles & Rubella',
    milestoneCategory: '16-24 Months',
    ageInDaysFromBirth: 480,
    standardDose: '0.5 ml',
    route: 'Subcutaneous',
    site: 'Right upper arm',
    isMandatory: true,
    description: 'Second dose ensuring complete seroconversion.'
  },
  {
    code: 'DPT-BOOSTER-1',
    name: 'DPT Booster Dose 1',
    hindiName: 'डी.पी.टी. बूस्टर खुराक १ (गलघोंटू, काली खांसी, टिटनेस)',
    diseasePrevented: 'Diphtheria, Pertussis, Tetanus',
    milestoneCategory: '16-24 Months',
    ageInDaysFromBirth: 480,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh (Left)',
    isMandatory: true,
    description: 'Reinforces waning pertussis and diphtheria antibodies.'
  },
  {
    code: 'OPV-BOOSTER',
    name: 'Oral Polio Vaccine Booster',
    hindiName: 'ओ.पी.वी. बूस्टर खुराक',
    diseasePrevented: 'Poliomyelitis',
    milestoneCategory: '16-24 Months',
    ageInDaysFromBirth: 480,
    standardDose: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    isMandatory: true,
    description: 'Boosts mucosal immunity during toddlerhood.'
  },

  // --- 5-6 YEARS ---
  {
    code: 'DPT-BOOSTER-2',
    name: 'DPT Booster Dose 2',
    hindiName: 'डी.पी.टी. बूस्टर खुराक २',
    diseasePrevented: 'Diphtheria, Pertussis, Tetanus',
    milestoneCategory: '5-6 Years',
    ageInDaysFromBirth: 1825,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Left upper arm (deltoid)',
    isMandatory: true,
    description: 'School-entry booster ensuring defense through elementary school years.'
  },

  // --- 10 & 16 YEARS ---
  {
    code: 'TD-10Y',
    name: 'Tetanus & Adult Diphtheria (Td) at 10 Years',
    hindiName: 'टी.डी. १० वर्ष (टिटनेस व डिप्थीरिया)',
    diseasePrevented: 'Tetanus & Diphtheria in Adolescents',
    milestoneCategory: '10 Years',
    ageInDaysFromBirth: 3650,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Upper arm (deltoid)',
    isMandatory: true,
    description: 'Replaced plain TT with Td to maintain adult diphtheria herd immunity.'
  },
  {
    code: 'TD-16Y',
    name: 'Tetanus & Adult Diphtheria (Td) at 16 Years',
    hindiName: 'टी.डी. १६ वर्ष',
    diseasePrevented: 'Tetanus & Diphtheria',
    milestoneCategory: '16 Years',
    ageInDaysFromBirth: 5840,
    standardDose: '0.5 ml',
    route: 'Intramuscular',
    site: 'Upper arm (deltoid)',
    isMandatory: true,
    description: 'Senior school / adolescent booster providing durable adult protection.'
  }
];
