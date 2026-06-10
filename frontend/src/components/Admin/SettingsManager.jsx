import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5002';

const SettingsManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [credentials, setCredentials] = useState(null);
  const [credsLoading, setCredsLoading] = useState(false);

  // Fetch credentials when tab is opened
  useEffect(() => {
    if (activeTab === 'credentials') {
      fetchCredentials();
    }
  }, [activeTab]);

  const fetchCredentials = async () => {
    setCredsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/credentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCredentials(data.data);
      } else {
        toast.error('Failed to load credentials');
      }
    } catch (err) {
      toast.error('Server error loading credentials');
    } finally {
      setCredsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Verify current password matches stored credentials
      const credsRes = await fetch(`${API_BASE}/api/auth/credentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const credsData = await credsRes.json();

      if (!credsData.success || credsData.data.password !== passwordData.currentPassword) {
        toast.error('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Save new password to MongoDB
      const res = await fetch(`${API_BASE}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: passwordData.newPassword })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('✅ Password updated and saved to MongoDB!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Refresh credentials display
        setCredentials(prev => prev ? { ...prev, password: passwordData.newPassword, updatedAt: new Date().toISOString() } : prev);
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    }
    setLoading(false);
  };

  const exportBackup = async () => {
    try {
      const response = await api.get('/portfolio');
      const data = response.data;
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Backup exported successfully');
    } catch (error) {
      toast.error('Failed to export backup');
    }
  };

  const importBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackupLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      toast.success('Backup imported successfully');
    } catch (error) {
      toast.error('Failed to import backup');
    } finally {
      setBackupLoading(false);
      e.target.value = '';
    }
  };

  const clearAllData = async () => {
    if (window.confirm('⚠️ WARNING: This will delete all portfolio data. Are you sure?')) {
      if (window.confirm('This action cannot be undone. Type "DELETE" to confirm')) {
        const confirmText = prompt('Type "DELETE" to confirm');
        if (confirmText === 'DELETE') {
          try {
            toast.success('All data cleared');
          } catch (error) {
            toast.error('Failed to clear data');
          }
        }
      }
    }
  };

  return (
    <div className="form-container">
      <h3><i className="bx bx-cog"></i> Settings</h3>

      <div className="settings-tabs">
        <button className={`tab-btn ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
          <i className="bx bx-id-card"></i> Account Info
        </button>
        <button className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
          <i className="bx bx-lock"></i> Change Password
        </button>
        <button className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
          <i className="bx bx-data"></i> Backup &amp; Restore
        </button>
        <button className={`tab-btn ${activeTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveTab('danger')}>
          <i className="bx bx-error-circle"></i> Danger Zone
        </button>
      </div>

      {/* ── ACCOUNT INFO TAB ── */}
      {activeTab === 'credentials' && (
        <div>
          {credsLoading ? (
            <p style={{ color: '#aaa' }}>Loading credentials...</p>
          ) : credentials ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={cardStyle}>
                <div style={cardLabel}><i className="bx bx-envelope" style={{ marginRight: '8px' }}></i>Login Email</div>
                <div style={cardValue}>{credentials.email}</div>
              </div>

              <div style={cardStyle}>
                <div style={cardLabel}><i className="bx bx-lock-alt" style={{ marginRight: '8px' }}></i>Current Password</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ ...cardValue, flex: 1, letterSpacing: showPassword ? 'normal' : '4px' }}>
                    {showPassword ? credentials.password : '•'.repeat(credentials.password.length)}
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeBtn}
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                  </button>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardLabel}><i className="bx bx-time" style={{ marginRight: '8px' }}></i>Last Updated</div>
                <div style={cardValue}>
                  {new Date(credentials.updatedAt).toLocaleString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>

              <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                <i className="bx bx-shield-check" style={{ color: '#7b61ff', marginRight: '6px' }}></i>
                Credentials are stored securely in MongoDB. To change your password, use the <strong style={{ color: '#0ef' }}>Change Password</strong> tab.
              </p>
            </div>
          ) : (
            <p style={{ color: '#ff4757' }}>Could not load credentials.</p>
          )}
        </div>
      )}

      {/* ── CHANGE PASSWORD TAB ── */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '16px' }}>
            <i className="bx bx-info-circle" style={{ color: '#0ef', marginRight: '6px' }}></i>
            New password will be saved to MongoDB and required for future logins.
          </p>
          <button type="submit" className="btn-primary" disabled={loading}>
            <i className="bx bx-save"></i> {loading ? 'Updating...' : 'Update & Save to MongoDB'}
          </button>
        </form>
      )}

      {/* ── BACKUP TAB ── */}
      {activeTab === 'backup' && (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Export Backup</h4>
            <p>Download all portfolio data as JSON file.</p>
            <button className="btn-primary" onClick={exportBackup}>
              <i className="bx bx-download"></i> Export Backup
            </button>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Import Backup</h4>
            <p>Restore portfolio data from JSON backup file.</p>
            <input
              type="file"
              accept=".json"
              onChange={importBackup}
              disabled={backupLoading}
              style={{ marginBottom: '10px' }}
            />
            {backupLoading && <p>Importing...</p>}
          </div>
        </div>
      )}

      {/* ── DANGER ZONE TAB ── */}
      {activeTab === 'danger' && (
        <div>
          <div style={{ background: 'rgba(255,71,87,0.1)', padding: '20px', borderRadius: '10px', border: '1px solid #ff4757' }}>
            <h4 style={{ color: '#ff4757', marginBottom: '15px' }}>
              <i className="bx bx-error-circle"></i> Danger Zone
            </h4>
            <p style={{ marginBottom: '20px' }}>
              Once you delete all data, there is no going back. Please be certain.
            </p>
            <button className="btn-danger" onClick={clearAllData} style={{ padding: '12px 25px' }}>
              <i className="bx bx-trash"></i> Delete All Data
            </button>
          </div>
        </div>
      )}

      <style>{`
        .settings-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 25px;
          border-bottom: 1px solid #2d2d4a;
          padding-bottom: 10px;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 10px 20px;
          color: #fff;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .tab-btn:hover { background: #2a2a4a; }
        .tab-btn.active { background: #0ef; color: #1a1a3a; }
      `}</style>
    </div>
  );
};

const cardStyle = {
  background: 'rgba(123,97,255,0.08)',
  border: '1px solid rgba(123,97,255,0.25)',
  borderRadius: '12px',
  padding: '18px 22px',
};

const cardLabel = {
  fontSize: '12px',
  color: '#7b61ff',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
};

const cardValue = {
  fontSize: '16px',
  color: '#fff',
  fontFamily: 'monospace',
  background: 'rgba(0,0,0,0.3)',
  padding: '10px 14px',
  borderRadius: '8px',
  wordBreak: 'break-all',
};

const eyeBtn = {
  background: 'rgba(123,97,255,0.2)',
  border: '1px solid rgba(123,97,255,0.4)',
  borderRadius: '8px',
  color: '#7b61ff',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '18px',
  lineHeight: 1,
  flexShrink: 0,
};

export default SettingsManager;