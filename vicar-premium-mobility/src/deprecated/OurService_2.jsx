import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaCarSide, FaTools, FaThumbsUp, FaUserCheck, FaUsers, FaHeadset } from 'react-icons/fa';
import VicarHeader from '../components/VicarHeader';
import ContactUsButton from '../components/ContactUsButton';
import './OurService_2.css';

function OurService2() {
  return (
    <div className="service-page" style={{backgroundColor: '#111111', color: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header Component */}
      <VicarHeader currentPage="service" />

      <main className="main-content" style={{backgroundColor: '#111111', color: '#f5f5f5'}}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
           
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">Our Services</h1>
            <p className="hero-subtitle">Comprehensive Automotive Solutions for Every Need</p>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What We Do</h2>
              <p className="section-subtitle">
                We offer a complete suite of services to cater to all your luxury automotive needs. From acquisition to maintenance, we've got you covered.
              </p>
            </div>
            
            <div className="services-grid">
              <div className="service-card">
                <div className="service-header">
                  <FaCar className="service-icon" />
                  <h3 className="service-title">Recon Car Sales</h3>
                </div>
                <p className="service-description">
                  We specialize in sourcing and selling high-quality, reconditioned luxury vehicles. Each car undergoes a rigorous inspection to ensure it meets our exacting standards of performance and aesthetics.
                </p>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2bA6roeHgBnu0Yis6ADPFd9FHh7CHyDJW7WXraEkD2kJQj65YXqrMcI9kUX-T4M2gZeCWhfpjFGH0ARU0bGzDF3hX5C2ZCGx_PNJbnUhv1JA2MYI2OSS2OjDDJhFEGaHL5Ggx3K6sPtJO_KNUCGaIbTk1RBtAH3qnpmMNyNhNx0BDGD-mresR7AshVE2mgPfFfWyKT_4lLDxZpaT3tNkqfupxWmrzdaxWQ2MKL_u1TkstGKExGzl_4lXvWQ0vNkwKdKyZZAOyIuCj" 
                  alt="A white modern SUV" 
                  className="service-image"
                />
              </div>

              <div className="service-card">
                <div className="service-header">
                  <FaCarSide className="service-icon" />
                  <h3 className="service-title">Luxury Car Rental</h3>
                </div>
                <p className="service-description">
                  Experience luxury without the commitment. Our rental fleet features the latest models from top brands, perfect for special occasions, business trips, or simply a weekend of indulgence.
                </p>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACXRTsaA2EB_J24InFLahbvWYbAALiGsBnGPTNbf76tLIjfF2GnHzVMhf6B_2jJ4tyRMi-J_YNKSgnUHwnLUdHyERzUe_f1LuT-Ciz2YEYIaGpNwFKpZAceYDM0FIt3bIZHN1hH4K_ENzGG55xFauvlSRpwYtwMRq9V8Y_ClY17wVpq9wXTll35nxWHUQ9z23lrdXACdyojSQUyza-knA369W3BZjxDr3oBI4QeQkBSUjBFxvoZ5FtIGMojOTMmDtOfDsfmdjEfVYf" 
                  alt="A grey sports coupe" 
                  className="service-image"
                />
              </div>

              <div className="service-card">
                <div className="service-header">
                  <FaTools className="service-icon" />
                  <h3 className="service-title">Expert Maintenance</h3>
                </div>
                <p className="service-description">
                  Our state-of-the-art service center is staffed by certified technicians who specialize in luxury vehicles. We use only genuine parts and the latest diagnostic equipment to keep your car in peak condition.
                </p>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB923oaeb18SfR1gbA5Y7FfTTCQKTOVl2gdohdif5f-pMn1uXF70Rl5FLBtnWo9vCqyCRGvSKYJ54oWZ39t6L4xF7Hh99jjzABAX_-3qv7XcU_q_5D5Wu0lAxp0BO7_6OcswPvYyXbGK5rUXCAzOeCsc-xGAhI8K-cPCaYSEbtak0u39kMCN7iNCPbvWCi-AfuIrWIKMEOHr3ktF05ZbJNZ5qziZr5E6kfo4BUjo_jFadCw4ydpqkmFqxpAF_PhafrEmIUDABOqIEjz" 
                  alt="A mechanic working on a luxury car engine" 
                  className="service-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">Ready to Experience Our Services?</h2>
            <p className="cta-subtitle">Get in touch with our team today to discuss your automotive needs.</p>
            <div className="cta-buttons">
              <Link to="/render" className="cta-btn primary">Explore Inventory</Link>
              <Link to="/" className="cta-btn secondary">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
            <Link to="/">Contact Us</Link>
          </div>
          <p className="footer-copyright">© 2024 KW99. All rights reserved.</p>
        </div>
      </footer>
      <ContactUsButton />
    </div>
  );
}

export default OurService2;

