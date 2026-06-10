import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5002';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!email) {
      toast.error('Session expired. Please start the forgot password process again.');
      navigate('/forgot-password');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify OTP via backend
      const otpRes = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const otpData = await otpRes.json();

      if (!otpData.success) {
        toast.error(otpData.message || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // Step 2: Save new password to MongoDB
      const pwRes = await fetch(`${API_BASE}/api/auth/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });

      const pwData = await pwRes.json();
      if (!pwData.success) {
        toast.error(pwData.message || 'Failed to update password');
        setLoading(false);
        return;
      }

      // Step 3: Clean up session
      localStorage.removeItem('resetEmail');

      toast.success('Password reset successfully! Please login with your new password.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="reset-container">
      <h2>
        <i className="bx bx-reset"></i> Reset Password
      </h2>

      {email && (
        <p className="info-text" style={{ marginBottom: '16px' }}>
          <i className="bx bx-envelope"></i> OTP sent to: <strong>{email}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="bx bx-shield-check"></i> Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP from email"
            maxLength={6}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <i className="bx bx-lock"></i> New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <i className="bx bx-lock-alt"></i> Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          <i className="bx bx-check"></i> {loading ? 'Verifying...' : 'Reset Password'}
        </button>
      </form>

      <div className="back-link">
        <Link to="/forgot-password">
          <i className="bx bx-arrow-back"></i> Back to Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;