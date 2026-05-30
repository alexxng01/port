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
import { portfolioService } from '../services/portfolioService';
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
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackVisitor = async () => {
    try {
      const visitorData = {
        deviceType: getDeviceType(),
        browser: getBrowser(),
        pageVisited: window.location.pathname,
        referrer: document.referrer,
      };
      await visitorService.trackVisitor(visitorData);
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  };

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  };

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
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