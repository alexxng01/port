import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '../../services/contactService';

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact">
        <div className="contact-form">
          <h2>
            Contact <span>Me</span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-box" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h3>
            <i className="bx bx-info-circle"></i> Get in Touch
          </h3>
          <p>
            <i className="bx bx-envelope"></i> {profile?.email || 'rm91275@gmail.com'}
          </p>
          <p>
            <i className="bx bx-phone"></i> {profile?.phone || '+977 98XXXXXXXX'}
          </p>
          <p>
            <i className="bx bx-map"></i> {profile?.address || 'Kathmandu, Nepal'}
          </p>
          <div className="social-icons">
            <a href={profile?.facebook || '#'} target="_blank" rel="noopener noreferrer">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href={profile?.instagram || '#'} target="_blank" rel="noopener noreferrer">
              <i className="bx bxl-instagram"></i>
            </a>
            <a href={profile?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
              <i className="bx bxl-linkedin"></i>
            </a>
            <a href={profile?.github || '#'} target="_blank" rel="noopener noreferrer">
              <i className="bx bxl-github"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;