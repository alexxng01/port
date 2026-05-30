import React, { useEffect } from 'react';

const Skills = ({ technicalSkills, professionalSkills }) => {
  useEffect(() => {
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-line span');
    progressBars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });

    // Animate radial bars
    const radialBars = document.querySelectorAll('.path');
    radialBars.forEach((bar) => {
      const offset = bar.getAttribute('data-offset');
      if (offset) {
        bar.style.strokeDashoffset = offset;
      }
    });
  }, [technicalSkills, professionalSkills]);

  return (
    <section id="skills">
      <h1 className="sub-title">
        My <span>Skills</span>
      </h1>
      <div className="container1">
        <div className="Techinical-bars" id="technicalSkills">
          {technicalSkills && technicalSkills.length > 0 ? (
            <div className="skill-category">
              <h3 className="category-title">
                <i className="bx bx-code-alt"></i> Technical Skills
              </h3>
              {technicalSkills.map((skill) => (
                <div className="bar" key={skill.id}>
                  <i className={skill.icon || 'bx bx-code'}></i>
                  <div className="indfo">
                    <span>{skill.name}</span>
                  </div>
                  <div className="progress-line">
                    <span style={{ width: `${skill.level}%` }}></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No technical skills added yet.</div>
          )}
        </div>

        <div className="radial-bars" id="professionalSkills">
          {professionalSkills && professionalSkills.length > 0 ? (
            professionalSkills.map((skill) => {
              const offset = 502 - (502 * skill.level) / 100;
              return (
                <div className="radial-bar" key={skill.id}>
                  <svg viewBox="0 0 200 200">
                    <circle className="progress-bar" cx="100" cy="100" r="80"></circle>
                    <circle
                      className="path"
                      cx="100"
                      cy="100"
                      r="80"
                      data-offset={offset}
                      style={{ strokeDashoffset: offset }}
                    ></circle>
                  </svg>
                  <div className="percentage">{skill.level}%</div>
                  <div className="text">{skill.name}</div>
                </div>
              );
            })
          ) : (
            <div className="no-data">No professional skills added yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;