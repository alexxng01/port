import React, { useState, useEffect } from 'react';

const Alert = ({ type, message, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bx bx-check-circle';
      case 'error':
        return 'bx bx-error-circle';
      case 'warning':
        return 'bx bx-error';
      case 'info':
        return 'bx bx-info-circle';
      default:
        return 'bx bx-info-circle';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #00d68f, #00b37e)';
      case 'error':
        return 'linear-gradient(135deg, #ff4757, #e8413e)';
      case 'warning':
        return 'linear-gradient(135deg, #ffa502, #e67e22)';
      default:
        return 'linear-gradient(135deg, #0ef, #00a3c4)';
    }
  };

  return (
    <div
      className="custom-alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        background: getBgColor(),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        maxWidth: '400px',
      }}
    >
      <i className={getIcon()} style={{ fontSize: '24px' }}></i>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '18px',
        }}
      >
        <i className="bx bx-x"></i>
      </button>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

// Alert Provider component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

export const AlertContext = React.createContext();

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export default Alert;