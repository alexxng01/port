import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate OTP send (in production, integrate with email service)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    toast.success(`Demo OTP: ${otp}`);
    toast.success('OTP sent to your email!');

    // Store OTP in localStorage for demo
    localStorage.setItem('resetOTP', otp);
    localStorage.setItem('resetEmail', email);

    setTimeout(() => {
      window.location.href = '/reset-password';
    }, 2000);

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <h2>
        <i className="bx bx-key"></i> Forgot Password
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="bx bx-envelope"></i> Enter Your Email
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

      <div className="back-link">
        <Link to="/login">
          <i className="bx bx-arrow-back"></i> Back to Login
        </Link>
      </div>

      <div className="info-text">
        <i className="bx bx-info-circle"></i> Demo: OTP will be shown in a popup
      </div>
    </div>
  );
};

export default ForgotPassword;