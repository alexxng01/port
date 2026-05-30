import React from 'react';

const Projects = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <section id="projects">
        <div className="main-text">
          <h2>
            Latest <span>Projects</span>
          </h2>
          <div className="portfolio-content">
            <div className="no-data">
              No projects added yet. <a href="/login">Admin login</a> to add.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <div className="main-text">
        <h2>
          Latest <span>Projects</span>
        </h2>
        <div className="portfolio-content">
          {data.map((project) => (
            <div className="row" key={project.id}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.insertAdjacentHTML(
                      'afterbegin',
                      `<div class="img-fallback" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <i class="bx bx-code-alt" style="font-size:60px;"></i>
                        <span>${project.title}</span>
                      </div>`
                    );
                  }}
                />
              ) : (
                <div className="img-fallback" style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bx bx-code-alt" style={{ fontSize: '60px' }}></i>
                  <span>{project.title}</span>
                </div>
              )}
              <div className="layer">
                <h5>{project.title}</h5>
                <p>{project.description.substring(0, 100)}...</p>
                <div className="project-tech">
                  {(project.technologies || []).map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;