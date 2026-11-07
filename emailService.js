import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    if (!transporter) {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
      });
      console.log(`✅ [Nodemailer] SMTP Transporter initialized with ${host}:${port}`);
    }
    return transporter;
  }
  return null;
}

export function generateEmailHtml({
  parentName,
  childName,
  vaccineName,
  diseasePrevented,
  dueDate,
  clinicName = 'Primary Health Centre (PHC)',
  isOverdue = false,
  notes = ''
}) {
  const headerColor = isOverdue ? '#dc2626' : '#0D9488';
  const badgeText = isOverdue ? 'URGENT: OVERDUE VACCINATION' : 'UPCOMING IMMUNIZATION REMINDER';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
      .header { background: ${headerColor}; color: #ffffff; padding: 28px 24px; text-align: center; }
      .badge { display: inline-block; background: rgba(255,255,255,0.25); color: #ffffff; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 8px; }
      .body { padding: 28px 24px; line-height: 1.6; }
      .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
      .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
      .info-row:last-child { border-bottom: none; }
      .care-tip { background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #065f46; }
      .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <span class="badge">${badgeText}</span>
        <h2 style="margin: 0; font-size: 22px;">E-Vaccine Reminder System</h2>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 13px;">Universal Immunization Programme (UIP) • MoHFW, Govt. of India</p>
      </div>
      <div class="body">
        <p>Dear <strong>${parentName || 'Parent/Guardian'}</strong>,</p>
        <p>This is an automated notification regarding the immunization schedule for your child, <strong style="color: #0D9488;">${childName}</strong>.</p>
        
        <div class="info-box">
          <div class="info-row"><span>💉 <strong>Vaccine Due:</strong></span><span>${vaccineName}</span></div>
          ${diseasePrevented ? `<div class="info-row"><span>🛡️ <strong>Protects Against:</strong></span><span>${diseasePrevented}</span></div>` : ''}
          <div class="info-row"><span>📅 <strong>Target Due Date:</strong></span><span style="color: ${headerColor}; font-weight: bold;">${dueDate}</span></div>
          <div class="info-row"><span>📍 <strong>Health Centre:</strong></span><span>${clinicName}</span></div>
          ${notes ? `<div class="info-row"><span>📝 <strong>Special Note:</strong></span><span>${notes}</span></div>` : ''}
        </div>

        <div class="care-tip">
          <strong>💧 Hydration & Post-Care Advisory:</strong><br>
          Ensure ${childName} receives plenty of water and milk. Adequate hydration supports normal body temperature and soothing comfort post-immunization.
        </div>

        <p style="font-size: 13px; color: #475569;">
          Please remember to carry your child's <strong>Mother & Child Protection (MCP / Mamta) Card</strong> to the session site.
        </p>
      </div>
      <div class="footer">
        National Health Helpline: <strong>1075</strong> | Emergency: <strong>108</strong><br>
        This is an automated reminder. Please contact your nearest Primary Health Centre (PHC) for schedule adjustments.
      </div>
    </div>
  </body>
  </html>
  `;
}

export async function sendEmailReminder({
  recipientEmail,
  parentName,
  childName,
  vaccineName,
  diseasePrevented,
  dueDate,
  clinicName,
  isOverdue = false,
  notes = ''
}) {
  const mailTransporter = getTransporter();
  const fromAddress = process.env.EMAIL_FROM || 'E-Vaccine Portal <no-reply@evaccine.gov.in>';
  const subject = isOverdue
    ? `🚨 URGENT: Overdue Immunization Alert for ${childName} (${vaccineName})`
    : `🗓️ Immunization Reminder: Scheduled Vaccine for ${childName} (${vaccineName})`;

  const htmlContent = generateEmailHtml({
    parentName,
    childName,
    vaccineName,
    diseasePrevented,
    dueDate,
    clinicName,
    isOverdue,
    notes
  });

  if (mailTransporter) {
    try {
      console.log(`[Nodemailer] Sending email to ${recipientEmail}...`);
      const info = await mailTransporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html: htmlContent
      });

      console.log(`✅ [Nodemailer] Email dispatched! Message ID: ${info.messageId}`);
      return {
        success: true,
        status: 'sent',
        provider: 'smtp',
        messageId: info.messageId,
        recipient: recipientEmail
      };
    } catch (err) {
      console.error(`❌ [Nodemailer Error]: ${err.message}`);
      return {
        success: false,
        status: 'failed',
        provider: 'smtp',
        error: err.message,
        recipient: recipientEmail
      };
    }
  }

  // Fallback simulator preview mode
  console.log(`\n====================================================================`);
  console.log(`✉️  [EMAIL REMINDER SIMULATOR (SMTP credentials not in .env)]`);
  console.log(`📬 Recipient:   ${recipientEmail}`);
  console.log(`📌 Subject:     ${subject}`);
  console.log(`👶 Child:       ${childName} (Due: ${dueDate})`);
  console.log(`====================================================================\n`);

  return {
    success: true,
    status: 'simulated',
    provider: 'simulator',
    note: 'SMTP credentials (SMTP_USER & SMTP_PASS) not configured in .env. Email recorded in simulated mode.',
    messageId: `sim_mail_${Date.now()}`,
    recipient: recipientEmail
  };
}

export default {
  generateEmailHtml,
  sendEmailReminder
};
