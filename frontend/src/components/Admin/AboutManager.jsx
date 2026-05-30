import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { portfolioService } from '../../services/portfolioService';

const AboutManager = () => {
  const [about, setAbout] = useState({ mainText: '', paragraphs: ['', '', ''] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      setAbout(response.data.about || { mainText: '', paragraphs: ['', '', ''] });
    } catch (error) {
      toast.error('Failed to load about section');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAbout({ ...about, [field]: value });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...(about.paragraphs || ['', '', ''])];
    newParagraphs[index] = value;
    setAbout({ ...about, paragraphs: newParagraphs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portfolioService.updateAbout(about);
      toast.success('About section saved successfully!');
    } catch (error) {
      toast.error('Failed to save about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading about section...</div>;

  return (
    <div className="form-container">
      <h3>
        <i className="bx bx-info-circle"></i> Edit About Section (Saved to MongoDB)
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subtitle / Main Text</label>
          <input
            type="text"
            value={about.mainText || ''}
            onChange={(e) => handleChange('mainText', e.target.value)}
            placeholder="e.g., Full Stack Developer"
          />
        </div>
        <div className="form-group">
          <label>Paragraph 1</label>
          <textarea
            rows="4"
            value={about.paragraphs?.[0] || ''}
            onChange={(e) => handleParagraphChange(0, e.target.value)}
            placeholder="First paragraph about yourself..."
          />
        </div>
        <div className="form-group">
          <label>Paragraph 2</label>
          <textarea
            rows="4"
            value={about.paragraphs?.[1] || ''}
            onChange={(e) => handleParagraphChange(1, e.target.value)}
            placeholder="Second paragraph about yourself..."
          />
        </div>
        <div className="form-group">
          <label>Paragraph 3</label>
          <textarea
            rows="4"
            value={about.paragraphs?.[2] || ''}
            onChange={(e) => handleParagraphChange(2, e.target.value)}
            placeholder="Third paragraph about yourself..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save to MongoDB'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', background: '#2a2a4a', borderRadius: '10px' }}>
        <h4 style={{ color: '#0ef', marginBottom: '10px' }}>Preview:</h4>
        <div style={{ color: '#fff' }}>
          <h4 style={{ color: '#0ef' }}>{about.mainText || 'Your subtitle here'}</h4>
          {(about.paragraphs || []).map((p, i) => (
            <p key={i} style={{ marginTop: '10px' }}>{p || `Paragraph ${i + 1} will appear here`}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutManager;