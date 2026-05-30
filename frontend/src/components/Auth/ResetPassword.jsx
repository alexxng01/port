import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    const storedOTP = localStorage.getItem('resetOTP');

    if (otp !== storedOTP) {
      toast.error('Invalid OTP');
      return;
    }

    setLoading(true);

    // Update password in localStorage for demo
    const adminAccount = JSON.parse(localStorage.getItem('admin_account'));
    if (adminAccount) {
      adminAccount.password = newPassword;
      localStorage.setItem('admin_account', JSON.stringify(adminAccount));
    }

    localStorage.removeItem('resetOTP');
    localStorage.removeItem('resetEmail');

    toast.success('Password reset successfully!');
    setTimeout(() => {
      navigate('/login');
    }, 2000);

    setLoading(false);
  };

  return (
    <div className="reset-container">
      <h2>
        <i className="bx bx-reset"></i> Reset Password
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="back-link">
        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;