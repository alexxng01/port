import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'bxs-dashboard', label: 'Dashboard' },
    { id: 'profile', icon: 'bxs-user', label: 'Profile' },
    { id: 'about', icon: 'bxs-info-circle', label: 'About' },
    { id: 'services', icon: 'bxs-briefcase', label: 'Services' },
    { id: 'skills', icon: 'bxs-cog', label: 'Skills' },
    { id: 'projects', icon: 'bxs-folder-open', label: 'Projects' },
    { id: 'teamwork', icon: 'bxs-group', label: 'TeamWork' },
    { id: 'messages', icon: 'bxs-envelope', label: 'Messages' },
    { id: 'visitors', icon: 'bxs-bar-chart-alt-2', label: 'Visitors' },
  ];

  return (
    <div className="sidebar">
      <h2>
        <i className="bx bx-code-alt"></i> <span>MongoDB CMS</span>
      </h2>
      <nav>
        {menuItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(item.id);
            }}
          >
            <i className={`bx ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
        ))}
        <a href="/" target="_blank">
          <i className="bx bxs-show"></i> <span>View Site</span>
        </a>
        <a href="#" onClick={onLogout}>
          <i className="bx bxs-log-out"></i> <span>Logout</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;