import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import './styles/globals.css';
import './styles/responsive.css';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e3e',
            color: '#fff',
            border: '1px solid #0ef',
          },
          success: {
            iconTheme: {
              primary: '#00d68f',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4757',
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;