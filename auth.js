import express from 'express';
import { DataStore } from '../models/dataStore.js';
import { protect, generateToken } from '../middleware/authMiddleware.js';
import { 
  normalizeIndianPhone, 
  createRegistrationOtp, 
  verifyRegistrationOtp,
  generateRandomOtp,
  hashOtp,
  dispatchSmsOtp
} from '../services/otpService.js';

const router = express.Router();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to Indian mobile number for registration or login
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { mobileNumber, purpose } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Indian mobile number.' });
    }

    const normalized = normalizeIndianPhone(mobileNumber);
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Indian mobile number. Must be a 10-digit number (+91XXXXXXXXXX) starting with 6, 7, 8, or 9.'
      });
    }

    // Check if purpose is login-otp: user must already exist
    if (purpose === 'login') {
      const existingUser = await DataStore.findUser({ mobileNumber: normalized });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'No account registered with this Indian mobile number. Please register first.'
        });
      }

      // Generate login OTP
      const rawOtp = generateRandomOtp();
      const hashed = hashOtp(rawOtp);
      existingUser.otpDetails = {
        hash: hashed,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        attempts: 0,
        resendCount: (existingUser.otpDetails?.resendCount || 0) + 1,
        lastResendAt: new Date().toISOString()
      };
      await existingUser.save();

      const dispatchResult = await dispatchSmsOtp(normalized, rawOtp, 'Account Login');
      return res.json({
        success: true,
        message: `OTP sent successfully to ${normalized}. Valid for 10 minutes.`,
        mobileNumber: normalized,
        devOtp: dispatchResult.devOtp
      });
    }

    // For Registration
    const existingUser = await DataStore.findUser({ mobileNumber: normalized });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account is already registered with this mobile number. Please log in.'
      });
    }

    const result = await createRegistrationOtp(normalized);
    res.json({
      success: true,
      message: `Verification OTP sent to ${normalized}. Valid for 10 minutes.`,
      mobileNumber: normalized,
      devOtp: result.devOtp
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Complete Indian user registration with verified mobile OTP
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      fullName, 
      dob, 
      gender, 
      mobileNumber, 
      email, 
      password, 
      confirmPassword, 
      otp,
      role
    } = req.body;

    // 1. Mandatory Fields Validation
    if (!fullName || !dob || !mobileNumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: Full Name, DOB, Mobile, Email, and Password.'
      });
    }

    // 2. Validate Indian Mobile
    const normalizedPhone = normalizeIndianPhone(mobileNumber);
    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Indian mobile number (+91XXXXXXXXXX). Must be 10 digits starting with 6-9.'
      });
    }

    // 3. Confirm Password Match
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // 4. Verify OTP
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile OTP verification code is required to register.'
      });
    }

    verifyRegistrationOtp(normalizedPhone, otp);

    // 5. Check uniqueness
    const phoneExists = await DataStore.findUser({ mobileNumber: normalizedPhone });
    if (phoneExists) {
      return res.status(400).json({ success: false, message: 'Mobile number is already registered.' });
    }

    const emailExists = await DataStore.findUser({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    // 6. Create User
    const newUser = await DataStore.createUser({
      fullName: fullName.trim(),
      dob: new Date(dob).toISOString(),
      gender: gender || 'Prefer not to say',
      mobileNumber: normalizedPhone,
      email: email.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'admin' : 'user',
      isMobileVerified: true,
      notificationPreferences: {
        email: true,
        whatsapp: true,
        reminderIntervalsDays: [7, 3, 1, 0],
        preferredLanguage: 'en'
      }
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to E-Vaccine Reminder System.',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        role: newUser.role,
        notificationPreferences: newUser.notificationPreferences
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/login-password
 * @desc    Login with Email or Indian Mobile + Password
 */
router.post('/login-password', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Email/Mobile number and Password.'
      });
    }

    const cleanInput = loginId.trim();
    let query = {};

    if (cleanInput.includes('@')) {
      query.email = cleanInput.toLowerCase();
    } else {
      const normalized = normalizeIndianPhone(cleanInput);
      query.mobileNumber = normalized || cleanInput;
    }

    const user = await DataStore.findUser(query, true);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email or mobile number.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/login-otp
 * @desc    Passwordless mobile login using Indian Mobile Number & OTP
 */
router.post('/login-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Indian mobile number and OTP code.'
      });
    }

    const normalized = normalizeIndianPhone(mobileNumber);
    if (!normalized) {
      return res.status(400).json({ success: false, message: 'Invalid Indian mobile number.' });
    }

    const user = await DataStore.findUser({ mobileNumber: normalized }, true);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered user found with this mobile number. Please register first.'
      });
    }

    const otpDetails = user.otpDetails;
    if (!otpDetails || !otpDetails.hash || !otpDetails.expiresAt) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Please request an OTP first.' });
    }

    if (new Date() > new Date(otpDetails.expiresAt)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
    }

    if (otpDetails.attempts >= 5) {
      return res.status(400).json({ success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' });
    }

    const hashedInput = hashOtp(otp.toString().trim());
    if (hashedInput !== otpDetails.hash) {
      user.otpDetails.attempts += 1;
      await user.save();
      const remaining = 5 - user.otpDetails.attempts;
      return res.status(400).json({ success: false, message: `Invalid OTP code. ${remaining} attempt(s) remaining.` });
    }

    user.otpDetails = undefined;
    user.isMobileVerified = true;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Mobile OTP login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset OTP
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { loginId } = req.body;
    if (!loginId) {
      return res.status(400).json({ success: false, message: 'Please provide your registered Email or Mobile number.' });
    }

    const cleanInput = loginId.trim();
    let query = {};
    if (cleanInput.includes('@')) {
      query.email = cleanInput.toLowerCase();
    } else {
      const normalized = normalizeIndianPhone(cleanInput);
      query.mobileNumber = normalized || cleanInput;
    }

    const user = await DataStore.findUser(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this identifier.' });
    }

    const rawOtp = generateRandomOtp();
    const hashed = hashOtp(rawOtp);
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await user.save();

    const dispatch = await dispatchSmsOtp(user.mobileNumber, rawOtp, 'Password Reset');

    res.json({
      success: true,
      message: `Password reset OTP has been sent to your registered mobile number (${user.mobileNumber.substring(0, 6)}****).`,
      devOtp: dispatch.devOtp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using verified OTP
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { loginId, otp, newPassword, confirmNewPassword } = req.body;

    if (!loginId || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide your login ID, OTP code, and new password.' });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanInput = loginId.trim();
    let query = {};
    if (cleanInput.includes('@')) {
      query.email = cleanInput.toLowerCase();
    } else {
      const normalized = normalizeIndianPhone(cleanInput);
      query.mobileNumber = normalized || cleanInput;
    }

    const user = await DataStore.findUser(query, true);
    if (!user || !user.resetPasswordToken) {
      return res.status(400).json({ success: false, message: 'Invalid reset request or user not found.' });
    }

    if (new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ success: false, message: 'Password reset OTP has expired. Please request again.' });
    }

    const hashedInput = hashOtp(otp.toString().trim());
    if (hashedInput !== user.resetPasswordToken) {
      return res.status(400).json({ success: false, message: 'Invalid OTP verification code.' });
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 */
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * @route   PUT /api/auth/preferences
 * @desc    Update notification preferences (WhatsApp, Email, Intervals, Language)
 */
router.put('/preferences', protect, async (req, res) => {
  try {
    const { email, whatsapp, reminderIntervalsDays, preferredLanguage } = req.body;
    const user = await DataStore.findUserById(req.user._id);

    if (!user.notificationPreferences) {
      user.notificationPreferences = { email: true, whatsapp: true, reminderIntervalsDays: [7, 3, 1, 0], preferredLanguage: 'en' };
    }

    if (typeof email === 'boolean') user.notificationPreferences.email = email;
    if (typeof whatsapp === 'boolean') user.notificationPreferences.whatsapp = whatsapp;
    if (Array.isArray(reminderIntervalsDays)) user.notificationPreferences.reminderIntervalsDays = reminderIntervalsDays;
    if (preferredLanguage) user.notificationPreferences.preferredLanguage = preferredLanguage;

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated successfully.',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (clear token client-side)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

export default router;
