import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaCarSide, FaTools, FaThumbsUp, FaUserCheck, FaUsers, FaHeadset } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import SEO from '../components/SEO';
import { renderWithVicar } from '../components/VicarWord';
import ContactUsButton from '../components/ContactUsButton';
import FloatingCarButton from '../components/FloatingCarButton';
import RotatingText from '../animation/RotatingText';
import AnimatedContent from '../animation/AnimatedContent';
import RedLine from '../components/RedLine';
import './AboutUs.css';

const DEFAULT_HERO_IMAGE = '/image/page_background/aboutUsBg.jpeg';

function AboutUs() {
  const { t } = useTranslation();
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const pillars = [
    { id: 'v', letter: 'V', titleKey: 'brandStory.vTitle' },
    { id: 'i', letter: 'i', titleKey: 'brandStory.iTitle' },
    { id: 'c', letter: 'C', titleKey: 'brandStory.cTitle' },
    { id: 'a', letter: 'A', titleKey: 'brandStory.aTitle' },
    { id: 'r', letter: 'R', titleKey: 'brandStory.rTitle' },
  ];

  const activePillar = pillars[activePillarIndex] ?? pillars[0];

  const renderPillarDetails = (pillarId) => {
    if (pillarId === 'v') {
      return (
        <div className="about-pillar-detail-card">
          <div className="about-pillar-detail-letter">V</div>
          <h3 className="about-pillar-detail-title">{t('brandStory.vTitle')}</h3>
          <p className="about-pillar-detail-description">{t('brandStory.vDescription')}</p>

          <div className="about-pillar-detail-section">
            <h4 className="about-pillar-detail-section-title">{t('brandStory.vServicesTitle')}</h4>
            <ul className="about-pillar-detail-list">
              <li>{t('brandStory.vService1')}</li>
              <li>{t('brandStory.vService2')}</li>
              <li>{t('brandStory.vService3')}</li>
              <li>{t('brandStory.vService4')}</li>
              <li>{t('brandStory.vService5')}</li>
            </ul>
          </div>

          <p className="about-pillar-detail-footer">{t('brandStory.vFooter')}</p>
        </div>
      );
    }

    if (pillarId === 'i') {
      return (
        <div className="about-pillar-detail-card">
          <div className="about-pillar-detail-letter"><span className="vicar-i">i</span></div>
          <h3 className="about-pillar-detail-title">{t('brandStory.iTitle')}</h3>
          <p className="about-pillar-detail-description">{t('brandStory.iDescription')}</p>

          <div className="about-pillar-detail-section">
            <ul className="about-pillar-detail-list">
              <li>
                <strong className="about-pillar-detail-bullet-title">{t('brandStory.iPoint1Label')}</strong>
                <span className="about-pillar-detail-bullet-text"> — {t('brandStory.iPoint1Text')}</span>
              </li>
              <li>
                <strong className="about-pillar-detail-bullet-title">{t('brandStory.iPoint2Label')}</strong>
                <span className="about-pillar-detail-bullet-text"> — {t('brandStory.iPoint2Text')}</span>
              </li>
              <li>
                <strong className="about-pillar-detail-bullet-title">{t('brandStory.iPoint3Label')}</strong>
                <span className="about-pillar-detail-bullet-text"> — {t('brandStory.iPoint3Text')}</span>
              </li>
              <li>
                <strong className="about-pillar-detail-bullet-title">{t('brandStory.iPoint4Label')}</strong>
                <span className="about-pillar-detail-bullet-text"> — {t('brandStory.iPoint4Text')}</span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (pillarId === 'c') {
      return (
        <div className="about-pillar-detail-card">
          <div className="about-pillar-detail-letter">C</div>
          <h3 className="about-pillar-detail-title">{t('brandStory.cTitle')}</h3>
          <p className="about-pillar-detail-description">{t('brandStory.cDescription')}</p>

          <div className="about-pillar-detail-section">
            <h4 className="about-pillar-detail-section-title">{t('brandStory.cStandardsTitle')}</h4>
            <ul className="about-pillar-detail-list">
              <li>{t('brandStory.cStandard1')}</li>
              <li>{t('brandStory.cStandard2')}</li>
              <li>{t('brandStory.cStandard3')}</li>
              <li>{t('brandStory.cStandard4')}</li>
              <li>{t('brandStory.cStandard5')}</li>
            </ul>
          </div>

          <p className="about-pillar-detail-footer">{t('brandStory.cFooter')}</p>
        </div>
      );
    }

    if (pillarId === 'a') {
      return (
        <div className="about-pillar-detail-card">
          <div className="about-pillar-detail-letter">A</div>
          <h3 className="about-pillar-detail-title">{t('brandStory.aTitle')}</h3>
          <p className="about-pillar-detail-description">{t('brandStory.aDescription')}</p>

          <div className="about-pillar-detail-section">
            <ul className="about-pillar-detail-list">
              <li>{t('brandStory.aFeature1')}</li>
              <li>{t('brandStory.aFeature2')}</li>
              <li>{t('brandStory.aFeature3')}</li>
              <li>{t('brandStory.aFeature4')}</li>
              <li>{t('brandStory.aFeature5')}</li>
              <li>{t('brandStory.aFeature6')}</li>
            </ul>
          </div>

          <p className="about-pillar-detail-footer">{t('brandStory.aFooter')}</p>
        </div>
      );
    }

    if (pillarId === 'r') {
      return (
        <div className="about-pillar-detail-card">
          <div className="about-pillar-detail-letter">R</div>
          <h3 className="about-pillar-detail-title">{t('brandStory.rTitle')}</h3>
          <p className="about-pillar-detail-description">{t('brandStory.rDescription')}</p>

          <div className="about-pillar-detail-section">
            <h4 className="about-pillar-detail-section-title">{t('brandStory.rScenariosTitle')}</h4>
            <ul className="about-pillar-detail-list">
              <li>{t('brandStory.rScenario1')}</li>
              <li>{t('brandStory.rScenario2')}</li>
              <li>{t('brandStory.rScenario3')}</li>
              <li>{t('brandStory.rScenario4')}</li>
              <li>{t('brandStory.rScenario5')}</li>
            </ul>
          </div>

          <p className="about-pillar-detail-footer">{t('brandStory.rFooter')}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="about-page" style={{backgroundColor: '#111111', color: '#f5f5f5', minHeight: '100vh'}}>
      <SEO
        title="About Us"
        description="Learn about Vicar - Premium Mobility. Our VICAR pillars: Vehicle services, Innovation, Customer focus, Assurance, and Reliability in Malaysia."
        path="/about"
        priority={0.8}
      />
      {/* Header Component */}
      <VicarHeader currentPage="about" />

      <main className="main-content" style={{backgroundColor: '#111111', color: '#f5f5f5'}}>
        {/* Hero Section - default image only */}
        <section className="hero-section">
          <div className="hero-background">
            <img
              src={DEFAULT_HERO_IMAGE}
              alt="aboutUsBg"
              className="hero-bg-image"
              crossOrigin="anonymous"
            />
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t('about.heroTitle')}</h1>
            <p className="hero-subtitle">{t('about.heroSubtitle')}</p>
          </div>
        </section>

        {/* Our Promise to You Section (from Brand Story) */}
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-image">
                <img 
                  src="/alphard our story.png" 
                  alt="Vicar Story" 
                  className="story-img"
                />
              </div>
              <div className="story-content">
                <h2 className="story-title">
                  {(() => {
                    const title = t('brandStory.introTitle');
                    if (title === 'Our Promise to You') {
                      return (
                        <>
                          <span style={{ color: '#f5f5f5' }}>Our </span>
                          <span style={{ color: '#8E1B1E' }}>Promise</span>
                          <span style={{ color: '#f5f5f5' }}> to You</span>
                        </>
                      );
                    } else if (title === '我们的承诺') {
                      return (
                        <>
                          <span style={{ color: '#f5f5f5' }}>我们的</span>
                          <span style={{ color: '#8E1B1E' }}>承诺</span>
                        </>
                      );
                    }
                    return title;
                  })()}
                </h2>
                <p className="story-text">
                  {t('brandStory.introText')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mission-vision-section">
          <div className="container">
            <div className="mission-vision-grid">
              <div className="mission-vision-card mission-card">
                <h3 className="card-title">{t('about.missionTitle')}</h3>
                <p className="card-content">
                  {t('about.missionText')}
                </p>
              </div>
              <div className="mission-vision-card vision-card">
                <h3 className="card-title">{t('about.visionTitle')}</h3>
                <p className="card-content">
                  {t('about.visionText')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Five Pillars of ViCAR (cloned from BrandStory, redesigned) */}
        <section className="about-pillars-section">
          <div className="container">
            <div className="about-pillars-header">
              <h2 className="about-pillars-title">{renderWithVicar(t('brandStory.coreConceptsTitle'))}</h2>
              <p className="about-pillars-subtitle">{t('brandStory.coreConceptsSubtitle')}</p>
            </div>

            <div className="about-pillars-layout">
              <div className="about-pillars-rail" aria-label={t('brandStory.coreConceptsTitle')}>
                {pillars.map((pillar, idx) => {
                  const isActive = idx === activePillarIndex;

                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      className={`about-pillar-tile ${isActive ? 'active' : ''}`}
                      onClick={() => setActivePillarIndex(idx)}
                      onMouseEnter={() => setActivePillarIndex(idx)}
                      aria-pressed={isActive}
                    >
                      <div className="about-pillar-letter">{pillar.letter === 'i' ? <span className="vicar-i">i</span> : pillar.letter}</div>
                      <div className="about-pillar-title">{t(pillar.titleKey)}</div>
                    </button>
                  );
                })}
              </div>

              <div className="about-pillars-detail" aria-live="polite">
                {renderPillarDetails(activePillar?.id)}
              </div>
            </div>
          </div>
        </section>

        <RedLine />

        {/* Our Core Values + One Platform (from Brand Story, redesigned) */}
        <section className="about-core-values-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('brandStory.coreValuesTitle')}</h2>
            </div>

            <div className="about-values-grid">
              {[1, 2, 3, 4, 5].map((n, idx) => (
                <AnimatedContent
                  key={n}
                  distance={40}
                  direction="vertical"
                  reverse={false}
                  duration={1.2}
                  ease="power2.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={0.98}
                  threshold={0.25}
                  delay={0.06 + idx * 0.06}
                >
                  <div className="about-value-card">
                    <div className="about-value-top">
                      <span className="about-value-num">{String(n).padStart(2, '0')}</span>
                      <span className="about-value-hairline" aria-hidden="true"></span>
                    </div>
                    <h3 className="about-value-title">{t(`brandStory.value${n}Title`)}</h3>
                    <p className="about-value-desc">{t(`brandStory.value${n}Desc`)}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

    
        <section className="about-platform-section">
          <div className="container">
            <AnimatedContent
              distance={40}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power2.out"
              initialOpacity={0}
              animateOpacity
              scale={0.99}
              threshold={0.2}
            >
              <div className="about-platform-card">
                <h2 className="about-platform-title">{t('brandStory.platformTitle')}</h2>
                <div className="about-platform-services">
                  <div className="about-platform-service">{t('brandStory.platformService1')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService2')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService3')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService4')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService5')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService6')}</div>
                  <div className="about-platform-service">{t('brandStory.platformService7')}</div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>

        <RedLine />

        {/* Why Choose Us Section */}
        <section className="features-section" style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{renderWithVicar(t('about.whyChooseTitle'))}</h2>
              <p className="section-subtitle">{t('about.whyChooseSubtitle')}</p>
            </div>
            
            <div className="features-grid">
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.1}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaCar className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature1Title')}</h3>
                  <p className="feature-description">{t('about.feature1Desc')}</p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.2}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaCarSide className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature2Title')}</h3>
                  <p className="feature-description">{t('about.feature2Desc')}</p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.3}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaTools className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature3Title')}</h3>
                  <p className="feature-description">{t('about.feature3Desc')}</p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.4}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaThumbsUp className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature4Title')}</h3>
                  <p className="feature-description">{t('about.feature4Desc')}</p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.5}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaHeadset className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature5Title')}</h3>
                  <p className="feature-description">{t('about.feature5Desc')}</p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.6}
              >
                <div 
                  className="feature-card"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <FaUserCheck className="feature-icon" />
                  <h3 className="feature-title">{t('about.feature6Title')}</h3>
                  <p className="feature-description">{t('about.feature6Desc')}</p>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" style={{background: 'linear-gradient(to right, #8E1B1E, #261111)'}}>
          <div className="container">
            <h2 className="cta-title">{t('about.ctaTitle')}</h2>
            <p className="cta-subtitle">{t('about.ctaSubtitle')}</p>
            <div className="cta-buttons">
               {/*
              <a href="https://app.kw99.com.my/app-browse?brand=&model=&bodyType=&fromPrice=0&toPrice=2000000&fromYear=2012&toYear=2024&fromMileage=0&toMileage=200000&availability=&condition=&transmissions=&color=&keyword=&sort=created_at&order=desc" target="_blank" rel="noopener noreferrer" className="cta-btn secondary">{t('about.exploreCars')}</a>
              */}
              <a href="https://api.whatsapp.com/send/?phone=601155532999&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="cta-btn secondary">{t('about.contactUs')}</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />

    </div>
  );
}

export default AboutUs; 