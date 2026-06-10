import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5002';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        // Store email so the reset page knows which account is being reset
        localStorage.setItem('resetEmail', email);
        toast.success('OTP sent! Check your email inbox.');
        setTimeout(() => {
          window.location.href = '/reset-password';
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <h2>
        <i className="bx bx-key"></i> Forgot Password
      </h2>

      {!otpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="bx bx-envelope"></i> Enter Your Registered Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <i className="bx bx-send"></i> {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <div className="info-text" style={{ textAlign: 'center', padding: '20px' }}>
          <i className="bx bx-check-circle" style={{ fontSize: '2rem', color: '#7b61ff' }}></i>
          <p>OTP has been sent to <strong>{email}</strong>.</p>
          <p>Please check your inbox and spam folder.</p>
          <p>Redirecting to reset page...</p>
        </div>
      )}

      <div className="back-link">
        <Link to="/login">
          <i className="bx bx-arrow-back"></i> Back to Login
        </Link>
      </div>

      <div className="info-text">
        <i className="bx bx-info-circle"></i> OTP will be sent to your registered email address
      </div>
    </div>
  );
};

export default ForgotPassword;