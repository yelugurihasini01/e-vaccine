import crypto from 'crypto';
import axios from 'axios';

// In-memory pending registration OTP store for new users who don't have a DB record yet
// Key: normalized phone '+91XXXXXXXXXX' -> { hash, expiresAt, attempts, resendCount, lastResendAt }
const pendingRegistrationOtps = new Map();

// Helper to normalize Indian phone number (+91 fixed)
export function normalizeIndianPhone(inputPhone) {
  if (!inputPhone) return null;
  // Strip all non-digit characters except leading plus
  let cleaned = inputPhone.toString().trim().replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Must be exactly 10 digits and start with 6, 7, 8, or 9
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return null;
  }

  return `+91${cleaned}`;
}

// Generate random 6-digit numeric OTP
export function generateRandomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP with SHA-256 for secure non-plaintext storage
export function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Send OTP via configured SMS Provider or Dev Simulator
export async function dispatchSmsOtp(phone, otp, purpose = 'registration') {
  const isProd = process.env.NODE_ENV === 'production';
  const smsProvider = (process.env.SMS_PROVIDER || 'simulator').toLowerCase();

  const smsMessage = `[E-Vaccine India] Your OTP for ${purpose} is ${otp}. Valid for 10 minutes. Do not share this with anyone.`;

  console.log(`\n========================================================`);
  console.log(`📲 [SMS OTP DISPATCH]`);
  console.log(`📞 Recipient:   ${phone}`);
  console.log(`🎯 Purpose:     ${purpose.toUpperCase()}`);
  console.log(`🔑 OTP Code:    ${otp}`);
  console.log(`⚙️  Provider:    ${smsProvider.toUpperCase()}`);
  console.log(`========================================================\n`);

  if (smsProvider === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
    try {
      const rawNumber = phone.replace('+91', '');
      await axios.post('https://www.fast2sms.com/dev/bulkV2', {
        route: 'otp',
        variables_values: otp,
        numbers: rawNumber
      }, {
        headers: { authorization: process.env.FAST2SMS_API_KEY }
      });
      return { success: true, delivered: true, provider: 'fast2sms' };
    } catch (err) {
      console.error('Fast2SMS error:', err.response?.data || err.message);
      return { success: true, delivered: false, provider: 'fast2sms (fallback)', simulated: true };
    }
  }

  // Simulator mode (default)
  return {
    success: true,
    delivered: true,
    provider: 'simulator',
    devOtp: isProd ? undefined : otp
  };
}

// Create or refresh OTP for pending registration
export async function createRegistrationOtp(phone) {
  const now = Date.now();
  const existing = pendingRegistrationOtps.get(phone);

  if (existing) {
    // Check resend limit (max 3 resends per hour)
    if (existing.resendCount >= 3 && (now - existing.firstResendAt) < 60 * 60 * 1000) {
      const waitMinutes = Math.ceil((60 * 60 * 1000 - (now - existing.firstResendAt)) / 60000);
      throw new Error(`OTP resend limit reached. Please try again after ${waitMinutes} minutes.`);
    }

    // Min 30 seconds interval between resends
    if (existing.lastResendAt && (now - existing.lastResendAt) < 30000) {
      throw new Error('Please wait 30 seconds before requesting a new OTP.');
    }
  }

  const rawOtp = generateRandomOtp();
  const hashed = hashOtp(rawOtp);
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes

  pendingRegistrationOtps.set(phone, {
    hash: hashed,
    expiresAt,
    attempts: 0,
    resendCount: (existing?.resendCount || 0) + 1,
    firstResendAt: existing?.firstResendAt || now,
    lastResendAt: now
  });

  const dispatchResult = await dispatchSmsOtp(phone, rawOtp, 'Registration Verification');

  return {
    success: true,
    phone,
    expiresInSeconds: 600,
    devOtp: dispatchResult.devOtp
  };
}

// Verify registration OTP
export function verifyRegistrationOtp(phone, inputOtp) {
  const record = pendingRegistrationOtps.get(phone);

  if (!record) {
    throw new Error('No OTP requested for this mobile number or it has expired. Please request a new OTP.');
  }

  if (Date.now() > record.expiresAt) {
    pendingRegistrationOtps.delete(phone);
    throw new Error('OTP has expired. Please request a new one.');
  }

  if (record.attempts >= 5) {
    pendingRegistrationOtps.delete(phone);
    throw new Error('Maximum OTP verification attempts (5) exceeded. Please request a new OTP.');
  }

  const hashedInput = hashOtp(inputOtp.toString().trim());

  if (hashedInput !== record.hash) {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    throw new Error(`Invalid OTP. You have ${remaining} attempt(s) remaining.`);
  }

  // Success: consume OTP
  pendingRegistrationOtps.delete(phone);
  return true;
}
