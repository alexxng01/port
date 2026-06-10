import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0a0a2a'
    }}>
      <div className="login-container">
        <h2>
          <i className="bx bx-lock-alt"></i> Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="bx bx-envelope"></i> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rm91275@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bx bx-lock"></i> Password
            </label>
            <div className="password-field" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <i
                className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#8899aa'
                }}
              ></i>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <i className="bx bx-log-in"></i> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="forgot-link">
          <Link to="/forgot-password">
            <i className="bx bx-key"></i> Forgot Password?
          </Link>
        </div>

        <div className="info-text">
          
        </div>
      </div>
    </div>
  );
};

export default Login;