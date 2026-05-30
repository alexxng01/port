import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { path: '/admin', icon: 'bxs-dashboard', label: 'Dashboard' },
    { path: '/admin/profile', icon: 'bxs-user', label: 'Profile' },
    { path: '/admin/about', icon: 'bxs-info-circle', label: 'About' },
    { path: '/admin/services', icon: 'bxs-briefcase', label: 'Services' },
    { path: '/admin/skills', icon: 'bxs-cog', label: 'Skills' },
    { path: '/admin/projects', icon: 'bxs-folder-open', label: 'Projects' },
    { path: '/admin/teamwork', icon: 'bxs-group', label: 'TeamWork' },
    { path: '/admin/messages', icon: 'bxs-envelope', label: 'Messages' },
    { path: '/admin/visitors', icon: 'bxs-bar-chart-alt-2', label: 'Visitors' },
    { path: '/admin/settings', icon: 'bxs-cog', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getCurrentPage = () => {
    const current = menuItems.find(item => location.pathname === item.path);
    return current?.label || 'Dashboard';
  };

  const isActivePath = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>
            <i className="bx bx-code-alt"></i>
            {sidebarOpen && <span>MongoDB CMS</span>}
          </h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className={`bx bx-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="bx bx-user-circle"></i>
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <h4>{user?.name || 'Admin'}</h4>
              <p>{user?.email || 'admin@example.com'}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <i className={`bx ${item.icon}`}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav-link">
            <i className="bx bxs-show"></i>
            {sidebarOpen && <span>View Site</span>}
          </a>
          <a href="#" className="nav-link" onClick={handleLogout}>
            <i className="bx bxs-log-out"></i>
            {sidebarOpen && <span>Logout</span>}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${!sidebarOpen ? 'expanded' : ''}`}>
        <div className="admin-header">
          <div className="page-title">
            <h2>{getCurrentPage()}</h2>
          </div>
          <div className="admin-actions">
            <div className="admin-time">
              <i className="bx bx-time"></i>
              <span>{currentTime}</span>
            </div>
            <div className="admin-notifications">
              <i className="bx bx-bell"></i>
            </div>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;