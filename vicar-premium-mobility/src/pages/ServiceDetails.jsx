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

  // Handle hash-based scrolling for subsections (e.g., #airport)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for the page to render
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const headerOffset = 120; // Adjust for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
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
    'point-to-point': {
      title: t('serviceDetails.pointToPointTitle'),
      subtitle: t('serviceDetails.pointToPointSubtitle'),
      icon: 'alt_route',
      description: t('serviceDetails.pointToPointDesc'),
      features: [
        t('serviceDetails.pointToPointFeature1'),
        t('serviceDetails.pointToPointFeature2'),
        t('serviceDetails.pointToPointFeature3'),
        t('serviceDetails.pointToPointFeature4'),
        t('serviceDetails.pointToPointFeature5')
      ],
      image: '/image/inside_car.jpeg',
      ctaText: t('serviceDetails.bookNow'),
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+a+point-to-point+transport.&type=phone_number&app_absent=0', '_blank')
    },
    'chauffeur-service': {
      title: t('serviceDetails.chauffeurServiceTitle'),
      subtitle: t('serviceDetails.chauffeurServiceSubtitle'),
      icon: 'local_taxi',
      description: t('serviceDetails.chauffeurServiceDesc'),
      subsections: [
        {
          id: 'airport',
          title: t('service.airportTransfers'),
          icon: 'flight',
          description: t('service.airportTransfersDesc'),
          features: [
            t('serviceDetails.airportFeature1'),
            t('serviceDetails.airportFeature2'),
            t('serviceDetails.airportFeature3'),
            t('serviceDetails.airportFeature4')
          ],
          image: '/image/ourservice_mini_3.png'
        },
        {
          id: 'chauffeur-hailing',
          title: t('service.chauffeurHailing'),
          icon: 'hail',
          description: t('service.chauffeurHailingDesc'),
          features: [
            t('serviceDetails.hailingFeature1'),
            t('serviceDetails.hailingFeature2'),
            t('serviceDetails.hailingFeature3'),
            t('serviceDetails.hailingFeature4')
          ],
          image: '/image/ourservice_mini_2.png'
        },
        {
          id: 'city-to-city',
          title: t('service.cityToCityRides'),
          icon: 'route',
          description: t('service.cityToCityDesc'),
          features: [
            t('serviceDetails.cityToCityFeature1'),
            t('serviceDetails.cityToCityFeature2'),
            t('serviceDetails.cityToCityFeature3'),
            t('serviceDetails.cityToCityFeature4')
          ],
          image: '/image/ourservice_mini_1.png'
        },
        {
          id: 'hourly-hire',
          title: t('service.hourlyFullDayHire'),
          icon: 'schedule',
          description: t('service.hourlyFullDayHireDesc'),
          features: [
            t('serviceDetails.hourlyFeature1'),
            t('serviceDetails.hourlyFeature2'),
            t('serviceDetails.hourlyFeature3'),
            t('serviceDetails.hourlyFeature4')
          ],
          image: '/image/ourservice_mini_4.png'
        }
      ],
      features: [
        t('serviceDetails.chauffeurServiceFeature1'),
        t('serviceDetails.chauffeurServiceFeature2'),
        t('serviceDetails.chauffeurServiceFeature3'),
        t('serviceDetails.chauffeurServiceFeature4'),
        t('serviceDetails.chauffeurServiceFeature5')
      ],
      image: '/image/ourservice_mini_1.png',
      ctaText: t('serviceDetails.bookChauffeur'),
      ctaAction: () => window.open('https://api.whatsapp.com/send/?phone=%2B601155572999&text=Hello%21+I+would+like+to+book+a+chauffeur+service.&type=phone_number&app_absent=0', '_blank')
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
      image: '/image/carRental.jpeg',
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
      image: '/maintainence.jpeg',
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
              src="/image/inside_car.jpeg" 
              alt="Service Details" 
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
            <div className={`service-content ${serviceType === 'chauffeur-service' ? 'service-content-full' : ''}`}>
              <div className="service-info">
                <div className="service-icon">
                  <span className="material-icons">{currentService.icon}</span>
                </div>
                <h2 className="service-title">{currentService.title}</h2>
                <p className="service-description">{currentService.description}</p>
                
                {/* If it's chauffeur service, show subsections */}
                {serviceType === 'chauffeur-service' && currentService.subsections && (
                  <div className="service-subsections">
                    <h3 className="subsections-title">{t('serviceDetails.ourChauffeurServices')}</h3>
                    {currentService.subsections.map((subsection, index) => (
                      <div key={subsection.id} id={subsection.id} className="subsection-card">
                        <div className="subsection-header">
                          <span className="material-icons subsection-icon">{subsection.icon}</span>
                          <h4 className="subsection-title">{subsection.title}</h4>
                        </div>
                        <div className="subsection-content">
                          <div className="subsection-text">
                            <p className="subsection-description">{subsection.description}</p>
                            <ul className="subsection-features">
                              {subsection.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="subsection-image">
                            <img 
                              src={subsection.image} 
                              alt={subsection.title}
                              className="subsection-img"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
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
              
              {/* Only show main image if not chauffeur service (subsections have their own images) */}
              {serviceType !== 'chauffeur-service' && (
                <div className="service-image">
                  <img 
                    src={currentService.image} 
                    alt={currentService.title}
                    className="service-img"
                  />
                </div>
              )}
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
