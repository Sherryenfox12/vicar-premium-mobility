import React from 'react';
import { useTranslation } from "react-i18next";
import './MobileAppPromotion.css';

const MobileAppPromotion = () => {
  const { t } = useTranslation();

  return (
    <section id="mobile-app-promotion" className="mobile-app-section">
      <div className="container">
        <div className="app-promotion-content">
          <div className="app-info">
            <h2 className="app-title">{t('home.needCarAdvice')}</h2>
            <p className="app-subtitle">{t('home.contactUsDownload')}</p>
            <p className="app-description">
              {t('home.appDescription')}
            </p>
            <button 
              className="appointment-btn"
              onClick={() => window.open('https://api.whatsapp.com/send/?phone=601155572999&text&type=phone_number&app_absent=0', '_blank', 'noopener,noreferrer')}
            >
              {t('home.bookRideToday')}
            </button>
            <div className="store-buttons">
              <a href="https://play.google.com/store/apps/details?id=com.kw99.kw99&hl=en-MY" target="_blank" rel="noopener noreferrer" className="store-btn google-play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="btn-text">
                  <span className="btn-label">{t('home.androidAppOn')}</span>
                  <span className="btn-title">{t('home.googlePlay')}</span>
                </div>
              </a>
              <a href="https://apps.apple.com/my/app/kw99-lowest-priced-recon-cars/id6504366022" target="_blank" rel="noopener noreferrer" className="store-btn app-store">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="btn-text">
                  <span className="btn-label">{t('home.downloadOnThe')}</span>
                  <span className="btn-title">{t('home.appStore')}</span>
                </div>
              </a>
              <a href="https://appgallery.huawei.com/app/C111877839" target="_blank" rel="noopener noreferrer" className="store-btn huawei-store">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                </svg>
                <div className="btn-text">
                  <span className="btn-label">{t('home.exploreItOn')}</span>
                  <span className="btn-title">{t('home.appGallery')}</span>
                </div>
              </a>
            </div>
          </div>
          <div className="app-image">
            <img src="/vicar-Phone-mockup.png" alt="Vicar Mobile App" className="mobile-app-img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppPromotion;
