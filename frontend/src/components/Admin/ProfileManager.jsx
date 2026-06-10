import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5002';

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    image: '',
    cv: '',
    email: '',
    phone: '',
    address: '',
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchCredentials();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setProfile(response.data.profile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/credentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCredentials(data.data);
    } catch (err) {
      // silently fail — not critical
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portfolioService.updateProfile(profile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading profile...</div>;

  return (
    <div className="form-container">

      {/* ── ACCOUNT CREDENTIALS CARD ── */}
      {credentials && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(123,97,255,0.12), rgba(0,239,255,0.06))',
          border: '1px solid rgba(123,97,255,0.3)',
          borderRadius: '14px',
          padding: '22px 26px',
          marginBottom: '32px',
        }}>
          <h4 style={{ color: '#7b61ff', marginTop: 0, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bx bx-shield-quarter"></i> Admin Account Credentials
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Email */}
            <div style={credCard}>
              <div style={credLabel}><i className="bx bx-envelope"></i> Login Email</div>
              <div style={credValue}>{credentials.email}</div>
            </div>

            {/* Password */}
            <div style={credCard}>
              <div style={credLabel}><i className="bx bx-lock-alt"></i> Current Password</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ ...credValue, flex: 1, letterSpacing: showPassword ? 'normal' : '4px' }}>
                  {showPassword ? credentials.password : '•'.repeat(credentials.password.length)}
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide' : 'Show'}
                  style={{
                    background: 'rgba(123,97,255,0.2)',
                    border: '1px solid rgba(123,97,255,0.4)',
                    borderRadius: '8px',
                    color: '#7b61ff',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                </button>
              </div>
            </div>
          </div>

          <p style={{ color: '#888', fontSize: '12px', marginTop: '14px', marginBottom: 0 }}>
            <i className="bx bx-info-circle" style={{ color: '#0ef', marginRight: '5px' }}></i>
            Last updated: {new Date(credentials.updatedAt).toLocaleString()} · To change, go to <strong style={{ color: '#0ef' }}>Settings → Change Password</strong>
          </p>
        </div>
      )}

      {/* ── PROFILE FORM ── */}
      <h3>
        <i className="bx bx-user-edit"></i> Edit Profile (Saved to MongoDB)
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={profile.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" rows="4" value={profile.bio} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image" value={profile.image} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>CV URL</label>
          <input type="text" name="cv" value={profile.cv} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={profile.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="text" name="github" value={profile.github} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Instagram URL</label>
          <input type="text" name="instagram" value={profile.instagram} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Facebook URL</label>
          <input type="text" name="facebook" value={profile.facebook} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save to MongoDB'}
        </button>
      </form>
    </div>
  );
};

const credCard = {
  background: 'rgba(0,0,0,0.3)',
  borderRadius: '10px',
  padding: '14px 16px',
  border: '1px solid rgba(255,255,255,0.05)',
};

const credLabel = {
  fontSize: '11px',
  color: '#7b61ff',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const credValue = {
  fontSize: '15px',
  color: '#fff',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
};

export default ProfileManager;