import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Services from '../components/Home/Services';
import Skills from '../components/Home/Skills';
import Projects from '../components/Home/Projects';
import Teamwork from '../components/Home/Teamwork';
import Contact from '../components/Home/Contact';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Common/Loader';
import portfolioService from '../services/portfolioService';
import { visitorService } from '../services/contactService';

const HomePage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    trackVisitor();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioService.getPortfolio();
      if (response.success) {
        setPortfolio(response.data);
      } else {
        console.error('Failed to fetch portfolio:', response.message);
        // Set empty data structure to avoid errors
        setPortfolio({
          profile: {},
          about: {},
          services: [],
          technicalSkills: [],
          professionalSkills: [],
          projects: [],
          teamwork: []
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackVisitor = async () => {
    try {
      const ua = navigator.userAgent;
      let deviceType = 'Desktop';
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) deviceType = 'Tablet';
      else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle/i.test(ua)) deviceType = 'Mobile';
      
      let browser = 'Unknown';
      if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Safari')) browser = 'Safari';
      else if (ua.includes('Edge')) browser = 'Edge';
      
      await visitorService.trackVisitor({ 
        deviceType, 
        browser, 
        pageVisited: window.location.pathname, 
        referrer: document.referrer 
      });
    } catch (error) {
      // Silently fail - visitor tracking is not critical
      console.log('Visitor tracking not available');
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <Hero data={portfolio?.profile} />
      <About data={portfolio?.about} />
      <Services data={portfolio?.services} />
      <Skills 
        technicalSkills={portfolio?.technicalSkills} 
        professionalSkills={portfolio?.professionalSkills} 
      />
      <Projects data={portfolio?.projects} />
      <Teamwork data={portfolio?.teamwork} />
      <Contact profile={portfolio?.profile} />
      <Footer />
    </>
  );
};

export default HomePage;