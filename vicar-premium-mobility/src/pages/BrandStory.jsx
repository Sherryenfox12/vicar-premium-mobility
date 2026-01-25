import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import AnimatedContent from '../animation/AnimatedContent';
import Hyperspeed from '../animation/Hyperspeed';
import RedLine from '../components/RedLine';
import './BrandStory.css';

function BrandStory() {
  const { t } = useTranslation();
  
  // Banner media state
  const [bannerMedia, setBannerMedia] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [lockedConceptIndex, setLockedConceptIndex] = useState(null);
  const [hoverConceptIndex, setHoverConceptIndex] = useState(null);
  
  // Logo floating animation state
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });

  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;

  // Memoize effectOptions to prevent animation restart
  const hyperspeedOptions = useMemo(() => ({
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 500,
    roadWidth: 10,
    islandWidth: 3,
    lanesPerRoad: 5,
    fov: 90,
    fovSpeedUp: 500,
    speedUp: 1,
    carLightsFade: 0.4,
    totalSideLightSticks: 800,
    lightPairsPerRoadWay: 70,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [40, 60],
    movingCloserSpeed: [-80, -120],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xff0000,
      brokenLines: 0xff0000,
      leftCars: [0xff0000, 0x8b00ff, 0xff1493],
      rightCars: [0x00ffff, 0x0080ff, 0x4169e1],
      sticks: 0x00ffff
    }
  }), []);
  
  const concepts = [
    { id: 'v', letter: 'V', titleKey: 'brandStory.vTitle' },
    { id: 'i', letter: 'i', titleKey: 'brandStory.iTitle' },
    { id: 'c', letter: 'C', titleKey: 'brandStory.cTitle' },
    { id: 'a', letter: 'A', titleKey: 'brandStory.aTitle' },
    { id: 'r', letter: 'R', titleKey: 'brandStory.rTitle' },
  ];

  const activeConceptIndex = hoverConceptIndex ?? lockedConceptIndex ?? 0;
  const activeConcept = concepts[activeConceptIndex] ?? concepts[0];

  const renderConceptDetails = (conceptId) => {
    if (conceptId === 'v') {
      return (
        <div className="concept-card">
          <div className="concept-letter">V</div>
          <h3 className="concept-title">{t('brandStory.vTitle')}</h3>
          <p className="concept-description">{t('brandStory.vDescription')}</p>
          <div className="concept-services">
            <h4 className="concept-services-title">{t('brandStory.vServicesTitle')}</h4>
            <ul className="concept-services-list">
              <li>{t('brandStory.vService1')}</li>
              <li>{t('brandStory.vService2')}</li>
              <li>{t('brandStory.vService3')}</li>
              <li>{t('brandStory.vService4')}</li>
              <li>{t('brandStory.vService5')}</li>
            </ul>
          </div>
          <p className="concept-footer">{t('brandStory.vFooter')}</p>
        </div>
      );
    }

    if (conceptId === 'i') {
      return (
        <div className="concept-card">
          <div className="concept-letter">i</div>
          <h3 className="concept-title">{t('brandStory.iTitle')}</h3>
          <p className="concept-description">{t('brandStory.iDescription')}</p>
          <div className="concept-services">
            <ul className="concept-services-list">
              <li>
                <strong className="concept-bullet-title">{t('brandStory.iPoint1Label')}</strong>
                <span className="concept-bullet-text"> — {t('brandStory.iPoint1Text')}</span>
              </li>
              <li>
                <strong className="concept-bullet-title">{t('brandStory.iPoint2Label')}</strong>
                <span className="concept-bullet-text"> — {t('brandStory.iPoint2Text')}</span>
              </li>
              <li>
                <strong className="concept-bullet-title">{t('brandStory.iPoint3Label')}</strong>
                <span className="concept-bullet-text"> — {t('brandStory.iPoint3Text')}</span>
              </li>
              <li>
                <strong className="concept-bullet-title">{t('brandStory.iPoint4Label')}</strong>
                <span className="concept-bullet-text"> — {t('brandStory.iPoint4Text')}</span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (conceptId === 'c') {
      return (
        <div className="concept-card">
          <div className="concept-letter">C</div>
          <h3 className="concept-title">{t('brandStory.cTitle')}</h3>
          <p className="concept-description">{t('brandStory.cDescription')}</p>
          <div className="concept-services">
            <h4 className="concept-services-title">{t('brandStory.cStandardsTitle')}</h4>
            <ul className="concept-services-list">
              <li>{t('brandStory.cStandard1')}</li>
              <li>{t('brandStory.cStandard2')}</li>
              <li>{t('brandStory.cStandard3')}</li>
              <li>{t('brandStory.cStandard4')}</li>
              <li>{t('brandStory.cStandard5')}</li>
            </ul>
          </div>
          <p className="concept-footer">{t('brandStory.cFooter')}</p>
        </div>
      );
    }

    if (conceptId === 'a') {
      return (
        <div className="concept-card">
          <div className="concept-letter">A</div>
          <h3 className="concept-title">{t('brandStory.aTitle')}</h3>
          <p className="concept-description">{t('brandStory.aDescription')}</p>
          <div className="concept-services">
            <ul className="concept-services-list">
              <li>{t('brandStory.aFeature1')}</li>
              <li>{t('brandStory.aFeature2')}</li>
              <li>{t('brandStory.aFeature3')}</li>
              <li>{t('brandStory.aFeature4')}</li>
              <li>{t('brandStory.aFeature5')}</li>
              <li>{t('brandStory.aFeature6')}</li>
            </ul>
          </div>
          <p className="concept-footer">{t('brandStory.aFooter')}</p>
        </div>
      );
    }

    if (conceptId === 'r') {
      return (
        <div className="concept-card">
          <div className="concept-letter">R</div>
          <h3 className="concept-title">{t('brandStory.rTitle')}</h3>
          <p className="concept-description">{t('brandStory.rDescription')}</p>
          <div className="concept-services">
            <h4 className="concept-services-title">{t('brandStory.rScenariosTitle')}</h4>
            <ul className="concept-services-list">
              <li>{t('brandStory.rScenario1')}</li>
              <li>{t('brandStory.rScenario2')}</li>
              <li>{t('brandStory.rScenario3')}</li>
              <li>{t('brandStory.rScenario4')}</li>
              <li>{t('brandStory.rScenario5')}</li>
            </ul>
          </div>
          <p className="concept-footer">{t('brandStory.rFooter')}</p>
        </div>
      );
    }

    return null;
  };

  const renderIntroTitle = () => {
    const title = t('brandStory.introTitle');

    if (title === 'Our Promise to You') {
      return (
        <>
          <span>Our </span>
          <span className="story-red">Promise</span>
          <span> to You</span>
        </>
      );
    }

    if (title === '我们的承诺') {
      return (
        <>
          <span>我们的</span>
          <span className="story-red">承诺</span>
        </>
      );
    }

    return title;
  };

  const renderIntroText = () => {
    const text = t('brandStory.introText');

    // English version
    if (text.includes('ViCAR delivers exceptional premium mobility experiences')) {
      return (
        <>
          <span className="story-text-line">ViCAR delivers exceptional premium mobility experiences, combining luxury, innovation, and personalized service to create unforgettable journeys.</span>
          <br />
          <span className="story-text-line">Built on five core principles — <span className="story-letter-white">V</span> · <span className="story-letter-white">i</span> · <span className="story-letter-white">C</span> · <span className="story-letter-white">A</span> · <span className="story-letter-white">R</span> —</span>
          <br />
          <span className="story-text-line">our brand represents a steadfast commitment to excellence, quality, and unparalleled customer satisfaction in every journey we undertake together.</span>
        </>
      );
    }

    // Chinese version
    if (text.includes('ViCAR 致力于提供卓越的高端出行体验')) {
      return (
        <>
          <span className="story-text-line">ViCAR 致力于提供卓越的高端出行体验，融合奢华、创新与个性化服务，为您打造难忘的旅程。</span>
          <br />
          <span className="story-text-line">品牌建立在五大核心理念之上 — <span className="story-letter-white">V</span> · <span className="story-letter-white">i</span> · <span className="story-letter-white">C</span> · <span className="story-letter-white">A</span> · <span className="story-letter-white">R</span> —</span>
          <br />
          <span className="story-text-line">代表着我们对每一段旅程的卓越承诺，致力于提供优质服务和无与伦比的客户满意度。</span>
        </>
      );
    }

    return text;
  };

  
  // Helper function to standardize media URLs
  const standardizeMediaUrl = (url) => {
    if (!url) return null;
    
    const vicarDataIndex = url.indexOf('vicar_data');
    if (vicarDataIndex === -1) {
      return url;
    }
    
    const pathFromVicarData = url.substring(vicarDataIndex);
    return `${import.meta.env.VITE_VICAR_BACKEND}/${pathFromVicarData}`;
  };

  // Fetch banner media from API
  const fetchBannerMedia = async () => {
    try {
      setBannerLoading(true);
      setBannerError(null);
      
      const response = await fetch(`${API_BASE_URL}/get-banner-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: 'brandStory' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const mediaItem = result.data.find(media => media !== null);
        if (mediaItem) {
          console.log('Loaded banner media for Brand Story:', mediaItem);
          setBannerMedia(mediaItem);
        } else {
          console.log('No banner media found for Brand Story, using default');
          setBannerMedia(null);
        }
      } else {
        console.log('API returned no data for Brand Story, using default');
        setBannerMedia(null);
      }
    } catch (error) {
      console.error('Error fetching banner media for Brand Story:', error);
      setBannerError(error.message);
      setBannerMedia(null);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerMedia();
  }, []);

  // Logo floating animation - continuous movement
  useEffect(() => {
    const animateLogo = () => {
      const maxMove = 20; // Maximum pixels to move in any direction
      const newX = (Math.random() - 0.5) * maxMove * 2;
      const newY = (Math.random() - 0.5) * maxMove * 2;
      setLogoPosition({ x: newX, y: newY });
    };

    // Start immediately
    animateLogo();
    
    const interval = setInterval(animateLogo, 1500); // Change position every 1.5 seconds
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="brand-story-page" style={{backgroundColor: '#111111', color: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header Component */}
      <VicarHeader currentPage="brandStory" />

      <main className="main-content" style={{backgroundColor: '#111111', color: '#f5f5f5'}}>
 

        {/* Hero Section */}
         {/* 
        <section className="hero-section">
          <div className="hero-background">
            {bannerLoading ? (
              <div className="hero-loading">
                <div className="loading-spinner"></div>
                <p>{t('brandStory.loading')}</p>
              </div>
            ) : bannerError ? (
              <div className="hero-error">
                <p>⚠️ {t('brandStory.error')}: {bannerError}</p>
                <p>{t('brandStory.usingDefault')}</p>
                <img 
                  src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                  alt="ViCAR Brand Story" 
                  className="hero-bg-image"
                  crossOrigin="anonymous"
                />
              </div>
            ) : bannerMedia ? (
              bannerMedia.mimeType && bannerMedia.mimeType.startsWith('video/') ? (
                <video
                  src={standardizeMediaUrl(bannerMedia.url)}
                  className="hero-bg-image"
                  autoPlay
                  muted
                  loop
                  playsInline
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Video load error:', e.target.src);
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              ) : (
                <img 
                  src={standardizeMediaUrl(bannerMedia.url)} 
                  alt="Brand Story Banner" 
                  className="hero-bg-image"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Image load error:', e.target.src);
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              )
            ) : (
              <img 
                src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                alt="ViCAR Brand Story" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            )}
            
            <div className="hero-fallback" style={{ display: 'none' }}>
              <img 
                src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                alt="ViCAR Brand Story" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t('brandStory.heroTitle')}</h1>
            <p className="hero-subtitle">{t('brandStory.heroSubtitle')}</p>
          </div>
        </section>
        */}


        {/* VICAR Title Section with Hyperspeed Background */}
        <section className="vicar-title-section" style={{ position:  'relative', top: 100,minHeight: '800px', width: '100%', overflow: 'hidden', backgroundColor: '#000000' }}>
          {/* Hyperspeed Animation Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Hyperspeed effectOptions={hyperspeedOptions} />
          </div>
          
          {/* Floating Logo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${logoPosition.x}px), calc(-50% + ${logoPosition.y}px))`,
            zIndex: 5,
            pointerEvents: 'none',
            transition: 'transform 1.5s linear'
          }}>
            <img 
              src="/logo/ViCAR Logo - Tran base 2_ViCAR White base bright - left-portrait.png" 
              alt="ViCAR Logo" 
              style={{
                maxWidth: '180px',
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>

          {/* Content Container */}
          <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '80px' }}>
            <AnimatedContent
              distance={30}
              direction="vertical"
              reverse={false}
              duration={1.2}
              ease="power2.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.2}
            >
              <h1 className="vicar-title">
                <span className="vicar-letter-white">V</span>
                <span className="vicar-letter-white">i</span>
                <span className="vicar-letter-white">C</span>
                <span className="vicar-letter-white">A</span>
                <span className="vicar-letter-white">R</span>
              </h1>
            </AnimatedContent>
          </div>
        </section>

        {/* Story / Intro Section (match AboutUs "Our Story" layout) */}
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-image">
                <img
                  src="/bmw_bg_full.jpg"
                  alt="ViCAR Story"
                  className="story-img"
                />
              </div>
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
              >
                <div className="story-content">
                  <h2 className="story-title">{renderIntroTitle()}</h2>
                  <p className="story-text">{renderIntroText()}</p>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Core Concepts Section - V i C A R */}
        <section className="core-concepts-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('brandStory.coreConceptsTitle')}</h2>
              <p className="section-subtitle">{t('brandStory.coreConceptsSubtitle')}</p>
            </div>

            <AnimatedContent
              distance={30}
              direction="vertical"
              reverse={false}
              duration={1.0}
              ease="power2.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.2}
            >
              <div className="pillar-concepts">
                <div className="pillar-row" aria-label="ViCAR pillars">
                  {concepts.map((concept, idx) => {
                    const isActive = idx === activeConceptIndex;
                    const isLocked = idx === lockedConceptIndex;

                    return (
                      <button
                        key={concept.id}
                        type="button"
                        className={`pillar ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                        onMouseEnter={() => setHoverConceptIndex(idx)}
                        onMouseLeave={() => setHoverConceptIndex(null)}
                        onFocus={() => setHoverConceptIndex(idx)}
                        onBlur={() => setHoverConceptIndex(null)}
                        onClick={() => setLockedConceptIndex(isLocked ? null : idx)}
                        aria-pressed={isLocked}
                      >
                        <div className="pillar-letter">{concept.letter}</div>
                        <div className="pillar-title">{t(concept.titleKey)}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="pillar-detail" aria-live="polite">
                  <AnimatedContent
                    key={activeConcept?.id}
                    distance={35}
                    direction="vertical"
                    reverse={false}
                    duration={0.9}
                    ease="power2.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1}
                    threshold={0}
                  >
                    <div className="pillar-detail-inner">
                      {renderConceptDetails(activeConcept?.id)}
                    </div>
                  </AnimatedContent>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Core Values Section */}
        <section className="core-values-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('brandStory.coreValuesTitle')}</h2>
            </div>
            <div className="values-grid">
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
                <div className="value-card">
                  <h3 className="value-number">1</h3>
                  <h4 className="value-title">
                    <span className="value-icon">✓</span>
                    {t('brandStory.value1Title')}
                  </h4>
                  <p className="value-description">{t('brandStory.value1Desc')}</p>
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
                <div className="value-card">
                  <h3 className="value-number">2</h3>
                  <h4 className="value-title">
                    <span className="value-icon">✓</span>
                    {t('brandStory.value2Title')}
                  </h4>
                  <p className="value-description">{t('brandStory.value2Desc')}</p>
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
                <div className="value-card">
                  <h3 className="value-number">3</h3>
                  <h4 className="value-title">
                    <span className="value-icon">✓</span>
                    {t('brandStory.value3Title')}
                  </h4>
                  <p className="value-description">{t('brandStory.value3Desc')}</p>
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
                <div className="value-card">
                  <h3 className="value-number">4</h3>
                  <h4 className="value-title">
                    <span className="value-icon">✓</span>
                    {t('brandStory.value4Title')}
                  </h4>
                  <p className="value-description">{t('brandStory.value4Desc')}</p>
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
                <div className="value-card">
                  <h3 className="value-number">5</h3>
                  <h4 className="value-title">
                    <span className="value-icon">✓</span>
                    {t('brandStory.value5Title')}
                  </h4>
                  <p className="value-description">{t('brandStory.value5Desc')}</p>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Platform Integration Section */}
        <section className="platform-section">
          <div className="container">
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
            >
              <div className="platform-content">
                <h2 className="platform-title">{t('brandStory.platformTitle')}</h2>
                <div className="platform-services">
                  <div className="platform-service-item">{t('brandStory.platformService1')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService2')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService3')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService4')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService5')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService6')}</div>
                  <div className="platform-service-item">{t('brandStory.platformService7')}</div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* Removed: "The ViCAR Family" (Brand Architecture) section */}

        {/* CTA Section */}
        <section className="cta-section" style={{background: 'linear-gradient(to right, #8E1B1E, #261111)'}}>
          <div className="container">
            <h2 className="cta-title">{t('brandStory.ctaTitle')}</h2>
            <p className="cta-subtitle">{t('brandStory.ctaSubtitle')}</p>
            <div className="cta-buttons">
              <a href="https://api.whatsapp.com/send/?phone=601155572999&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="cta-btn secondary">{t('brandStory.contactUs')}</a>
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

export default BrandStory;

