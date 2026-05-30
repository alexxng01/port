import React from 'react';

const Teamwork = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <section id="teamwork">
        <div className="main-text">
          <h2>
            Team <span>Work</span>
          </h2>
          <div className="portfolio-content">
            <div className="no-data">No teamwork entries added yet.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="teamwork">
      <div className="main-text">
        <h2>
          Team <span>Work</span>
        </h2>
        <div className="portfolio-content">
          {data.map((item) => (
            <div className="row" key={item.id}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.insertAdjacentHTML(
                      'afterbegin',
                      `<div class="img-fallback" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <i class="bx bx-group" style="font-size:60px;"></i>
                        <span>${item.title}</span>
                      </div>`
                    );
                  }}
                />
              ) : (
                <div className="img-fallback" style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bx bx-group" style={{ fontSize: '60px' }}></i>
                  <span>{item.title}</span>
                </div>
              )}
              <div className="layer">
                <h5>{item.title}</h5>
                <p>{item.description.substring(0, 100)}...</p>
                <p>
                  <small>
                    <i className="bx bx-user"></i> Role: {item.role || 'Member'}
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teamwork;