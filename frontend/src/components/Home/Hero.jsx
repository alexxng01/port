import React from 'react';
import { ReactTyped } from 'react-typed';

const Hero = ({ data }) => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/cv/Rahul Kumar-Mahato.pdf';
    link.download = 'Rahul Kumar-Mahato.pdf';
    link.click();
  };

  if (!data) return null;

  return (
    <section id="home" className="home">
      <div className="home-content">
        <h3>Hello, It's Me</h3>
        <h1>{data.name || 'Rahul Mahato'}</h1>
        <h3>
          And I'm a{' '}
          <ReactTyped
            strings={['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast']}
            typeSpeed={100}
            backSpeed={60}
            loop
            className="typed-text"
          />
        </h3>
        <p>{data.bio || 'Web Developer'}</p>
        <div className="home-sci">
          <a href={data.facebook || '#'} target="_blank" rel="noopener noreferrer">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href={data.instagram || '#'} target="_blank" rel="noopener noreferrer">
            <i className="bx bxl-instagram"></i>
          </a>
          <a href={data.github || '#'} target="_blank" rel="noopener noreferrer">
            <i className="bx bxl-github"></i>
          </a>
          <a href={data.linkedin || '#'} target="_blank" rel="noopener noreferrer">
            <i className="bx bxl-linkedin"></i>
          </a>
        </div>
        <div className="hero-buttons">
          <button className="btn-box" onClick={() => scrollToSection('projects')}>
            View My Projects
          </button>
          <button className="btn-box" onClick={downloadCV}>
            Download CV
          </button>
        </div>
      </div>
      <div className="img">
        <img
          id="profileImage"
          className="round"
          src={data.image || '/images/ME.jpeg'}
          alt={data.name}
          // style={{ width: '370px', height: '370px', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>
    </section>
  );
};

export default Hero;