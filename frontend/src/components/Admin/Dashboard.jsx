import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { contactService, visitorService } from '../../services/contactService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, messagesRes, statsRes] = await Promise.all([
        portfolioService.getPortfolio(),
        contactService.getMessages(),
        visitorService.getStats(),
      ]);

      setPortfolio(portfolioRes.data);
      setMessages(messagesRes.data);
      setVisitorStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDateTime = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  };

  if (loading) return <div className="loader">Loading dashboard...</div>;

  const dateTime = getDateTime();
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-text">
          <h3>
            <i className="bx bx-smile"></i> {getGreeting()}, {user?.name}!
          </h3>
          <p>Welcome to MongoDB Portfolio CMS</p>
        </div>
        <div className="date-time">
          <div className="time">{dateTime.time}</div>
          <div className="date">{dateTime.date}</div>
        </div>
      </div>

      <div className="login-info">
        <div>
          <i className="bx bx-user-circle"></i> <strong>Logged in as:</strong> {user?.name}
        </div>
        <div>
          <i className="bx bx-envelope"></i> <strong>Email:</strong> {user?.email}
        </div>
        <div>
          <i className="bx bx-data"></i> <strong>Database:</strong>{' '}
          <span className="db-status db-online"></span> MongoDB Atlas
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p>{visitorStats?.data?.total || 0}</p>
          <small>Today: {visitorStats?.data?.today || 0}</small>
        </div>
        <div className="stat-card">
          <h3>Contact Messages</h3>
          <p>{messages.length}</p>
          <small>Unread: {unreadMessages}</small>
        </div>
        <div className="stat-card">
          <h3>Services</h3>
          <p>{portfolio?.services?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <p>{portfolio?.projects?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Skills</h3>
          <p>
            {(portfolio?.technicalSkills?.length || 0) + (portfolio?.professionalSkills?.length || 0)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Team Work</h3>
          <p>{portfolio?.teamwork?.length || 0}</p>
        </div>
      </div>

      <div className="form-container">
        <h3>
          <i className="bx bx-data"></i> MongoDB Database
        </h3>
        <p>All data is stored in MongoDB Atlas cloud database. Changes are instant and persistent!</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', margin: '15px 0' }}>
          <div>
            <strong>📊 Database:</strong> MongoDB Atlas
          </div>
          <div>
            <strong>🌍 Hosted on:</strong> AWS Cloud
          </div>
          <div>
            <strong>🔒 Security:</strong> Enabled
          </div>
          <div>
            <strong>💾 Storage:</strong> Cloud-based (persistent)
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;