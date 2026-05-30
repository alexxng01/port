import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import ProfileManager from './components/Admin/ProfileManager';
import AboutManager from './components/Admin/AboutManager';
import ServicesManager from './components/Admin/ServicesManager';
import SkillsManager from './components/Admin/SkillsManager';
import ProjectsManager from './components/Admin/ProjectsManager';
import TeamworkManager from './components/Admin/TeamworkManager';
import MessagesManager from './components/Admin/MessagesManager';
import VisitorsAnalytics from './components/Admin/VisitorsAnalytics';
import SettingsManager from './components/Admin/SettingsManager';

// Route configuration
export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <ProfileManager />,
      },
      {
        path: 'about',
        element: <AboutManager />,
      },
      {
        path: 'services',
        element: <ServicesManager />,
      },
      {
        path: 'skills',
        element: <SkillsManager />,
      },
      {
        path: 'projects',
        element: <ProjectsManager />,
      },
      {
        path: 'teamwork',
        element: <TeamworkManager />,
      },
      {
        path: 'messages',
        element: <MessagesManager />,
      },
      {
        path: 'visitors',
        element: <VisitorsAnalytics />,
      },
      {
        path: 'settings',
        element: <SettingsManager />,
      },
    ],
  },
];

// Create router instance
export const router = createBrowserRouter(routes);

// Navigation helper
export const navigateTo = (navigate, path, options = {}) => {
  navigate(path, options);
};

// Get current route path
export const getCurrentPath = () => {
  return window.location.pathname;
};

// Check if current route matches
export const isActiveRoute = (path) => {
  return window.location.pathname === path;
};

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_ABOUT: '/admin/about',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_SKILLS: '/admin/skills',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_TEAMWORK: '/admin/teamwork',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_VISITORS: '/admin/visitors',
  ADMIN_SETTINGS: '/admin/settings',
};

export default router;