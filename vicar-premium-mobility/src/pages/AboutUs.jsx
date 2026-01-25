import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaCarSide, FaTools, FaThumbsUp, FaUserCheck, FaUsers, FaHeadset } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import ContactUsButton from '../components/ContactUsButton';
import FloatingCarButton from '../components/FloatingCarButton';
import RotatingText from '../animation/RotatingText';
import AnimatedContent from '../animation/AnimatedContent';
import './AboutUs.css';

function AboutUs() {
  const { t } = useTranslation();
  
  // Banner media state
  const [bannerMedia, setBannerMedia] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  
  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;

  // Helper function to standardize media URLs
  const standardizeMediaUrl = (url) => {
    if (!url) return null;
    
    // Find the index of 'vicar_data' in the URL
    const vicarDataIndex = url.indexOf('vicar_data');
    if (vicarDataIndex === -1) {
      // If 'vicar_data' is not found, return the original URL
      return url;
    }
    
    // Crop everything before 'vicar_data' and prepend with environment variable
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
        body: JSON.stringify({ page: 'aboutUs' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Get the first non-null media item
        const mediaItem = result.data.find(media => media !== null);
        if (mediaItem) {
          console.log('Loaded banner media for About Us:', mediaItem);
          setBannerMedia(mediaItem);
        } else {
          console.log('No banner media found for About Us, using default');
          setBannerMedia(null);
        }
      } else {
        console.log('API returned no data for About Us, using default');
        setBannerMedia(null);
      }
    } catch (error) {
      console.error('Error fetching banner media for About Us:', error);
      setBannerError(error.message);
      setBannerMedia(null);
    } finally {
      setBannerLoading(false);
    }
  };

  // Fetch banner media on component mount
  useEffect(() => {
    fetchBannerMedia();
  }, []);
  
  return (
    <div className="about-page" style={{backgroundColor: '#111111', color: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header Component */}
      <VicarHeader currentPage="about" />

      <main className="main-content" style={{backgroundColor: '#111111', color: '#f5f5f5'}}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            {bannerLoading ? (
              <div className="hero-loading">
                <div className="loading-spinner"></div>
                <p>Loading banner media...</p>
              </div>
            ) : bannerError ? (
              <div className="hero-error">
                <p>⚠️ Error loading banner media: {bannerError}</p>
                <p>Using default image...</p>
                <img 
                  src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                  alt="Toyota Alphard 2024" 
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
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onLoad={() => console.log('Video loaded successfully:', bannerMedia.url)}
                />
              ) : (
                <img 
                  src={standardizeMediaUrl(bannerMedia.url)} 
                  alt="About Us Banner" 
                  className="hero-bg-image"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Image load error:', e.target.src, e.target.error);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', bannerMedia.url)}
                />
              )
            ) : (
              <img 
                src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                alt="Toyota Alphard 2024" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Fallback for failed media loads */}
            <div className="hero-fallback" style={{ display: 'none' }}>
              <img 
                src="/Toyota-Alphard-2024-17-1296x700.jpg" 
                alt="Toyota Alphard 2024" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t('about.heroTitle')}</h1>
            <p className="hero-subtitle">{t('about.heroSubtitle')}</p>
          </div>
        </section>

        {/* Our Story Section */}
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
                    const title = t('about.storyTitle');
                    if (title === 'OUR STORY') {
                      return (
                        <>
                          <span style={{ color: '#f5f5f5' }}>OUR </span>
                          <span style={{ color: '#8E1B1E' }}>STORY</span>
                        </>
                      );
                    } else if (title === '品牌故事') {
                      return (
                        <>
                          <span style={{ color: '#f5f5f5' }}>品牌</span>
                          <span style={{ color: '#8E1B1E' }}>故事</span>
                        </>
                      );
                    }
                    return title;
                  })()}
                </h2>
                <p className="story-text">
                  {t('about.storyText')}
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

        {/* Tagline Section */}
        <section className="tagline-section">
          <div className="container">
            <div className="tagline-content">
              <h2 className="tagline-line-1">{t('about.tagline1')}</h2>
              <h2 className="tagline-line-2">{t('about.tagline2')}</h2>
            </div>
          </div>
        </section>

        {/* Gradient Bars Section */}
        <section className="gradient-bars-section">
          <div className="container">
            <div className="gradient-bars-container">
              <div className="gradient-bar gradient-bar-1">
                <p className="gradient-bar-text">{t('about.gradientBar1')}</p>
              </div>
              <div className="gradient-bar gradient-bar-2">
                <p className="gradient-bar-text">{t('about.gradientBar2')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="features-section" style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('about.whyChooseTitle')}</h2>
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
              <a href="https://api.whatsapp.com/send/?phone=601155572999&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="cta-btn secondary">{t('about.contactUs')}</a>
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