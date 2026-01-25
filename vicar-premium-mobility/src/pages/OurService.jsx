import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import RedLine from '../components/RedLine';
import './OurService.css';
import ContactUsButton from '../components/ContactUsButton';


function OurService() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Service images - centralized for easy updates
  const serviceImages = {
    cityToCity: '/image/ourservice_mini_1.png',
    chauffeurHailing: '/image/ourservice_mini_2.png',
    airportTransfers: '/image/ourservice_mini_3.png',
    hourlyHire: '/image/ourservice_mini_4.png',
    reconCar: 'toyota harrierz.png',
    carRental: 'Toyota vellfire 2023.jpg',
    maintenance: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB923oaeb18SfR1gbA5Y7FfTTCQKTOVl2gdohdif5f-pMn1uXF70Rl5FLBtnWo9vCqyCRGvSKYJ54oWZ39t6L4xF7Hh99jjzABAX_-3qv7XcU_q_5D5Wu0lAxp0BO7_6OcswPvYyXbGK5rUXCAzOeCsc-xGAhI8K-cPCaYSEbtak0u39kMCN7iNCPbvWCi-AfuIrWIKMEOHr3ktF05ZbJNZ5qziZr5E6kfo4BUjo_jFadCw4ydpqkmFqxpAF_PhafrEmIUDABOqIEjz'
  };

  // Service navigation data
  const services = [
    { id: 'city-to-city', name: 'City-to-city rides', image: serviceImages.cityToCity },
    { id: 'chauffeur-hailing', name: 'Chauffeur hailing', image: serviceImages.chauffeurHailing },
    { id: 'airport-transfers', name: 'Airport transfers', image: serviceImages.airportTransfers },
    { id: 'hourly-hire', name: 'Hourly and full day hire', image: serviceImages.hourlyHire },
    { id: 'recon-car', name: t('service.reconCarTitle'), image: serviceImages.reconCar },
    { id: 'car-rental', name: t('service.carRentalTitle'), image: serviceImages.carRental },
    { id: 'maintenance', name: t('service.maintenanceTitle'), image: serviceImages.maintenance }
  ];

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
        body: JSON.stringify({ page: 'ourService' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Get the first non-null media item
        const mediaItem = result.data.find(media => media !== null);
        if (mediaItem) {
          console.log('Loaded banner media for Our Service:', mediaItem);
          setBannerMedia(mediaItem);
        } else {
          console.log('No banner media found for Our Service, using default');
          setBannerMedia(null);
        }
      } else {
        console.log('API returned no data for Our Service, using default');
        setBannerMedia(null);
      }
    } catch (error) {
      console.error('Error fetching banner media for Our Service:', error);
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

  // Handle scroll to section when hash is present in URL
  useEffect(() => {
    const scrollToSection = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the '#' from hash
        const sectionId = hash.substring(1);
        // Wait a bit for the page to render
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            // Account for header height
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    };

    // Scroll on mount
    scrollToSection();

    // Listen for hash changes
    window.addEventListener('hashchange', scrollToSection);

    return () => {
      window.removeEventListener('hashchange', scrollToSection);
    };
  }, []);

  // Scroll to section function
  const scrollToService = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="service-page" style={{backgroundColor: '#111111', color: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header Component */}
      <VicarHeader currentPage="service" />

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
                  src="/image/benz_service.png" 
                  alt="Our Service Banner" 
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
                  alt="Our Service Banner" 
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
              src="/image/benz_service.png" 
                alt="Our Service Banner" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Fallback for failed media loads */}
            <div className="hero-fallback" style={{ display: 'none' }}>
              <img 
              src="/image/benz_service.png" 
                alt="Our Service Banner" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t('service.heroTitle')}</h1>
            <p className="hero-subtitle">{t('service.heroSubtitle')}</p>
          </div>
        </section>

        {/* Service Thumbnail Navigation */}
        <section className="service-thumbnails-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="service-thumbnails-title">EXPLORE WHAT WE CAN DO</h2>
            <div className="service-thumbnails-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-thumbnail"
                  onClick={() => scrollToService(service.id)}
                >
                  <div className="thumbnail-image-container">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="thumbnail-image"
                    />
                    <div className="thumbnail-overlay">
                      <span className="thumbnail-name">{service.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* City-to-city Rides Section */}
        <section className="py-20" id="city-to-city">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">route</span>
                <h3 className="text-4xl font-bold mb-4">City-to-city rides</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  A hassle-free option for long-distance travel with professional chauffeurs worldwide. 
                  Whether you're traveling between major cities or need a comfortable journey across regions, 
                  our city-to-city service ensures a seamless and luxurious experience. Our experienced 
                  drivers are well-versed in navigating various routes, ensuring you arrive at your 
                  destination safely and on time. Enjoy premium comfort, reliable service, and the 
                  convenience of door-to-door transportation for your intercity travels.
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/city-to-city')}
                >
                  Learn more
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.cityToCity} 
                  alt="City-to-city rides" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Chauffeur Hailing Section */}
        <section className="py-20" id="chauffeur-hailing">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">local_taxi</span>
                <h3 className="text-4xl font-bold mb-4">Chauffeur hailing</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Experience the comfort of a classic chauffeur service, with the ease of booking and quick pickup. 
                  Our chauffeur hailing service combines traditional luxury with modern convenience, allowing you 
                  to request a professional driver at a moment's notice. Perfect for business meetings, special 
                  events, or when you simply want to travel in style. With our user-friendly booking system, 
                  you can arrange a ride quickly and efficiently, while our fleet of premium vehicles and 
                  trained chauffeurs guarantee a first-class experience from start to finish.
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/chauffeur-hailing')}
                >
                  Learn more
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.chauffeurHailing} 
                  alt="Chauffeur hailing" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Airport Transfers Section */}
        <section className="py-20" id="airport-transfers">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">flight</span>
                <h3 className="text-4xl font-bold mb-4">Airport transfers</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  With extra waiting time and real-time flight monitoring for delays, we ensure smooth and 
                  effortless airport transfers. Our dedicated airport transfer service takes the stress out 
                  of travel by tracking your flight status and adjusting pickup times accordingly. Whether 
                  you're arriving or departing, our professional chauffeurs will be there to greet you, 
                  assist with your luggage, and provide a comfortable journey to or from the airport. 
                  Enjoy peace of mind knowing that your transportation is handled with precision and care, 
                  allowing you to focus on your journey ahead.
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/airport-transfers')}
                >
                  Learn more
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.airportTransfers} 
                  alt="Airport transfers" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Hourly and Full Day Hire Section */}
        <section className="py-20" id="hourly-hire">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">schedule</span>
                <h3 className="text-4xl font-bold mb-4">Hourly and full day hire</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Whether hourly or full-day chauffeur bookings, select from our customized services for 
                  maximum flexibility, comfort, and reliability. Perfect for business trips, city tours, 
                  shopping excursions, or special occasions, our flexible booking options adapt to your 
                  schedule. Choose from hourly rates for short trips or full-day packages for extended 
                  journeys. Our professional chauffeurs and premium vehicles are at your service, 
                  providing personalized attention and ensuring your comfort throughout the duration 
                  of your booking. Experience the freedom of having a dedicated driver at your disposal, 
                  ready to take you wherever you need to go.
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/hourly-hire')}
                >
                  Learn more
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.hourlyHire} 
                  alt="Hourly and full day hire" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Recon Car Section */}
        <section className="py-20" id="recon-car">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">directions_car</span>
                <h3 className="text-4xl font-bold mb-4">{t('service.reconCarTitle')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('service.reconCarDesc')}
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/recon-car')}
                >
                  {t('service.explore')} 
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.reconCar} 
                  alt="Luxury car showcase" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Car Rental Section */}
        <section className="py-20" id="car-rental">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">car_rental</span>
                <h3 className="text-4xl font-bold mb-4">{t('service.carRentalTitle')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('service.carRentalDesc')}
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/car-rental')}
                >
                  {t('service.explore')}
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.carRental} 
                  alt="Car rental service" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Maintenance Section */}
        <section className="py-20" id="maintenance">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="material-icons text-red-500 text-4xl mb-4">build</span>
                <h3 className="text-4xl font-bold mb-4">{t('service.maintenanceTitle')}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('service.maintenanceDesc')}
                </p>
                <button 
                  className="gradient-btn text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  onClick={() => navigate('/service-details/maintenance')}
                >
                  {t('service.explore')}
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={serviceImages.maintenance} 
                  alt="Car maintenance service" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* CTA Section */}
        <section className="cta-section" style={{background: 'linear-gradient(to right, #8E1B1E, #261111)'}}>
          <div className="container">
            <h2 className="cta-title">{t('service.ctaTitle')}</h2>
            <p className="cta-subtitle">
              {t('service.ctaSubtitle')}
            </p>
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

export default OurService;