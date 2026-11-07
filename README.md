# 💉 VaxAlert Pro: Automated Child Immunization Tracking & Multi-Channel Reminder System (WhatsApp & Email)

> **Academic Project Submission & Clinical Portfolio**  
> **Domain:** Healthcare Informatics / Public Health Engineering / Pediatric Immunization  
> **Target Audience:** Pediatric Clinics, Hospitals, Municipal Health Departments, and Parents  

---

## 🌟 Executive Summary

Immunization dropouts remain a critical public health challenge worldwide. Studies indicate that over **70% of missed infant vaccinations** occur not due to vaccine hesitancy, but because parents forget complex multi-stage milestone schedules or misplace physical immunization paper cards.

**VaxAlert Pro** is an academic-grade, responsive clinical web application designed to eliminate missed childhood immunizations. It features:
1. **Automated Milestone Scheduling** based on the Universal Immunization Programme (UIP) and WHO guidelines (Birth to 6 years).
2. **Dual-Channel Reminder Engine**:
   - **Direct WhatsApp Messaging**: Instant zero-cost Click-to-Chat (`wa.me`) deep links with localized pre-formatted messages + Twilio Cloud API readiness.
   - **SMTP Email Dispatcher**: Responsive HTML clinical email templates with hospital branding and calendar invites.
3. **💧 Pediatric Hydration & Post-Vaccination Wellness Center**:
   - Evidence-based **Holliday-Segar Fluid Formula Calculator** for pediatric water intake.
   - Interactive 24-hour post-shot fever, comfort, and hydration tracker.
   - Clinical symptom triage matrix (Normal immune response vs. dehydration warning red flags).
4. **Interactive Milestone Roadmap**: Visual developmental timeline tracking doses from birth to school age.
5. **Official Digital Immunization Passport**: Print-ready, high-resolution health record with verifiable QR codes and clinician signature lines.
6. **Academic Viva Voce Defense Portal**: Built-in architecture diagrams, Data Flow Diagrams (DFD Level 0 & Level 1), database schemas, and 15+ university examiner Q&As.

---

## 🚀 Quick Start Guide (How to Run Locally)

### Prerequisites
- Node.js (v18 or higher)
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### 1. Install Dependencies
```bash
cd evaccine-reminder-app
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000/
```

### 3. Build for Production / Deployment
```bash
npm run build
npm run preview
```

---

## 📱 Core Modules & Capabilities

### 1. 📊 Clinical Dashboard
- **Dynamic Quotes Ticker**: 32 curated public health, hydration, and immunology quotes (WHO, UNICEF, Dr. Jonas Salk, Louis Pasteur, Dr. Soumya Swaminathan). Filter by category (*Hydration*, *Immunology*, *Parental Care*, *Global Health*) and share directly to WhatsApp.
- **KPI Metrics**: Active Infant Registry count, Upcoming Doses (14-30 days), Critical Overdue Alerts, and Full Compliance Rate (%).
- **One-Click Broadcast**: Dispatch urgent WhatsApp reminders to all overdue parents simultaneously.

### 2. 👶 Child Records & Registry (`PatientList.jsx`)
- Register new infants with DOB, gender, blood group, allergies, parent contact, clinic name, and assigned pediatrician.
- Auto-computes chronological age (e.g. *3 months old*, *1.2 years old*) and individual vaccination progress bar.

### 3. 🗺️ Milestone Roadmap (`MilestoneTimeline.jsx`)
- Visual chronological pathway covering:
  - **Birth:** BCG, OPV-0, Hepatitis-B (Birth Dose)
  - **6 Weeks:** Pentavalent-1, Rotavirus-1, PCV-1, OPV-1
  - **10 Weeks:** Pentavalent-2, Rotavirus-2, OPV-2
  - **14 Weeks:** Pentavalent-3, Rotavirus-3, PCV-2, IPV-1
  - **6 Months:** Influenza-1, Typhoid Conjugate
  - **9 - 12 Months:** MR-1 (Measles-Rubella), JE-1, PCV Booster
  - **16 - 24 Months:** DPT Booster-1, MR-2, OPV Booster
  - **5 - 6 Years:** DPT Booster-2
- Toggle vaccine administration with automatic batch numbering (`VX-XXXXXX`) and timestamping.

### 4. 📲 WhatsApp & Email Reminder Hub (`ReminderHub.jsx`)
- **Realistic Phone Bezel Mockup**: Live WhatsApp chat bubble simulation with read receipts (`✓✓`) and clinic avatar.
- **Multi-Language Selector**: Toggle message templates between English, Hindi (हिंदी), and Spanish (Español).
- **Hydration Advice Injection**: Toggle button to append clinical fluid advice directly into parent reminders.
- **Deep Linking Protocol**: Zero-cost, instantaneous dispatch using `https://wa.me/{phone}?text={encoded_text}`.

### 5. 💧 Pediatric Hydration & Post-Care Center (`HydrationCareCenter.jsx`)
- **Holliday-Segar Maintenance Fluid Equation**:
  - $0 \text{ to } 10\text{ kg} \rightarrow 100\text{ mL/kg/day}$
  - $11 \text{ to } 20\text{ kg} \rightarrow 1000\text{ mL} + 50\text{ mL/kg}$
  - $> 20\text{ kg} \rightarrow 1500\text{ mL} + 20\text{ mL/kg}$
- **24-Hour Checklist**: Interactive checkboxes tracking immediate calming (0-2h), fever management (3-6h), bedside fluids (7-12h), and stabilization (13-24h).
- **Triage Matrix**: Differentiates mild expected fever from dehydration warning signs (dry diapers, sunken fontanelle).

### 6. 📜 Digital Immunization Passport (`CertificateView.jsx`)
- Official verified certificate ready for school admission, pediatric visits, and international travel.
- Verifiable QR Code, official stamp seal, and CSS print stylesheet (`window.print()`).

---

## 🏛️ System Architecture & Engineering

```
┌─────────────────────────────────────────────────────────────┐
│                 VaxAlert Pro Architecture                   │
└─────────────────────────────────────────────────────────────┘
                             │
     ┌───────────────────────┴───────────────────────┐
     ▼                                               ▼
[User Interface]                            [Clinical Engines]
- Clinical Dashboard                         - Milestone Calculation (UIP)
- Smartphone WhatsApp Mockup                 - Holliday-Segar Fluid Formula
- Interactive Roadmap                        - Notification Sanitizer
- Digital Certificate                        - QR Code Generator
     │                                               │
     └───────────────────────┬───────────────────────┘
                             ▼
            [Multi-Channel Notification Gateway]
             ├── WhatsApp Click-to-Chat (wa.me)
             ├── Twilio Cloud API Ready (REST)
             ├── SMTP Mail Server (SendGrid/Gmail)
             └── LocalStorage / SQLite Persistent State
```

---

## 🎓 Academic Viva Voce Defense Cheat Sheet

| Question | Model Examiner Response |
| :--- | :--- |
| **Why WhatsApp over SMS?** | WhatsApp boasts >98% open rates compared to 20% for SMS, supports zero-cost deep linking, formatted text, and allows parents to confirm appointments with one tap. |
| **Why Holliday-Segar?** | Post-vaccination fever causes insensible fluid loss. The Holliday-Segar formula is the international gold standard in pediatrics for calculating physiological fluid replacement. |
| **How does offline demo work?** | Through standard URI scheme encoding (`wa.me`), allowing instant real-world transmission to any smartphone without requiring paid cloud API keys. |
| **How is privacy protected?** | Patient phone numbers and IDs are sanitized. Communications use end-to-end encryption (E2EE), and storage supports 256-bit AES encryption. |

---

## 📄 License
This project is developed for academic evaluation, research, and non-commercial clinical presentation.
