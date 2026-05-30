import React from 'react';

const Services = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <section id="services" className="services">
        <div className="container">
          <h1 className="sub-title">
            My <span>Services</span>
          </h1>
          <div className="services-list">
            <div className="no-data">No services added yet.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services">
      <div className="container">
        <h1 className="sub-title">
          My <span>Services</span>
        </h1>
        <div className="services-list">
          {data.map((service) => (
            <div key={service.id}>
              <i className={service.icon} style={{ color: '#08f6d9', fontSize: '50px' }}></i>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <a href="#" className="read">
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;