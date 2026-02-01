import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import StarBorder from '../animation/StarBorder';
import '../animation/StarBorder.css';
import './ContactUs.css';

const DEFAULT_HERO_IMAGE = '/image/page_background/contactUsBg.jpeg';

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

      {/* Hero Section - default image only */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src={DEFAULT_HERO_IMAGE}
            alt="Toyota Alphard 2024"
            className="hero-bg-image"
            crossOrigin="anonymous"
          />
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
          <div className="contact-intro">
            <p className="contact-kicker">{t('contact.kicker')}</p>
            <h2 className="contact-section-title">{t('contact.getInTouchTitle')}</h2>
            <p className="contact-section-subtitle">{t('contact.getInTouchSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start contact-main-grid">
            {/* Contact Information */}
            <div className="contact-left">
              <h2 className="text-3xl font-bold mb-6">{t('contact.contactInfo')}</h2>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-card-icon material-icons" aria-hidden="true">phone</div>
                  <div>
                    <h3 className="contact-card-title">{t('contact.phone')}</h3>
                    <p className="contact-card-value">
                      <a className="contact-link" href="tel:+601155572999">+60-11 5557 2999</a>
                    </p>
                    <p className="contact-card-muted">{t('contact.phoneHint')}</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon material-icons" aria-hidden="true">email</div>
                  <div>
                    <h3 className="contact-card-title">{t('contact.email')}</h3>
                    <p className="contact-card-value">
                      <a className="contact-link" href="mailto:enquiries@kw99.com.my">enquiries@kw99.com.my</a>
                    </p>
                    <p className="contact-card-muted">{t('contact.responseTime')}</p>
                  </div>
                </div>

                <div className="contact-card contact-card--wide">
                  <div className="contact-card-icon material-icons" aria-hidden="true">location_on</div>
                  <div>
                    <h3 className="contact-card-title">{t('contact.penangOffice')}</h3>
                    <p className="contact-card-value text-gray-400">
                      148, Jalan Sungai Pinang, Taman Cemerlang, 10150 George Town, Pulau Pinang
                    </p>
                    <div className="contact-chip-row">
                      <span className="contact-chip">{t('contact.nearby1')}</span>
                      <span className="contact-chip">{t('contact.nearby2')}</span>
                      <span className="contact-chip">{t('contact.parking')}</span>
                    </div>
                  </div>
                </div>

                <div className="contact-card contact-card--wide">
                  <div className="contact-card-icon material-icons" aria-hidden="true">schedule</div>
                  <div>
                    <h3 className="contact-card-title">{t('contact.openingHours')}</h3>
                    <p className="contact-card-value text-gray-400">{t('contact.monFri')}</p>
                    <p className="contact-card-value text-gray-400">{t('contact.sat')}</p>
                    <p className="contact-card-value text-gray-400">{t('contact.sun')}</p>
                  </div>
                </div>
              </div>

              <div className="contact-faq">
                <h3 className="contact-subtitle">{t('contact.faqTitle')}</h3>
                <div className="contact-faq-list">
                  <details className="contact-faq-item">
                    <summary className="contact-faq-summary">{t('contact.faqQ1')}</summary>
                    <div className="contact-faq-body">{t('contact.faqA1')}</div>
                  </details>
                  <details className="contact-faq-item">
                    <summary className="contact-faq-summary">{t('contact.faqQ2')}</summary>
                    <div className="contact-faq-body">{t('contact.faqA2')}</div>
                  </details>
                  <details className="contact-faq-item">
                    <summary className="contact-faq-summary">{t('contact.faqQ3')}</summary>
                    <div className="contact-faq-body">{t('contact.faqA3')}</div>
                  </details>
                </div>
              </div>

             
           
            </div>

            {/* Contact Form */}
            <div className="contact-right">
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
                          className={`w-full transition-all duration-300 ${
                            isSuccess 
                              ? 'btn-success' 
                              : isSubmitting 
                                ? 'btn-loading' 
                                : 'contact-search-btn'
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

              <div className="contact-after-form">
                <div className="contact-vicar-image-wrap">
                  <img
                    alt="Vicar"
                    className="contact-vicar-image"
                    src="/kw99.png"
                  />
                </div>
              </div>
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
                className="inline-block btn-secondary contact-get-direction-btn" 
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