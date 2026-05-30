import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';

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

  useEffect(() => {
    fetchProfile();
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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
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

export default ProfileManager;