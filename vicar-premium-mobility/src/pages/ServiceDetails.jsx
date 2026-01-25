import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import ContactUsButton from '../components/ContactUsButton';
import FloatingCarButton from '../components/FloatingCarButton';
import MobileAppPromotion from '../components/MobileAppPromotion';
import './ServiceDetails.css';


function ServiceDetails() {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceType]);

  // Smooth scroll function
  const scrollToMobileApp = () => {
    const mobileAppSection = document.getElementById('mobile-app-promotion');
    if (mobileAppSection) {
      mobileAppSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Service configurations
  const serviceConfigs = {
    'city-to-city': {
      title: 'City-to-city rides',
      subtitle: 'Seamless long-distance travel with professional chauffeurs worldwide',
      icon: 'route',
      description: 'A hassle-free option for long-distance travel with professional chauffeurs worldwide. Whether you\'re traveling between major cities or need a comfortable journey across regions, our city-to-city service ensures a seamless and luxurious experience. Our experienced drivers are well-versed in navigating various routes, ensuring you arrive at your destination safely and on time. Enjoy premium comfort, reliable service, and the convenience of door-to-door transportation for your intercity travels. Perfect for business professionals, families, and travelers seeking comfort and reliability on extended journeys.',
      features: [
        'Professional chauffeurs with extensive route knowledge and experience',
        'Premium luxury vehicles equipped with modern amenities for long journeys',
        'Door-to-door service for maximum convenience and comfort',
        'Flexible scheduling to accommodate your travel plans',
        'Real-time journey tracking and communication with your driver',
        'Complimentary refreshments and Wi-Fi connectivity during your trip',
        'Competitive pricing with transparent, all-inclusive rates'
      ],
      image: '/image/ourservice_mini_1.png',
      ctaText: 'Book Your Journey',
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+a+city-to-city+ride.&type=phone_number&app_absent=0', '_blank')
    },
    'chauffeur-hailing': {
      title: 'Chauffeur hailing',
      subtitle: 'Classic luxury meets modern convenience',
      icon: 'local_taxi',
      description: 'Experience the comfort of a classic chauffeur service, with the ease of booking and quick pickup. Our chauffeur hailing service combines traditional luxury with modern convenience, allowing you to request a professional driver at a moment\'s notice. Perfect for business meetings, special events, or when you simply want to travel in style. With our user-friendly booking system, you can arrange a ride quickly and efficiently, while our fleet of premium vehicles and trained chauffeurs guarantee a first-class experience from start to finish. Available 24/7, our service ensures you always have reliable transportation when you need it most.',
      features: [
        'Instant booking with quick pickup times for urgent travel needs',
        'Professional, well-trained chauffeurs with excellent service standards',
        'Premium fleet of luxury vehicles maintained to the highest standards',
        '24/7 availability for your convenience, any day of the week',
        'User-friendly mobile and web booking platforms',
        'Transparent pricing with no hidden fees or surge charges',
        'Personalized service tailored to your preferences and requirements'
      ],
      image: '/image/ourservice_mini_2.png',
      ctaText: 'Hail a Chauffeur',
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+a+chauffeur+service.&type=phone_number&app_absent=0', '_blank')
    },
    'airport-transfers': {
      title: 'Airport transfers',
      subtitle: 'Stress-free airport transportation with flight monitoring',
      icon: 'flight',
      description: 'With extra waiting time and real-time flight monitoring for delays, we ensure smooth and effortless airport transfers. Our dedicated airport transfer service takes the stress out of travel by tracking your flight status and adjusting pickup times accordingly. Whether you\'re arriving or departing, our professional chauffeurs will be there to greet you, assist with your luggage, and provide a comfortable journey to or from the airport. Enjoy peace of mind knowing that your transportation is handled with precision and care, allowing you to focus on your journey ahead. We understand the importance of punctuality and reliability when it comes to airport travel, which is why we go above and beyond to ensure your experience is seamless.',
      features: [
        'Real-time flight monitoring to adjust pickup times automatically',
        'Generous waiting time included - no rush, no stress',
        'Meet and greet service at the airport terminal',
        'Luggage assistance from our professional chauffeurs',
        'Premium vehicles with spacious interiors for comfortable travel',
        'Fixed pricing with no hidden charges, even for flight delays',
        '24/7 service covering all major airports and flight schedules'
      ],
      image: '/image/ourservice_mini_3.png',
      ctaText: 'Book Airport Transfer',
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+an+airport+transfer.&type=phone_number&app_absent=0', '_blank')
    },
    'hourly-hire': {
      title: 'Hourly and full day hire',
      subtitle: 'Flexible chauffeur service for any duration',
      icon: 'schedule',
      description: 'Whether hourly or full-day chauffeur bookings, select from our customized services for maximum flexibility, comfort, and reliability. Perfect for business trips, city tours, shopping excursions, or special occasions, our flexible booking options adapt to your schedule. Choose from hourly rates for short trips or full-day packages for extended journeys. Our professional chauffeurs and premium vehicles are at your service, providing personalized attention and ensuring your comfort throughout the duration of your booking. Experience the freedom of having a dedicated driver at your disposal, ready to take you wherever you need to go, whenever you need to go there.',
      features: [
        'Flexible hourly and full-day booking options to suit your needs',
        'Customizable itineraries for business, leisure, or special events',
        'Professional chauffeurs dedicated to your service for the entire duration',
        'Premium luxury vehicles with all modern amenities and comforts',
        'No mileage restrictions - travel as far as you need within your booking time',
        'Competitive rates with transparent pricing for both hourly and daily packages',
        'Easy booking process with instant confirmation and flexible cancellation'
      ],
      image: '/image/ourservice_mini_4.png',
      ctaText: 'Book Now',
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+an+hourly+or+full-day+chauffeur+service.&type=phone_number&app_absent=0', '_blank')
    },
    'recon-car': {
      title: t('serviceDetails.reconCarTitle'),
      subtitle: t('serviceDetails.reconCarSubtitle'),
      icon: 'directions_car',
      description: t('serviceDetails.reconCarDesc'),
      features: [
        t('serviceDetails.reconCarFeature1'),
        t('serviceDetails.reconCarFeature2'),
        t('serviceDetails.reconCarFeature3'),
        t('serviceDetails.reconCarFeature4'),
        t('serviceDetails.reconCarFeature5')
      ],
      image: '/toyota harrierz.png',
      ctaText: t('serviceDetails.viewInventory'),
      ctaAction: scrollToMobileApp
    },
    'car-rental': {
      title: t('serviceDetails.carRentalTitle'),
      subtitle: t('serviceDetails.carRentalSubtitle'),
      icon: 'car_rental',
      description: t('serviceDetails.carRentalDesc'),
      features: [
        t('serviceDetails.carRentalFeature1'),
        t('serviceDetails.carRentalFeature2'),
        t('serviceDetails.carRentalFeature3'),
        t('serviceDetails.carRentalFeature4'),
        t('serviceDetails.carRentalFeature5')
      ],
      image: '/Toyota vellfire 2023.jpg',
      ctaText: t('serviceDetails.rentNow'),
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+inquire+about+your+services.&type=phone_number&app_absent=0', '_blank')
    },
    'maintenance': {
      title: t('serviceDetails.maintenanceTitle'),
      subtitle: t('serviceDetails.maintenanceSubtitle'),
      icon: 'build',
      description: t('serviceDetails.maintenanceDesc'),
      features: [
        t('serviceDetails.maintenanceFeature1'),
        t('serviceDetails.maintenanceFeature2'),
        t('serviceDetails.maintenanceFeature3'),
        t('serviceDetails.maintenanceFeature4'),
        t('serviceDetails.maintenanceFeature5')
      ],
      image: '/Toyota GR Yaris  ….jpg',
      ctaText: t('serviceDetails.scheduleService'),
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+inquire+about+your+services.&type=phone_number&app_absent=0', '_blank')
    }
  };

  const currentService = serviceConfigs[serviceType];

  // If invalid service type, redirect to services page
  if (!currentService) {
    navigate('/service');
    return null;
  }

  return (
    <div className="service-details-page">
      {/* Header Component */}
      <VicarHeader currentPage="service" />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <img 
              src="/corollawallpaper.jpg" 
              alt="Corolla Wallpaper" 
              className="hero-bg-image"
            />
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{currentService.title}</h1>
            <p className="hero-subtitle">{currentService.subtitle}</p>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="service-details-section">
          <div className="container">
            <div className="service-content">
              <div className="service-info">
                <div className="service-icon">
                  <span className="material-icons">{currentService.icon}</span>
                </div>
                <h2 className="service-title">{currentService.title}</h2>
                <p className="service-description">{currentService.description}</p>
                
                <div className="service-features">
                  <h3>{t('serviceDetails.whatWeOffer')}</h3>
                  <ul>
                    {currentService.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-actions">
                  <button 
                    className="primary-btn"
                    onClick={currentService.ctaAction}
                  >
                    {currentService.ctaText}
                  </button>
                  <button 
                    className="secondary-btn"
                    onClick={() => navigate('/service')}
                  >
                    {t('serviceDetails.backToServices')}
                  </button>
                </div>
              </div>
              
              <div className="service-image">
                <img 
                  src={currentService.image} 
                  alt={currentService.title}
                  className="service-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="additional-info-section">
          <div className="container">
            <h2>{t('serviceDetails.whyChooseKW99')} {currentService.title.split(' ')[0]} {t('serviceDetails.services')}</h2>
            <div className="info-grid">
              <div className="info-card">
                <span className="material-icons">verified</span>
                <h3>{t('serviceDetails.qualityAssured')}</h3>
                <p>{t('serviceDetails.qualityAssuredDesc')}</p>
              </div>
              <div className="info-card">
                <span className="material-icons">support_agent</span>
                <h3>{t('serviceDetails.expertSupport')}</h3>
                <p>{t('serviceDetails.expertSupportDesc')}</p>
              </div>
              <div className="info-card">
                <span className="material-icons">schedule</span>
                <h3>{t('serviceDetails.flexibleScheduling')}</h3>
                <p>{t('serviceDetails.flexibleSchedulingDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Contact our team today to discuss your specific needs and discover how we can help you.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Contact Us</button>
              <button className="cta-btn secondary" onClick={() => navigate('/service')}>
                View All Services
              </button>
            </div>
          </div>
        </section>
        */}
        
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

export default ServiceDetails;
