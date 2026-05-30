const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Portfolio CMS" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html || options.text,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP for password reset
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @param {string} name - User name
 */
const sendPasswordResetOTP = async (email, otp, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a2a; color: #fff; }
        .container { max-width: 500px; margin: 50px auto; background: #1a1a3a; padding: 30px; border-radius: 15px; border: 1px solid #0ef; }
        .header { text-align: center; color: #0ef; font-size: 24px; margin-bottom: 20px; }
        .otp-code { font-size: 36px; font-weight: bold; text-align: center; color: #0ef; letter-spacing: 10px; padding: 20px; background: #0a0a2a; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #8899aa; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">🔐 Password Reset Request</div>
        <p>Hello ${name || 'User'},</p>
        <p>You requested to reset your password. Use the OTP below to complete the process:</p>
        <div class="otp-code">${otp}</div>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">Portfolio CMS - Secure Password Recovery</div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset OTP - Portfolio CMS',
    html,
  });
};

/**
 * Send welcome email to new admin
 * @param {string} email - Admin email
 * @param {string} name - Admin name
 * @param {string} password - Temporary password
 */
const sendWelcomeEmail = async (email, name, password) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to Portfolio CMS</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a2a; color: #fff; }
        .container { max-width: 500px; margin: 50px auto; background: #1a1a3a; padding: 30px; border-radius: 15px; border: 1px solid #0ef; }
        .header { text-align: center; color: #0ef; font-size: 24px; margin-bottom: 20px; }
        .credentials { background: #0a0a2a; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #8899aa; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">🎉 Welcome to Portfolio CMS!</div>
        <p>Hello ${name},</p>
        <p>Your admin account has been created successfully.</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <p>Please login and change your password immediately.</p>
        <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; padding: 10px 20px; background: #0ef; color: #1a1a3a; text-decoration: none; border-radius: 5px;">Login Now</a>
        <div class="footer">Portfolio CMS - Your Professional Portfolio Manager</div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Portfolio CMS',
    html,
  });
};

/**
 * Send contact confirmation email
 * @param {string} userEmail - User email
 * @param {string} userName - User name
 * @param {string} message - User message
 */
const sendContactConfirmation = async (userEmail, userName, message) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>We received your message</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a2a; color: #fff; }
        .container { max-width: 500px; margin: 50px auto; background: #1a1a3a; padding: 30px; border-radius: 15px; border: 1px solid #0ef; }
        .header { text-align: center; color: #0ef; font-size: 24px; margin-bottom: 20px; }
        .message-box { background: #0a0a2a; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #8899aa; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">📧 Thank You for Contacting Us!</div>
        <p>Dear ${userName},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <div class="message-box">
          <p><strong>Your message:</strong></p>
          <p>${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
        </div>
        <p>Best regards,<br>Portfolio CMS Team</p>
        <div class="footer">This is an automated confirmation, please do not reply.</div>
      </div>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    subject: 'We received your message - Portfolio CMS',
    html,
  });
};

/**
 * Send notification to admin about new contact message
 * @param {string} adminEmail - Admin email
 * @param {Object} messageData - Message data
 */
const sendAdminNotification = async (adminEmail, messageData) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Contact Message</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a2a; color: #fff; }
        .container { max-width: 500px; margin: 50px auto; background: #1a1a3a; padding: 30px; border-radius: 15px; border: 1px solid #0ef; }
        .header { text-align: center; color: #0ef; font-size: 24px; margin-bottom: 20px; }
        .message-details { background: #0a0a2a; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #8899aa; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">📬 New Contact Message</div>
        <div class="message-details">
          <p><strong>From:</strong> ${messageData.name} (${messageData.email})</p>
          <p><strong>Message:</strong></p>
          <p>${messageData.message}</p>
        </div>
        <p>Login to your admin panel to reply.</p>
        <a href="${process.env.CLIENT_URL}/admin/messages" style="display: inline-block; padding: 10px 20px; background: #0ef; color: #1a1a3a; text-decoration: none; border-radius: 5px;">View Message</a>
        <div class="footer">Portfolio CMS - Admin Notification</div>
      </div>
    </html>
  `;

  return await sendEmail({
    to: adminEmail,
    subject: 'New Contact Message - Portfolio CMS',
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetOTP,
  sendWelcomeEmail,
  sendContactConfirmation,
  sendAdminNotification,
};