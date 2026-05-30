import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/Admin/Dashboard';
import ProfileManager from '../components/Admin/ProfileManager';
import AboutManager from '../components/Admin/AboutManager';
import ServicesManager from '../components/Admin/ServicesManager';
import SkillsManager from '../components/Admin/SkillsManager';
import ProjectsManager from '../components/Admin/ProjectsManager';
import TeamworkManager from '../components/Admin/TeamworkManager';
import MessagesManager from '../components/Admin/MessagesManager';
import VisitorsAnalytics from '../components/Admin/VisitorsAnalytics';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
        user={user}
      />
      <div className="admin-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="profile" element={<ProfileManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="teamwork" element={<TeamworkManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="visitors" element={<VisitorsAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;