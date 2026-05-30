const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendPasswordResetOTP,
  sendWelcomeEmail,
  sendContactConfirmation,
  sendAdminNotification,
} = require('../utils/emailService');
const User = require('../models/User');

// Generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// @route   POST /api/email/send-otp
// @desc    Send OTP for password reset
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(email, { otp, expiresAt });

    // Send email
    const result = await sendPasswordResetOTP(email, otp, user.name);

    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/email/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found',
      });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // OTP verified - generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const user = await User.findOne({ email });
    
    if (user) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    }

    otpStore.delete(email);

    res.json({
      success: true,
      message: 'OTP verified',
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/email/reset-password
// @desc    Reset password using token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/email/test
// @desc    Test email configuration
// @access  Private
router.post('/test', protect, async (req, res) => {
  try {
    const result = await sendWelcomeEmail(
      req.user.email,
      req.user.name,
      'Test Password'
    );

    res.json({
      success: result.success,
      message: result.success ? 'Test email sent' : 'Failed to send',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;