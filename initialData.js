// Preloaded Sample Data for VaxAlert Pro eVaccine WhatsApp & Email Reminder Platform

export const PUBLIC_HEALTH_QUOTES = [
  {
    id: 1,
    category: 'Immunity & Protection',
    quote: "Vaccines bring us closer to a world where no child dies of a vaccine-preventable disease.",
    author: "World Health Organization (WHO)"
  },
  {
    id: 2,
    category: 'Hydration & Post-Care',
    quote: "Keeping your child well-hydrated before and after vaccination supports smooth lymphatic circulation and aids optimal antibody production.",
    author: "Pediatric Wellness Advisory"
  },
  {
    id: 3,
    category: 'Parental Love',
    quote: "Timely vaccination is the greatest gift of lifelong protection a parent can give to their child.",
    author: "Dr. Soumya Swaminathan, Former Chief Scientist (WHO)"
  },
  {
    id: 4,
    category: 'Global Health',
    quote: "Immunization is a global health and development success story, saving millions of lives every single year.",
    author: "UNICEF Child Survival Report"
  },
  {
    id: 5,
    category: 'Hydration & Post-Care',
    quote: "Offer plenty of fluids—breastmilk, clean water, or electrolyte solutions—after vaccine doses to keep body temperature stable and soothe post-shot fussiness.",
    author: "Indian Academy of Pediatrics (IAP) Parent Care Guide"
  },
  {
    id: 6,
    category: 'Community Defense',
    quote: "Every vaccine shot given on time shields an entire community from dangerous preventable outbreaks.",
    author: "Global Vaccine Alliance (GAVI)"
  },
  {
    id: 7,
    category: 'Immunity & Protection',
    quote: "Vaccines act as training grounds for the immune system, teaching body cells to neutralize pathogens before harm occurs.",
    author: "Center for Disease Control (CDC)"
  },
  {
    id: 8,
    category: 'Hydration & Post-Care',
    quote: "Water is the essential medium for immune cell transport. Ensure adequate infant hydration post-immunization.",
    author: "Clinical Nutrition & Immunology Quarterly"
  },
  {
    id: 9,
    category: 'Parental Care',
    quote: "A gentle touch, a warm cuddle, and a refreshing drink of water turn post-vaccine fever into quick comfort.",
    author: "Pediatric Nursing Care Standards"
  },
  {
    id: 10,
    category: 'Immunity & Protection',
    quote: "Small drops of oral polio vaccine and timely immunizations pave the road to a polio-free future.",
    author: "National Immunization Program"
  }
];

export const PREDEFINED_TEMPLATES = {
  whatsapp: [
    {
      id: 'wa-standard',
      title: 'Standard 7-Day Upcoming Reminder',
      category: 'Upcoming',
      template: `✨ *IMMUNIZATION REMINDER — {clinicName}*

Dear *{parentName}*,

This is a friendly reminder that *{childName}* has an upcoming vaccination scheduled.

💉 *Vaccine:* {vaccineName}
📅 *Date Due:* {dueDate}
📍 *Clinic:* {clinicName}
👩‍⚕️ *Doctor:* {doctorName}

💧 *Parenting & Hydration Tip:* Keep {childName} comfortably hydrated with fluids or milk on vaccine day to aid smooth post-shot recovery!

Reply *CONFIRM* to lock in your appointment time.`
    },
    {
      id: 'wa-overdue',
      title: 'Urgent Overdue Alert (WhatsApp)',
      category: 'Overdue',
      template: `🚨 *URGENT VAX ALERT — {clinicName}*

Dear *{parentName}*,

Our records indicate that *{childName}*'s essential immunization is currently **OVERDUE**.

💉 *Overdue Vaccine:* {vaccineName}
📅 *Original Target Date:* {dueDate} (OVERDUE)
📍 *Clinic:* {clinicName}

Protecting {childName} on schedule is critical for disease immunity. Please reply or call us immediately to reschedule today!`
    },
    {
      id: 'wa-postcare',
      title: 'Post-Vaccine Hydration & Comfort Guide',
      category: 'Post-Care',
      template: `💧 *POST-VACCINE CARE GUIDE — {clinicName}*

Dear *{parentName}*,

Thank you for bringing *{childName}* for their vaccination! Here are quick care tips for the next 24-48 hours:

1️⃣ *Hydration:* Offer extra water/fluids or frequent nursing to support immune recovery.
2️⃣ *Mild Fever:* A mild fever is a normal sign the body is building antibodies. Use prescribed pediatric drops if needed.
3️⃣ *Cool Compress:* Apply a damp cool cloth gently over the thigh/arm injection site.

Wishing {childName} a speedy, comfortable day! ❤️`
    }
  ],
  email: [
    {
      id: 'email-standard',
      title: 'Official Immunization Schedule Notice',
      subject: 'Immunization Schedule Reminder for {childName} - {clinicName}',
      category: 'Upcoming',
      template: `Dear {parentName},

We hope this email finds you and your family in good health.

This is an automated notification from {clinicName} regarding the upcoming vaccine milestone for {childName}.

PATIENT DETAILS:
----------------------------------------------
Child Name: {childName}
Parent/Guardian: {parentName}
Vaccine Due: {vaccineName}
Target Date: {dueDate}
Attending Physician: {doctorName}
Clinic Location: {clinicName}

CLINICAL & HYDRATION GUIDELINES:
----------------------------------------------
• Please bring {childName}'s official Immunization Passport booklet.
• Ensure {childName} is well-hydrated prior to the appointment. Adequate fluid intake supports cellular immune response and prevents mild post-vaccine fatigue.

If you need to reschedule your appointment, please contact us by replying to this email or calling our pediatric desk directly.

Warm regards,
Pediatric Care Team
{clinicName}`
    },
    {
      id: 'email-overdue',
      title: 'Action Required: Overdue Vaccine Notice',
      subject: 'URGENT: Overdue Immunization Alert for {childName}',
      category: 'Overdue',
      template: `URGENT MEDICAL NOTICE: OVERDUE VACCINATION

Dear {parentName},

Our digital clinical registry indicates that {childName} (DOB: {dob}) has an overdue immunization milestone.

OVERDUE DETAILS:
----------------------------------------------
Vaccine Required: {vaccineName}
Target Date: {dueDate}
Current Status: OVERDUE
Clinic: {clinicName}

WHY TIMELY VACCINATIONS MATTER:
Sticking strictly to the recommended immunization schedule ensures uninterrupted antibody defense against severe preventable bacterial and viral pathogens.

NEXT STEPS:
Please call our pediatric appointment line immediately or visit {clinicName} at your earliest convenience to administer this pending dose.

Best regards,
Department of Infant Health & Immunization
{clinicName}`
    }
  ]
};

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-8801',
    childName: 'Aarav Sharma',
    gender: 'Male',
    dob: '2026-06-20',
    bloodGroup: 'O+',
    parentName: 'Ramesh Sharma',
    parentRelation: 'Father',
    phone: '+91 98765 43210',
    email: 'ramesh.sharma@example.com',
    address: 'Flat 402, Green Valley Apartments, Cyber City, Hyderabad',
    clinicName: 'Sunrise Pediatric & Care Hospital',
    doctorName: 'Dr. Priya V. Nambiar',
    regDate: '2026-06-21',
    notes: 'Mild milk lactose sensitivity. All birth vaccines administered smoothly.',
    customVaccineStatus: {
      'BCG': { status: 'Completed', dateAdministered: '2026-06-21', batchNo: 'BCG-2026-90A', clinic: 'Sunrise Pediatric' },
      'OPV-0': { status: 'Completed', dateAdministered: '2026-06-21', batchNo: 'OPV-881', clinic: 'Sunrise Pediatric' },
      'HepB-0': { status: 'Completed', dateAdministered: '2026-06-21', batchNo: 'HB-7712', clinic: 'Sunrise Pediatric' },
      'DTwP-1 / DTaP-1': { status: 'Overdue', dueDate: '2026-08-01', notes: 'Pending parent confirmation' },
      'IPV-1': { status: 'Scheduled', dueDate: '2026-08-12' },
      'Hib-1': { status: 'Scheduled', dueDate: '2026-08-12' },
      'Rotavirus-1': { status: 'Scheduled', dueDate: '2026-08-12' },
      'PCV-1': { status: 'Scheduled', dueDate: '2026-08-12' }
    }
  },
  {
    id: 'PAT-8802',
    childName: 'Ananya Verma',
    gender: 'Female',
    dob: '2025-11-15',
    bloodGroup: 'B+',
    parentName: 'Meera Verma',
    parentRelation: 'Mother',
    phone: '+91 91234 56789',
    email: 'meera.verma@example.com',
    address: 'House No 89, Sector 14, Gurgaon, Delhi NCR',
    clinicName: 'Max Healthcare Child Wellness',
    doctorName: 'Dr. Rajesh Gupta',
    regDate: '2025-11-16',
    notes: 'No known drug allergies. Up to date on all primary infant series.',
    customVaccineStatus: {
      'BCG': { status: 'Completed', dateAdministered: '2025-11-16', batchNo: 'BCG-8812' },
      'OPV-0': { status: 'Completed', dateAdministered: '2025-11-16' },
      'HepB-0': { status: 'Completed', dateAdministered: '2025-11-16' },
      'DTwP-1 / DTaP-1': { status: 'Completed', dateAdministered: '2025-12-28' },
      'IPV-1': { status: 'Completed', dateAdministered: '2025-12-28' },
      'Hib-1': { status: 'Completed', dateAdministered: '2025-12-28' },
      'Rotavirus-1': { status: 'Completed', dateAdministered: '2025-12-28' },
      'PCV-1': { status: 'Completed', dateAdministered: '2025-12-28' },
      'DTwP-2': { status: 'Completed', dateAdministered: '2026-02-05' },
      'DTwP-3': { status: 'Completed', dateAdministered: '2026-03-20' },
      'MMR-1': { status: 'Scheduled', dueDate: '2026-08-15', notes: '9 Month milestone upcoming!' },
      'PCV Booster': { status: 'Scheduled', dueDate: '2026-08-15' }
    }
  },
  {
    id: 'PAT-8803',
    childName: 'Vihaan Patel',
    gender: 'Male',
    dob: '2024-08-10',
    bloodGroup: 'A+',
    parentName: 'Sanjay Patel',
    parentRelation: 'Father',
    phone: '+91 99887 76655',
    email: 'sanjay.patel@example.com',
    address: '12-A Blossom Enclave, Satellite, Ahmedabad',
    clinicName: 'Apollo City Hospital & Immunization Clinic',
    doctorName: 'Dr. Anita Mehta',
    regDate: '2024-08-12',
    notes: 'Completed 18-month DTP booster. Next milestone at 5 years.',
    customVaccineStatus: {
      'BCG': { status: 'Completed', dateAdministered: '2024-08-12' },
      'OPV-0': { status: 'Completed', dateAdministered: '2024-08-12' },
      'HepB-0': { status: 'Completed', dateAdministered: '2024-08-12' },
      'DTwP-1 / DTaP-1': { status: 'Completed', dateAdministered: '2024-09-22' },
      'MMR-1': { status: 'Completed', dateAdministered: '2025-05-10' },
      'MMR-2': { status: 'Completed', dateAdministered: '2025-11-12' },
      'DTP Booster-1': { status: 'Completed', dateAdministered: '2026-02-14' },
      'DTP Booster-2': { status: 'Scheduled', dueDate: '2029-08-10' }
    }
  }
];

export const INITIAL_LOGS = [
  {
    id: 'LOG-9901',
    patientId: 'PAT-8801',
    childName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    channel: 'WhatsApp',
    recipient: '+91 98765 43210',
    vaccineName: 'DTwP-1 / DTaP-1 (Overdue Alert)',
    messagePreview: 'ALERT: Vaccination for Aarav Sharma (DTwP-1) was due on 01-Aug-2026. Please visit Sunrise Pediatric Clinic promptly.',
    timestamp: '2026-08-08 09:15 AM',
    status: 'Delivered',
    statusBadge: 'success'
  },
  {
    id: 'LOG-9902',
    patientId: 'PAT-8802',
    childName: 'Ananya Verma',
    parentName: 'Meera Verma',
    channel: 'Email',
    recipient: 'meera.verma@example.com',
    vaccineName: 'MMR-1 & PCV Booster (3-Day Reminder)',
    messagePreview: 'Dear Meera Verma, Ananya Verma is scheduled for MMR-1 & PCV Booster on 15-Aug-2026 at Max Healthcare Child Wellness.',
    timestamp: '2026-08-09 08:00 AM',
    status: 'Sent',
    statusBadge: 'info'
  },
  {
    id: 'LOG-9903',
    patientId: 'PAT-8801',
    childName: 'Aarav Sharma',
    parentName: 'Ramesh Sharma',
    channel: 'WhatsApp',
    recipient: '+91 98765 43210',
    vaccineName: 'Rotavirus-1 & PCV-1',
    messagePreview: 'REMINDER: Upcoming vaccination appointment for Aarav Sharma on 12-Aug-2026.',
    timestamp: '2026-08-05 10:30 AM',
    status: 'Read',
    statusBadge: 'success'
  }
];
