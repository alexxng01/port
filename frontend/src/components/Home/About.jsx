import React from 'react';

const About = ({ data }) => {
  if (!data) return null;

  return (
    <section id="about" className="about">
      <div className="about-text">
        <div className="abo">
          <h2>
            About <span>Me</span>
          </h2>
          <div id="aboutContent">
            <h4>{data.mainText || 'Full Stack Developer'}</h4>
          </div>
        </div>
        <div className="para" id="aboutParagraphs">
          <div className="first">
            {(data.paragraphs || ['Loading...']).map((paragraph, index) => (
              <p key={index} className="about-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <a href="#" className="btn-box">
          More About Me
        </a>
      </div>
    </section>
  );
};

export default About;