# 🏥 VaxRemind - Automated eVaccine Reminder System

> A production-ready, full-stack pediatric and adult immunization management platform that sends automated vaccination reminders to parents and guardians via **WhatsApp** and **Email**.

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Express](https://img.shields.io/badge/Express-4.21-blue)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Twilio%20%7C%20Meta%20%7C%20wa.me-25D366)
![Email](https://img.shields.io/badge/Email-Nodemailer%20SMTP-ea4335)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 🌟 Key Features

1. **Automated Vaccine Schedule Generator**:
   - Pre-loaded with the **WHO & National Universal Immunization Program (UIP)** standards (BCG, OPV, Pentavalent, Rotavirus, PCV, MR/MMR, DPT Boosters, Td).
   - Enter a child's **Date of Birth** to immediately calculate exact due dates from birth through 16 years.

2. **Multi-Channel Reminder Engine**:
   - 📱 **WhatsApp Reminders**:
     - **Twilio WhatsApp API** support for automated high-scale messaging.
     - **Meta WhatsApp Cloud API** (Graph API) integration.
     - **Direct Click-to-WhatsApp (`wa.me`)**: 1-click button to open pre-filled messages in WhatsApp Web or Mobile without API fees.
     - **Interactive In-Browser Smartphone Simulator**: Inspect the exact formatted message, timestamp, and read ticks directly in the web UI.
   - ✉️ **Responsive HTML Email Notifications**:
     - Branded, clean, pediatric-themed email templates sent via SMTP / Gmail App Passwords / SendGrid.
     - Includes target disease details, scheduled due date, clinical location, parent checklist, and appointment links.

3. **Intelligent Cron Scheduler**:
   - Automated background worker scans all registered children daily at 08:00 AM (customizable).
   - Multi-tier alert triggers:
     - 🗓️ **7 Days in Advance** (Advance notice)
     - 🔔 **2 Days Before** (Urgent reminder)
     - ⏰ **Due Today** (Action day alert)
     - 🚨 **Overdue Alerts** (Repeated weekly with spam prevention cooldowns)
   - "Scan & Send Reminders Now" button on the UI for on-demand execution.

4. **Clinical Administration Tracking**:
   - Record administered doses with **Administration Date**, **Batch / Lot Number**, **Administering Doctor / Nurse**, and **Clinical Notes**.
   - Reschedule doses with documented clinical reasons.

5. **Official Digital Immunization Passport & Certificate**:
   - Printable pediatric immunization card formatted with official seal, provider signature line, and dynamic **cryptographic QR Code** for authenticity checks.
   - Single-click **"Print / Save PDF"** optimized with clean print stylesheets.

6. **Notification Audit Trail & Live Test Dispatcher**:
   - Full history log of every WhatsApp and Email notification sent.
   - Dedicated Test Dispatcher to test sending sample reminders to any phone number or email address right from the screen.

---

## 📂 Project Architecture

```
evaccine-reminder/
├── package.json               # Dependencies & execution scripts
├── .env.example               # Environment variables template
├── .env                       # Local runtime configuration
├── README.md                  # Complete documentation & guides
├── data/
│   └── database.json          # Zero-dependency persistent JSON store with sample data
├── src/
│   ├── server.js              # Express HTTP server & background cron runner
│   ├── config/
│   │   ├── config.js          # App configuration loader
│   │   └── defaultSchedule.js # WHO / National Immunization Program schedule
│   ├── models/
│   │   └── db.js              # Atomic file-based JSON database engine
│   ├── services/
│   │   ├── emailService.js    # Nodemailer email generator & dispatcher
│   │   ├── whatsappService.js # Twilio, Meta, wa.me, and Simulator dispatcher
│   │   └── reminderEngine.js  # Scheduled cron engine & spam prevention filter
│   ├── routes/
│   │   ├── beneficiaries.js   # Child CRUD & automatic schedule generation
│   │   ├── schedules.js       # Dose administration, reschedule & on-demand remind
│   │   ├── vaccines.js        # Master vaccine registry
│   │   ├── notifications.js   # Notification audit log & test dispatcher
│   │   └── settings.js        # Clinic & channel settings
│   └── public/                # Web Dashboard Frontend
│       ├── index.html         # Single-page UI with Tailwind & Lucide icons
│       ├── css/
│       │   └── style.css      # WhatsApp smartphone mockup & print stylesheet
│       └── js/
│           ├── api.js         # Frontend REST API client
│           └── app.js         # Reactive UI controllers, modals, & QR engine
```

---

## 🚀 Quick Start Guide

### 1. Installation
In the project directory, run:
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```
For auto-reloading during development:
```bash
npm run dev
```

### 3. Open the Web Dashboard
Navigate to your browser:
```
http://localhost:5000
```

> **Note**: The app comes pre-seeded with 3 realistic pediatric profiles, upcoming and overdue vaccinations, and notification logs so you can immediately explore and test every feature!

---

## ⚙️ Configuration & Credentials Guide

All configurations can be customized in the `.env` file or directly through the **Settings** tab in the web dashboard.

### 📱 1. WhatsApp Configuration

The application supports four WhatsApp modes:

#### Option A: Built-in Simulator (Default - No Setup Required)
```env
WHATSAPP_PROVIDER=simulator
```
- Logs all WhatsApp dispatches to the database and shows a realistic smartphone mockup in the UI.
- Perfect for demos, presentations, and local testing.

#### Option B: Direct Click-to-WhatsApp (`wa.me`)
```env
WHATSAPP_PROVIDER=direct
```
- Generates a 1-click link (`https://wa.me/{phone}?text={message}`) that opens directly in WhatsApp Web or the WhatsApp desktop/mobile app with the pre-formatted reminder text ready to send.
- 100% free with zero API registrations.

#### Option C: Twilio WhatsApp API (Automated Production)
```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```
1. Create a free account at [twilio.com](https://www.twilio.com).
2. Go to **Messaging > Try it Out > Send a WhatsApp message** to activate the Twilio WhatsApp Sandbox.
3. Paste your `Account SID`, `Auth Token`, and sandbox number into `.env`.

#### Option D: Meta WhatsApp Cloud API
```env
WHATSAPP_PROVIDER=meta
META_WA_PHONE_NUMBER_ID=your_phone_number_id
META_WA_ACCESS_TOKEN=your_system_user_token
```

---

### ✉️ 2. Email Reminder Configuration

To deliver real emails to parents via Gmail or custom SMTP:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM="CareWell Immunization <notifications@carewellhealth.org>"
```

#### How to get a Gmail App Password:
1. Go to your [Google Account](https://myaccount.google.com/) > **Security**.
2. Turn on **2-Step Verification** (if not already enabled).
3. Search for **"App Passwords"**.
4. Generate a new password under app name "eVaccine Reminder".
5. Copy the 16-character token into `SMTP_PASS` (without spaces).

> If `EMAIL_ENABLED=false` or no credentials are provided, the system runs in **Simulator Mode**, logging formatted HTML previews to the notifications audit table without crashing.

---

## 📋 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/settings/stats` | `GET` | Retrieve global metrics (Total children, Overdue, Upcoming, Completion %) |
| `/api/beneficiaries` | `GET` | List all registered children with summary metrics |
| `/api/beneficiaries/:id` | `GET` | Retrieve child profile, full 16-dose schedule, and notifications |
| `/api/beneficiaries` | `POST` | Register a new child & auto-generate schedule based on DOB |
| `/api/beneficiaries/:id` | `PUT` | Update child details (phone, email, guardian) |
| `/api/beneficiaries/:id` | `DELETE`| Remove child and all associated dose schedules |
| `/api/schedules/upcoming` | `GET` | Get upcoming doses within next 7 days (`?days=7`) |
| `/api/schedules/overdue` | `GET` | Get all overdue doses across all children |
| `/api/schedules/:id/administer`| `PUT` | Mark a vaccine as administered (records date, lot #, doctor) |
| `/api/schedules/:id/reschedule`| `PUT` | Postpone or change due date with documented reason |
| `/api/schedules/:id/remind` | `POST`| Instantly trigger an on-demand WhatsApp / Email reminder for this dose |
| `/api/vaccines` | `GET` | Master list of vaccines in the national immunization schedule |
| `/api/notifications` | `GET` | Audit trail of all dispatched WhatsApp and Email reminders |
| `/api/notifications/run-cron-now`| `POST`| Trigger immediate automated scan across all children |
| `/api/notifications/test-direct`| `POST`| Send test WhatsApp or Email to any phone number or inbox |
| `/api/settings` | `GET/PUT` | View or update clinic information and provider modes |

---

## 🛡️ License

This project is licensed under the MIT License.
