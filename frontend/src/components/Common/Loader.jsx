import React from 'react';

const Loader = () => {
  return (
    <div className="loader" style={{ textAlign: 'center', padding: '50px', color: '#0ef' }}>
      <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '40px' }}></i>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;