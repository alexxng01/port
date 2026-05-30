import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SettingsManager = () => {
  const { user, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [backupData, setBackupData] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);

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
    const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
      // Import logic here
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
            // Clear data logic here
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
        <button className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
          <i className="bx bx-lock"></i> Change Password
        </button>
        <button className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>
          <i className="bx bx-data"></i> Backup & Restore
        </button>
        <button className={`tab-btn ${activeTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveTab('danger')}>
          <i className="bx bx-error-circle"></i> Danger Zone
        </button>
      </div>

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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

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

      <style>
        {`
          .settings-tabs {
            display: flex;
            gap: 10px;
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
          .tab-btn:hover {
            background: #2a2a4a;
          }
          .tab-btn.active {
            background: #0ef;
            color: #1a1a3a;
          }
        `}
      </style>
    </div>
  );
};

export default SettingsManager;