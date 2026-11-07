import axios from 'axios';

/**
 * Normalizes phone numbers to international format (Indian +91 standard)
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

/**
 * Builds bilingual reminder text (English + Hindi)
 */
export function buildReminderMessage({
  parentName,
  childName,
  vaccineName,
  dueDate,
  clinicName = 'Urban Primary Health Centre (UPHC)',
  isOverdue = false,
  notes = ''
}) {
  const isUrgent = isOverdue;

  const header = isUrgent
    ? `🚨 *URGENT IMMUNIZATION NOTICE / अति आवश्यक टीकाकरण सूचना*\n🏛️ *${clinicName}*`
    : `✨ *IMMUNIZATION REMINDER / टीकाकरण अनुस्मारक*\n🏛️ *${clinicName}*`;

  const englishBody = `Dear *${parentName || 'Parent'}*,
This is a reminder regarding the scheduled vaccination for *${childName}*.

💉 *Vaccine:* ${vaccineName}
📅 *Due Date:* ${dueDate} ${isUrgent ? '*(OVERDUE)*' : ''}
📍 *Location:* ${clinicName}
${notes ? `📝 *Notes:* ${notes}\n` : ''}
💧 *Hydration & Care Tip:* Keep your child well-hydrated post-vaccination. Water and milk help prevent fever spikes.
📞 *National Health Helpline:* 1075`;

  const hindiBody = `\n---\nआदरणीय *${parentName || 'अभिभावक'}* जी,
*${childName}* के टीकाकरण की नियत तिथि:

💉 *टीका:* ${vaccineName}
📅 *नियत तिथि:* ${dueDate}
📍 *स्वास्थ्य केंद्र:* ${clinicName}

कृपया समय पर उपस्थित होकर बच्चे का टीकाकरण सुनिश्चित करें।`;

  return `${header}\n\n${englishBody}\n${hindiBody}\n\n_Universal Immunization Programme (UIP), MoHFW India_`;
}

/**
 * Sends WhatsApp message via official Meta WhatsApp Cloud API or Simulator
 */
export async function sendWhatsAppReminder({
  recipientPhone,
  parentName,
  childName,
  vaccineName,
  dueDate,
  clinicName,
  isOverdue = false,
  notes = ''
}) {
  const normalizedRecipient = normalizePhone(recipientPhone);
  const rawRecipientNumber = normalizedRecipient.replace('+', ''); // Meta requires without '+'

  const messageText = buildReminderMessage({
    parentName,
    childName,
    vaccineName,
    dueDate,
    clinicName,
    isOverdue,
    notes
  });

  const waUrl = `https://wa.me/${rawRecipientNumber}?text=${encodeURIComponent(messageText)}`;

  const metaPhoneId = process.env.META_WA_PHONE_NUMBER_ID;
  const metaToken = process.env.META_WA_ACCESS_TOKEN;

  // 1. Check if official Meta WhatsApp Cloud API credentials are provided
  if (metaPhoneId && metaToken) {
    try {
      console.log(`[WhatsApp Cloud API] Dispatching message to ${normalizedRecipient} via Meta Graph API...`);
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${metaPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: rawRecipientNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: messageText
          }
        },
        {
          headers: {
            Authorization: `Bearer ${metaToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const messageId = response.data?.messages?.[0]?.id || `wamid_${Date.now()}`;
      console.log(`✅ [WhatsApp Cloud API] Successfully dispatched! Meta Message ID: ${messageId}`);

      return {
        success: true,
        status: 'sent',
        provider: 'meta_cloud_api',
        messageId,
        recipient: normalizedRecipient,
        messageText,
        waUrl
      };
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message;
      console.error(`❌ [WhatsApp Cloud API Error]: ${errMsg}`);
      return {
        success: false,
        status: 'failed',
        provider: 'meta_cloud_api',
        error: errMsg,
        recipient: normalizedRecipient,
        messageText,
        waUrl
      };
    }
  }

  // 2. Fallback: Meta Cloud API credentials not configured in .env
  console.log(`\n====================================================================`);
  console.log(`📱 [WHATSAPP REMINDER SIMULATOR (Official Cloud API credentials not in .env)]`);
  console.log(`📞 Recipient:   ${normalizedRecipient}`);
  console.log(`👶 Child Name:  ${childName} (Parent: ${parentName})`);
  console.log(`💉 Vaccine:     ${vaccineName} (Due: ${dueDate})`);
  console.log(`🔗 1-Click WA:  ${waUrl}`);
  console.log(`====================================================================\n`);

  return {
    success: true,
    status: 'simulated',
    provider: 'simulator',
    note: 'Meta WhatsApp Cloud API credentials (META_WA_PHONE_NUMBER_ID & META_WA_ACCESS_TOKEN) are not set in .env. Reminder logged in simulated preview mode.',
    messageId: `sim_wa_${Date.now()}`,
    recipient: normalizedRecipient,
    messageText,
    waUrl
  };
}

export default {
  normalizePhone,
  buildReminderMessage,
  sendWhatsAppReminder
};
