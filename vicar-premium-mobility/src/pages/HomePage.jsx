import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaKey } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import Lottie from 'lottie-react';
import AnimatedContent from '../animation/AnimatedContent';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import RedLine from '../components/RedLine';
import MobileAppPromotion from '../components/MobileAppPromotion';
import './HomePage.css';


function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [flow, setFlow] = useState('rental');
  const videoRef = useRef(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [showText, setShowText] = useState(true);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [hideVideo, setHideVideo] = useState(false);
  const [securityCarAnimation, setSecurityCarAnimation] = useState(null);
  const hasReachedFirstFrame = useRef(false);
  const hasScrolledFirst = useRef(false);
  const videoEnded = useRef(false);
  const chauffeurSectionRef = useRef(null);
  const newArrivalsSectionRef = useRef(null);
  const postVideoScrollTargetRef = useRef('chauffeur');
  const scrollHandlersRef = useRef({ handleScrollTrigger: null, preventScroll: null });
  const [animatedSections, setAnimatedSections] = useState({
    rentalFlow: false
  });

  // New Arrivals state
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState(null);
  const arrivalsScrollContainerRef = useRef(null);
  const [canScrollArrivalsLeft, setCanScrollArrivalsLeft] = useState(false);
  const [canScrollArrivalsRight, setCanScrollArrivalsRight] = useState(true);

  const KW99_LANDING_API_URL = `${import.meta.env.VITE_LANDING_PAGE_CAR_LIST_URL}`;

  const goToTownDetails = (id) => {
    navigate(`/town-details/${id}`);
  };

  const handleCityKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToTownDetails(id);
    }
  };

  // Load Security Car Black Lottie animation
  useEffect(() => {
    fetch('/lottie/Car safety edit.json')
      .then(response => response.json())
      .then(data => setSecurityCarAnimation(data))
      .catch(error => {
        console.log('Failed to load Car safety edit animation:', error);
        setSecurityCarAnimation(null);
      });
  }, []);

  // Handle skip button click - ends video and scrolls to chauffeur section
  const handleSkipVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration; // Jump to end
    }
    
    // Mark video as ended
    videoEnded.current = true;
    
    // Start fade-out animation
    setVideoFadeOut(true);
    
    // Restore body scroll immediately
    document.body.style.overflow = 'auto';
    
    // Remove scroll event listeners
    if (scrollHandlersRef.current.handleScrollTrigger) {
      window.removeEventListener('wheel', scrollHandlersRef.current.handleScrollTrigger);
      window.removeEventListener('touchmove', scrollHandlersRef.current.handleScrollTrigger);
    }
    if (scrollHandlersRef.current.preventScroll) {
      window.removeEventListener('scroll', scrollHandlersRef.current.preventScroll);
    }
    
    // Hide video after fade-out animation completes
    setTimeout(() => {
      setHideVideo(true);
      
      const scrollTarget = postVideoScrollTargetRef.current;
      if (scrollTarget === 'arrivals' && newArrivalsSectionRef.current) {
        newArrivalsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (chauffeurSectionRef.current) {
        chauffeurSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1000); // Match the fade-out duration
  };

  // Video interaction effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Prevent scrolling until video ends
    const preventScroll = (e) => {
      if (!videoEnded.current) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Handle video play to pause at first frame
    const handlePlay = () => {
      // Pause immediately at first frame
      if (!hasReachedFirstFrame.current) {
        hasReachedFirstFrame.current = true;
        // Use requestAnimationFrame to ensure we pause at the first frame
        requestAnimationFrame(() => {
          video.pause();
          setShowScrollPrompt(true);
        });
      }
    };

    // Handle video end
    const handleVideoEnd = () => {
      videoEnded.current = true;
      // Start fade-out animation
      setVideoFadeOut(true);
      
      // Restore body scroll immediately when video ends
      document.body.style.overflow = 'auto';
      
      // Remove scroll event listeners since we no longer need them
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);
      window.removeEventListener('scroll', preventScroll);
      
      // Hide video after fade-out animation completes
      setTimeout(() => {
        setHideVideo(true);
      }, 1000); // Match the fade-out duration
    };

    // Handle scroll/wheel event to resume video
    const handleScrollTrigger = (e) => {
      // If video hasn't reached first frame yet, prevent scroll
      if (!hasReachedFirstFrame.current) {
        e.preventDefault();
        return;
      }

      // First pause point - resume video after first scroll
      if (hasReachedFirstFrame.current && !hasScrolledFirst.current) {
        e.preventDefault();
        hasScrolledFirst.current = true;
        setShowScrollPrompt(false);
        setShowText(false);
        if (video.paused) {
          video.play();
        }
        return;
      }

      // If video is still playing, prevent scroll
      if (!videoEnded.current) {
        e.preventDefault();
      }
    };

    // Store handlers in ref for cleanup from skip button
    scrollHandlersRef.current.handleScrollTrigger = handleScrollTrigger;
    scrollHandlersRef.current.preventScroll = preventScroll;

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleVideoEnd);
    
    // Prevent scroll until video ends
    window.addEventListener('wheel', handleScrollTrigger, { passive: false });
    window.addEventListener('touchmove', handleScrollTrigger, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });

    // Start playing the video when loaded
    const handleCanPlay = () => {
      video.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('canplay', handleCanPlay);
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);
      window.removeEventListener('scroll', preventScroll);
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
    };
  }, []);

  // New Arrivals functions
  const fetchVehiclesData = async () => {
    try {
      console.log('fetch KW99_LANDING_API_URL');
      const response = await fetch(KW99_LANDING_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result && data.status_code === 100 && data.data) {
        return {
          success: true,
          vehicles: data.data,
          message: data.msg
        };
      } else {
        throw new Error(data.msg || 'Failed to fetch vehicles data');
      }
    } catch (error) {
      console.error('Error fetching vehicles data:', error);
      return {
        success: false,
        vehicles: [],
        error: error.message
      };
    }
  };

  // Fetch vehicles data on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setVehiclesLoading(true);
        setVehiclesError(null);
        
        const result = await fetchVehiclesData();
        
        if (result.success) {
          // Sort vehicles by manufacturing year (latest first)
          const sortedVehicles = result.vehicles.sort((a, b) => {
            const yearA = parseInt(a.manufacturing_year) || 0;
            const yearB = parseInt(b.manufacturing_year) || 0;
            return yearB - yearA; // Descending order (latest first)
          });
          setVehicles(sortedVehicles);
        } else {
          setVehiclesError(result.error || 'Failed to load vehicles');
        }
      } catch (err) {
        setVehiclesError('An unexpected error occurred');
        console.error('Error loading vehicles:', err);
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Handle New Arrivals scroll events
  useEffect(() => {
    const scrollContainer = arrivalsScrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkArrivalsScrollPosition);
      // Initial check
      checkArrivalsScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkArrivalsScrollPosition);
      };
    }
  }, [vehicles]);

  // Auto-scroll functionality for New Arrivals
  useEffect(() => {
    if (vehicles.length === 0) return;

    const interval = setInterval(() => {
      if (arrivalsScrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = arrivalsScrollContainerRef.current;
        
        // If we've reached the end, scroll back to beginning
        if (scrollLeft >= scrollWidth - clientWidth - 1) {
          arrivalsScrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Otherwise, scroll right by one card width
          arrivalsScrollContainerRef.current.scrollBy({
            left: 200,
            behavior: 'smooth'
          });
        }
      }
    }, 12000); // Auto-scroll every 12 seconds

    return () => clearInterval(interval);
  }, [vehicles]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.dataset.section;
            if (sectionName) {
              setAnimatedSections(prev => ({
                ...prev,
                [sectionName]: true
              }));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe only sections that need animations (rental flow)
    const sections = document.querySelectorAll('[data-section="rentalFlow"]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // New Arrivals scroll functions
  const checkArrivalsScrollPosition = () => {
    if (arrivalsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = arrivalsScrollContainerRef.current;
      setCanScrollArrivalsLeft(scrollLeft > 0);
      setCanScrollArrivalsRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollArrivalsLeft = () => {
    if (arrivalsScrollContainerRef.current) {
      const cardWidth = 350; // Card width + margin
      arrivalsScrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const scrollArrivalsRight = () => {
    if (arrivalsScrollContainerRef.current) {
      const cardWidth = 350; // Card width + margin
      arrivalsScrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  // Inline CarCard Component for New Arrivals
  const CarCard = ({ vehicle }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (!vehicle) return null;

    const {
      vehicle_id,
      manufacturing_year,
      title,
      brand,
      model,
      img_path
    } = vehicle;

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    return (
      <div className="car-card">
        <div className="car-image-container">
          {!imageLoaded && (
            <div className="image-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="image-error">
              <div className="error-icon">🚗</div>
              <p>{t('home.imageUnavailable')}</p>
            </div>
          ) : (
            <img
              src={img_path}
              alt={title}
              className={`car-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        <div className="car-details">
          <div className="car-header">
            <h3 className="car-title">{title}</h3>
          </div>

          <div className="car-action">
            <Link to="/contact-us" className="car-enquiry-btn">
              {t('home.enquiry')}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Loading skeleton for New Arrivals
  const LoadingSkeleton = () => (
    <div className="new-arrivals-loading">
      <div className="loading-header">
        <div className="skeleton-title"></div>
      </div>
      <div className="loading-cards">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
              <div className="skeleton-text skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error state for New Arrivals
  const ErrorState = () => (
    <div className="new-arrivals-error">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h3>{t('home.failedToLoadArrivals')}</h3>
        <p>{vehiclesError}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          {t('home.retry')}
        </button>
      </div>
    </div>
  );

  // Empty state for New Arrivals
  const EmptyState = () => (
    <div className="new-arrivals-empty">
      <div className="empty-content">
        <div className="empty-icon">🚗</div>
        <h3>{t('home.noVehiclesAvailable')}</h3>
        <p>{t('home.checkBackLater')}</p>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Header Component */}
      <VicarHeader currentPage="home" />

      <main className="main-content">
        {/* Video Interaction Section - Replaces Hero */}
        {!hideVideo && (
          <div className={`home-video-container ${videoFadeOut ? 'fade-out' : ''}`}>
            <video
              ref={videoRef}
              className="home-fullscreen-video"
              muted
              playsInline
            >
              <source src="/video/alphard_start_car.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className={`home-video-text-overlay ${!showText ? 'fade-out' : ''}`}>
              <p className="home-video-eyebrow">{t('home.vicarPremiumMobility')}</p>
              <h1 className="home-video-title">
                {t('home.arriveInQuietLuxury').split(' ').slice(0, 2).join(' ')}<br />
                <span className="lux-gold">{t('home.arriveInQuietLuxury').split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="home-video-subtitle">
                {t('home.chauffeurServiceTagline')}
              </p>
            </div>

            {showScrollPrompt && (
              <div className="home-scroll-prompt">
                <div className="home-scroll-prompt-content">
                  <div className="home-scroll-icon">
                    <div className="home-mouse">
                      <div className="home-wheel"></div>
                    </div>
                  </div>
                  <p className="home-scroll-text">{t('home.scrollToContinue')}</p>
                </div>
              </div>
            )}

            <button 
              className="skip-video-btn"
              onClick={handleSkipVideo}
              aria-label="Skip video"
            >
              {t('home.skip')}
            </button>

            {/* Lottie Loading Animation - appears during video fade-out */}
            {videoFadeOut && securityCarAnimation && (
              <div className="home-lottie-loading">
                <Lottie 
                  animationData={securityCarAnimation} 
                  className="home-lottie-animation" 
                  loop={true}
                  autoplay={true}
                  renderer="svg"
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid meet',
                    clearCanvas: true
                  }}
                  style={{ 
                    background: 'transparent',
                    backgroundColor: 'transparent'
                  }}
                  onError={(error) => {
                    console.log('Security Car animation error:', error);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Chauffeur Service Section */}
        <section ref={chauffeurSectionRef} className="chauffeur-service-section">
          <div className="chauffeur-bg-overlay"></div>
          <div className="chauffeur-content">
            <div className="chauffeur-text-side">
              <p className="lux-eyebrow">{t('home.chauffeurAirportCity')}</p>
              <h2 className="chauffeur-title">{t('home.malaysiaChauffeurService')}</h2>
              <p className="chauffeur-subtitle">
                {t('home.experienceLuxuryTransport')}
              </p>
              <div className="lux-trustbar" aria-label="Trusted partners">
                <div className="lux-trust-item">
                  <img className="lux-trust-logo" src="/kw99.png" alt="KW99" loading="lazy" />
                </div>
                <div className="lux-trust-divider" aria-hidden="true"></div>
                <div className="lux-trust-item">
                  <span className="lux-trust-text">{t('home.concierge24')}</span>
                </div>
                <div className="lux-trust-divider" aria-hidden="true"></div>
                <div className="lux-trust-item">
                  <span className="lux-trust-text">{t('home.premiumFleet')}</span>
                </div>
              </div>
              <div className="chauffeur-features">
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.professionalDrivers')}</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.availability24')}</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.luxuryVehicles')}</span>
                </div>
              </div>
            </div>
            
            <div className="chauffeur-form-side">
              <div className="chauffeur-form-card">
                <div className="home-form-tabs">
                  <button className="home-form-tab active">{t('home.oneWay')}</button>
                  <button className="home-form-tab">{t('home.byTheHour')}</button>
                </div>
                
                <form className="home-booking-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="home-form-group">
                    <label className="home-form-label">{t('home.from')}</label>
                    <div className="home-input-with-icon">
                      <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input 
                        type="text" 
                        className="home-form-input" 
                        placeholder={t('home.addressPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="home-form-group">
                    <label className="home-form-label">{t('home.to')}</label>
                    <div className="home-input-with-icon">
                      <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input 
                        type="text" 
                        className="home-form-input" 
                        placeholder={t('home.addressPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="home-form-row">
                    <div className="home-form-group flex-1">
                      <label className="home-form-label">{t('home.date')}</label>
                      <div className="home-input-with-icon">
                        <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                          type="date" 
                          className="home-form-input" 
                          defaultValue="2026-01-19"
                        />
                      </div>
                    </div>

                    <div className="home-form-group flex-1">
                      <label className="home-form-label">{t('home.pickupTime')}</label>
                      <div className="home-input-with-icon">
                        <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                          type="time" 
                          className="home-form-input" 
                          defaultValue="13:15"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="home-form-note">{t('home.chauffeurWaitNote')}</p>

                  <button type="submit" className="home-search-btn">
                    {t('home.search')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* Our Services Section */}
        <section className="home-our-services-section">
          <div className="container">
            <div className="lux-servicesHeader">
              <p className="lux-eyebrow">{t('home.signatureServices')}</p>
              <div className="lux-servicesHeaderRow">
                <div>
                  <h2 className="home-services-title">{t('home.ourServices')}</h2>
                  <p className="lux-servicesSubtitle">
                    {t('home.curatedMobility')}
                  </p>
                </div>
                <Link to="/service" className="lux-btn lux-btn--secondary lux-btnLink lux-servicesAll">
                  {t('home.viewAll')}
                </Link>
              </div>
            </div>

            <div className="lux-servicesMosaic" aria-label="Our services">
              {/* Tile A – text panel (like the left block in the reference) */}
              <div className="lux-servicesTile lux-servicesTile--intro">
                <p className="lux-servicesKicker">{t('home.vicarPremiumMobilityShort')}</p>
                <h3 className="lux-servicesIntroTitle">
                  {t('home.chauffeurLedTravel')}
                </h3>
                <p className="lux-servicesIntroBody">
                  {t('home.discreetService')}
                </p>
                <div className="lux-servicesIntroActions">
                  <a href="/service#chauffeur-hailing" className="lux-btn lux-btn--primary lux-btnLink">
                    {t('home.bookChauffeur')}
                  </a>
                </div>
              </div>

              {/* Tile B – large image */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.05}>
                <a href="/service#airport-transfers" className="lux-servicesTile lux-servicesTile--hero" aria-label="Airport transfers">
                  <img src="/image/ourservice_mini_3.png" alt="Airport transfers" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.airportTransfers')}</h3>
                    <p className="lux-servicesDesc">{t('home.flightMonitoring')}</p>
                    <span className="lux-servicesLink">{t('home.learnMore')}</span>
                  </div>
                </a>
              </AnimatedContent>



                    {/* Tile C */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.2}>
              <a href="/service#city-to-city" className="lux-servicesTile lux-servicesTile--small2" aria-label="Chauffeur hailing">
                <img src="/image/ourservice_mini_1.png" alt="City-to-city rides" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.cityToCityRides')}</h3>
                    <p className="lux-servicesDesc">{t('home.longDistanceTravel')}</p>
                    <span className="lux-servicesLink">{t('home.learnMore')}</span>
                  </div>
                </a>
              </AnimatedContent>

              {/* Tile D – wide */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.15}>
                <a href="/service#hourly-hire" className="lux-servicesTile lux-servicesTile--wide" aria-label="Hourly and full day hire">
                  <img src="/image/ourservice_mini_4.png" alt="Hourly and full day hire" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.hourlyFullDayHire')}</h3>
                    <p className="lux-servicesDesc">{t('home.yourItinerary')}</p>
                    <span className="lux-servicesLink">{t('home.learnMore')}</span>
                  </div>
                </a>
              </AnimatedContent>

              {/* Tile E */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.2}>
                <a href="/service#chauffeur-hailing" className="lux-servicesTile lux-servicesTile--small2" aria-label="Chauffeur hailing">
                  <img src="/image/ourservice_mini_2.png" alt="Chauffeur hailing" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.chauffeurHailing')}</h3>
                    <p className="lux-servicesDesc">{t('home.onDemandBooking')}</p>
                    <span className="lux-servicesLink">{t('home.learnMore')}</span>
                  </div>
                </a>
              </AnimatedContent>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* Explore Malaysia - City to City Section */}
        <section className="explore-malaysia-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('home.exploreMalaysiaTitle')}</h2>
              <p className="section-subtitle">{t('home.exploreMalaysiaSubtitle')}</p>
            </div>

            <div className="city-grid">
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.1}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('kuala-lumpur')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'kuala-lumpur')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/kualalumpur.jpg" alt="Kuala Lumpur" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.kualaLumpur')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.15}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('penang')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'penang')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/penang.jpg" alt="Penang" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.penang')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.2}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('johor')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'johor')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/johor.jpg" alt="Johor Bahru" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.johorBahru')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.25}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('melaka')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'melaka')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/melaka.jpg" alt="Melaka" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.melaka')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.3}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('ipoh')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'ipoh')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/ipoh.jpg" alt="Ipoh" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.ipoh')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.15}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('langkawi')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'langkawi')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/langkawi.jpg" alt="Langkawi" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.langkawi')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.2}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('kedah')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'kedah')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/kedah.jpg" alt="Kedah" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.kedah')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.25}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('terengganu')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'terengganu')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/terengganu.jpg" alt="Terengganu" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.terengganu')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.3}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('perak')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'perak')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/perak.jpg" alt="Perak" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.perak')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.35}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('perlis')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'perlis')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/perlis.jpg" alt="Perlis" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.perlis')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            <div className="view-more-container">
              <button className="view-more-btn" onClick={() => goToTownDetails('kuala-lumpur')}>
                <span>{t('home.viewMore')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Flow Section */}
        <section className="flow-section">
          <div className="container">
            <div className="flow-content rental-flow" data-section="rentalFlow">
              <div className="lux-flow">
                <div className="lux-flow__intro">
                  <p className="lux-eyebrow">{t('home.experience')}</p>
                  <h2 className="lux-flow__title">{t('home.rentalTitle')}</h2>
                  <p className="lux-flow__desc">{t('home.rentalDescription')}</p>

                  <div className="lux-flow__pills" aria-label="Service highlights">
                    <span className="lux-flow__pill">{t('home.concierge24')}</span>
                    <span className="lux-flow__pill">{t('home.discreetOnTime')}</span>
                    <span className="lux-flow__pill">{t('home.premiumFleet')}</span>
                  </div>

                  <Link to="/contact-us" className="lux-btn lux-btn--primary lux-btnLink lux-flow__cta">
                    {t('home.requestConcierge')}
                  </Link>
                </div>

                <ol className="lux-flow__steps" aria-label="How it works">
                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.05}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaCar />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">01</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep1Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep1Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>

                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.12}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaCalendarAlt />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">02</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep2Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep2Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>

                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.19}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaKey />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">03</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep3Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep3Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>
                </ol>
              </div>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* New Arrivals - Dynamic from API */}
        <section ref={newArrivalsSectionRef} className="new-arrivals-section">
          {/* Navigation Buttons - positioned at the edge like stage buttons */}
          <button 
            className={`stage-nav-btn stage-nav-left ${!canScrollArrivalsLeft ? 'disabled' : ''}`}
            onClick={scrollArrivalsLeft}
            disabled={!canScrollArrivalsLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <button 
            className={`stage-nav-btn stage-nav-right ${!canScrollArrivalsRight ? 'disabled' : ''}`}
            onClick={scrollArrivalsRight}
            disabled={!canScrollArrivalsRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('home.newArrivals')}</h2>
              <p className="section-subtitle">
                {t('home.newArrivalsSubtitle')}
              </p>
            </div>

            {vehiclesLoading ? (
              <LoadingSkeleton />
            ) : vehiclesError ? (
              <ErrorState />
            ) : vehicles.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="arrivals-carousel">
                  {/* Scrollable Container */}
                  <div 
                    className="arrivals-scroll-container"
                    ref={arrivalsScrollContainerRef}
                  >
                    <div className="arrivals-cards">
                      {vehicles.map((vehicle) => (
                        <CarCard 
                          key={`${vehicle.vehicle_id}-${vehicle.updated_date}`}
                          vehicle={vehicle}
                        />
                      ))}
                      
                      {/* Duplicate cards for infinite scroll effect */}
                      {vehicles.length > 0 && vehicles.map((vehicle) => (
                        <CarCard 
                          key={`duplicate-${vehicle.vehicle_id}-${vehicle.updated_date}`}
                          vehicle={vehicle}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* View All Button 
                <div className="section-footer">
                  <button 
                    className="view-all-btn"
                    onClick={() => window.open('https://app.kw99.com.my/app-browse', '_blank', 'noopener,noreferrer')}
                  >
                    <span>{t('home.viewAllVehicles')}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                */}
              </>
            )}
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Premium Concierge CTA */}
        <section className="lux-cta-section">
          <div className="container">
            <div className="lux-cta-card">
              <div className="lux-cta-copy">
                <p className="lux-eyebrow">{t('home.privateConcierge')}</p>
                <h2 className="lux-cta-title">
                  {t('home.reservedRefinedEffortless').split('.').slice(0, 2).join('. ')}. <span className="lux-gold">{t('home.reservedRefinedEffortless').split('.')[2].trim()}.</span>
                </h2>
                <p className="lux-cta-subtitle">
                  Tell us where you’re headed — we’ll curate the vehicle, chauffeur, and timing with quiet precision.
                </p>
              </div>
              <div className="lux-cta-actions">
                <Link to="/contact-us" className="lux-btn lux-btn--primary lux-btnLink">
                  {t('home.contactConcierge')}
                </Link>
                <Link to="/service" className="lux-btn lux-btn--secondary lux-btnLink">
                  {t('home.viewServices')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Promotion */}
        <MobileAppPromotion />
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />
   
    </div>
  );
}

export default HomePage;
