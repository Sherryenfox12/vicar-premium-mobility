import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import StarBorder from '../animation/StarBorder';
import '../animation/StarBorder.css';
import './ContactUs.css';


function ContactUs() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Name: '',
    EmailAdd: '',
    PhoneNo: '',
    MessageBody: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        body: JSON.stringify({ page: 'contactUs' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Get the first non-null media item
        const mediaItem = result.data.find(media => media !== null);
        if (mediaItem) {
          console.log('Loaded banner media for Contact Us:', mediaItem);
          setBannerMedia(mediaItem);
        } else {
          console.log('No banner media found for Contact Us, using default');
          setBannerMedia(null);
        }
      } else {
        console.log('API returned no data for Contact Us, using default');
        setBannerMedia(null);
      }
    } catch (error) {
      console.error('Error fetching banner media for Contact Us:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show confirmation dialog before submitting
    const confirmMessage = `${t('contact.confirmMessage')}\n\n${t('contact.confirmName')} ${formData.Name}\n${t('contact.confirmEmail')} ${formData.EmailAdd}\n${t('contact.confirmPhone')} ${formData.PhoneNo}\n${t('contact.confirmMessageText')} ${formData.MessageBody}\n\n${t('contact.confirmQuestion')}`;
    
    const isConfirmed = window.confirm(confirmMessage);
    
    if (!isConfirmed) {
      return; // User cancelled the submission
    }
    
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_VICAR_BACKEND}/api/contact-us-enquiry-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success case
        setIsSuccess(true);
        // Reset form
        setFormData({
          Name: '',
          EmailAdd: '',
          PhoneNo: '',
          MessageBody: ''
        });
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        // Error case - handle different error scenarios
        if (response.status === 400) {
          // Validation error
          alert(data.message || t('contact.validationError'));
        } else if (response.status === 500) {
          // Server error
          alert(data.message || t('contact.serverError'));
        } else {
          // Other errors
          alert(data.message || t('contact.submitError'));
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('contact.networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header Component */}
      <VicarHeader currentPage="contact" />

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
                src="/Honda.jpg" 
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
                alt="Contact Us Banner" 
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
              src="/Honda.jpg" 
              alt="Toyota Alphard 2024" 
              className="hero-bg-image"
              crossOrigin="anonymous"
            />
          )}
          
          {/* Fallback for failed media loads */}
          <div className="hero-fallback" style={{ display: 'none' }}>
            <img 
              src="/Honda.jpg" 
              alt="Toyota Alphard 2024" 
              className="hero-bg-image"
              crossOrigin="anonymous"
            />
          </div>
          
          <div className="hero-overlay"></div>
          <div className="hero-black-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{t('contact.heroTitle')}</h1>
          <p className="hero-subtitle">{t('contact.heroSubtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('contact.contactInfo')}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="material-icons contact-icon mt-1">phone</span>
                  <div>
                    <h3 className="font-semibold text-lg">{t('contact.phone')}</h3>
                    <p className="text-gray-400">+60-11 5557 2999</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="material-icons contact-icon mt-1">email</span>
                  <div>
                    <h3 className="font-semibold text-lg">{t('contact.email')}</h3>
                    <p className="text-gray-400">enquiries@kw99.com.my</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="material-icons contact-icon mt-1">location_on</span>
                  <div>
                    <h3 className="font-semibold text-lg">{t('contact.penangOffice')}</h3>
                    <p className="text-gray-400">148, Jalan Sungai Pinang, Taman Cemerlang, 10150 George Town, Pulau Pinang</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="material-icons contact-icon mt-1">schedule</span>
                  <div>
                    <h3 className="font-semibold text-lg">{t('contact.openingHours')}</h3>
                    <p className="text-gray-400">{t('contact.monFri')}</p>
                    <p className="text-gray-400">{t('contact.sat')}</p>
                    <p className="text-gray-400">{t('contact.sun')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 rounded-lg overflow-hidden">
                <img 
                  alt="Beacon Executive Suite building exterior" 
                  className="w-full h-64 object-cover" 
                  src="/vicar.png"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <StarBorder as="div" className="w-full" color="#D32F2F" speed="5s" thickness={1} style={{margin: '20px 0', position: 'relative', zIndex: 10}}>
                <div className="bg-black p-8 rounded-lg shadow-lg">
                  <h2 className="text-3xl font-bold mb-6">{t('contact.sendMessage')}</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="Name">
                          {t('contact.name')}
                        </label>
                        <input 
                          className="w-full input-field" 
                          id="Name" 
                          name="Name" 
                          placeholder={t('contact.namePlaceholder')} 
                          type="text"
                          value={formData.Name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="EmailAdd">
                          {t('contact.emailAddress')}
                        </label>
                        <input 
                          className="w-full input-field" 
                          id="EmailAdd" 
                          name="EmailAdd" 
                          placeholder={t('contact.emailPlaceholder')} 
                          type="email"
                          value={formData.EmailAdd}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="PhoneNo">
                          {t('contact.phoneNumber')}
                        </label>
                        <input 
                          className="w-full input-field" 
                          id="PhoneNo" 
                          name="PhoneNo" 
                          placeholder={t('contact.phonePlaceholder')} 
                          type="tel"
                          value={formData.PhoneNo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="MessageBody">
                          {t('contact.yourMessage')}
                        </label>
                        <textarea 
                          className="w-full input-field" 
                          id="MessageBody" 
                          name="MessageBody" 
                          placeholder={t('contact.messagePlaceholder')} 
                          rows="5"
                          value={formData.MessageBody}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div>
                        <button 
                          className={`w-full py-3 transition-all duration-300 ${
                            isSuccess 
                              ? 'btn-success' 
                              : isSubmitting 
                                ? 'btn-loading' 
                                : 'btn-primary'
                          }`} 
                          type="submit"
                          disabled={isSubmitting || isSuccess}
                        >
                          {isSuccess ? (
                            <>
                              <span className="success-icon">✓</span>
                              {t('contact.success')}
                            </>
                          ) : isSubmitting ? (
                            <>
                              <span className="loading-spinner"></span>
                              {t('contact.submitting')}
                            </>
                          ) : (
                            t('contact.submitEnquiry')
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </StarBorder>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-8">{t('contact.ourLocation')}</h2>
            <div className="rounded-lg overflow-hidden shadow-2xl relative">
              <iframe 
                title="Vicar Location"
                allowFullScreen="" 
                height="450" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.100984878077!2d100.32454531476527!3d5.402094996078652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac3a9e223b207%3A0x6e336e9cb4d42b10!2s148%20Jalan%20Sungai%20Pinang%2C%20Taman%20Cemerlang%2C%2010150%20George%20Town%2C%20Pulau%20Pinang!5e0!3m2!1sen!2smy!4v1678886432123!5m2!1sen!2smy" 
                style={{border:0}} 
                width="100%"
              ></iframe>
              {/*}
              <div className="custom-marker">
                <div className="marker-pin"></div>
                <div className="marker-label">Vicar</div>
              </div>
              */}
            </div>
            <div className="text-center mt-8">
              <a 
                className="inline-block btn-secondary" 
                href="https://www.google.com/maps/dir/?api=1&destination=148+Jalan+Sungai+Pinang%2C+Taman+Cemerlang%2C+10150+George+Town%2C+Pulau+Pinang" 
                rel="noopener noreferrer" 
                target="_blank"
              >
                {t('contact.getDirections')}
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />
    </div>
  );
}

export default ContactUs; 