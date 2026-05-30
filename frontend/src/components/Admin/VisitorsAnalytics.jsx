import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { visitorService } from '../../services/contactService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0ef', '#00a3c4', '#ffa502', '#ff4757', '#00d68f'];

const VisitorsAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await visitorService.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading analytics...</div>;

  return (
    <div className="form-container">
      <h3>
        <i className="bx bx-stats"></i> Visitor Analytics
      </h3>

      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p>{stats?.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Visitors</h3>
          <p>{stats?.today || 0}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Last 7 Days Visitors</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.last7Days || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ background: '#1e1e3e', border: '1px solid #0ef' }}
              labelStyle={{ color: '#0ef' }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#0ef" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        <div>
          <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Top Countries</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.topCountries || []}
                dataKey="count"
                nameKey="country"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(stats?.topCountries || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Device Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.devices || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
              <XAxis dataKey="device" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ background: '#1e1e3e', border: '1px solid #0ef' }}
                labelStyle={{ color: '#0ef' }}
              />
              <Bar dataKey="count" fill="#0ef" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#0ef', marginBottom: '15px' }}>Recent Visitors</h4>
        <div className="data-table">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Country</th>
                <th>Device</th>
                <th>Browser</th>
                <th>Visit Time</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent?.map((visitor, index) => (
                <tr key={index}>
                  <td>{visitor.ipAddress}</td>
                  <td>{visitor.country}</td>
                  <td>{visitor.deviceType}</td>
                  <td>{visitor.browser}</td>
                  <td>{new Date(visitor.visitDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorsAnalytics;