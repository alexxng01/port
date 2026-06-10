import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      setActiveLink(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsActive(false);
  };

  return (
    <section className="header">
      <a href="#" className="logo">
        Portfolio
      </a>
      <nav className={`navbar ${isActive ? 'active' : ''}`}>
        <a
          href="#home"
          className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          Home
        </a>
        <a
          href="#about"
          className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('about');
          }}
        >
          About
        </a>
        <a
          href="#services"
          className={`nav-link ${activeLink === 'services' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('services');
          }}
        >
          Services
        </a>
        <a
          href="#skills"
          className={`nav-link ${activeLink === 'skills' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('skills');
          }}
        >
          Skills
        </a>
        <a
          href="#projects"
          className={`nav-link ${activeLink === 'projects' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('projects');
          }}
        >
          Projects
        </a>
        <a
          href="#teamwork"
          className={`nav-link ${activeLink === 'teamwork' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('teamwork');
          }}
        >
          TeamWork
        </a>
        <a
          href="#contact"
          className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
        >
          Contact
        </a>
       
      </nav>
      <div className={`burger ${isActive ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </section>
  );
};

export default Header;