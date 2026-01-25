import React, { useState } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';
import './ContactUsButton.css';

function ContactUsButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const phoneNumber = '+601155572999';
    const message = 'Hello! I would like to inquire about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleCall = () => {
    const phoneNumber = '+601155572999';
    window.open(`tel:${phoneNumber}`, '_self');
    setIsOpen(false);
  };

  const handleEmail = () => {
    const email = 'enquiries@kw99.com.my';
    const subject = 'Inquiry about Vicar Services';
    const body = 'Hello! I would like to inquire about your services.';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_self');
    setIsOpen(false);
  };

  return (
    <div className="contact-us-container">
      <button 
        onClick={() => {
          console.log('Button clicked, isOpen:', !isOpen);
          setIsOpen(!isOpen);
        }}
        className="contact-us-button"
        aria-label="Contact Us"
      >
        <FaComments />
      </button>
      
      {isOpen && (
        <>
          {/* WhatsApp Circle */}
          <div 
            className="contact-circle whatsapp-circle"
            onClick={handleWhatsApp}
          >
            <FaWhatsapp />
          </div>

          {/* Call Circle */}
          <div 
            className="contact-circle call-circle"
            onClick={handleCall}
          >
            <FaPhone />
          </div>

          {/* Email Circle */}
          <div 
            className="contact-circle email-circle"
            onClick={handleEmail}
          >
            <FaEnvelope />
          </div>
        </>
      )}
    </div>
  );
}

export default ContactUsButton; 