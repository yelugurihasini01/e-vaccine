import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`,

  clinic: {
    name: process.env.CLINIC_NAME || 'CareWell Immunization & Pediatrics Center',
    phone: process.env.CLINIC_PHONE || '+1 (555) 019-2834',
    email: process.env.CLINIC_EMAIL || 'vaccines@carewellhealth.org',
    address: process.env.CLINIC_ADDRESS || '104 Health Ave, Medical District, NY'
  },

  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: process.env.EMAIL_FROM || 'CareWell Vaccines <notifications@carewellhealth.org>'
  },

  whatsapp: {
    // 'simulator' (default) | 'twilio' | 'meta' | 'direct'
    provider: process.env.WHATSAPP_PROVIDER || 'simulator',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'
    },
    meta: {
      phoneNumberId: process.env.META_WA_PHONE_NUMBER_ID || '',
      accessToken: process.env.META_WA_ACCESS_TOKEN || ''
    }
  },

  reminder: {
    cronSchedule: process.env.CRON_SCHEDULE || '0 8 * * *',
    daysBefore: (process.env.REMIND_DAYS_BEFORE || '7,2,0')
      .split(',')
      .map(d => parseInt(d.trim(), 10))
      .filter(n => !isNaN(n)),
    enableAutoReminders: process.env.ENABLE_AUTO_REMINDERS !== 'false',
    overdueIntervalDays: 7
  }
};
