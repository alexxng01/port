import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5002/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Logging in with:', email);
      
      const response = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Login failed');
      } else if (error.request) {
        toast.error('Cannot connect to server. Make sure backend is running on port 5002');
      } else {
        toast.error('Login failed');
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};