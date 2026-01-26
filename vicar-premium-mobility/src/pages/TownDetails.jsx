import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import MobileAppPromotion from '../components/MobileAppPromotion';
import './TownDetails.css';

function TownDetails() {
  const { townId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [townId]);

  const townMeta = {
    'kuala-lumpur': { key: 'kualaLumpur', icon: 'location_city', image: '/image/cityMalaysia/kualalumpur.jpg' },
    penang: { key: 'penang', icon: 'museum', image: '/image/cityMalaysia/penang.jpg' },
    johor: { key: 'johorBahru', icon: 'map', image: '/image/cityMalaysia/johor.jpg' },
    melaka: { key: 'melaka', icon: 'account_balance', image: '/image/cityMalaysia/melaka.jpg' },
    ipoh: { key: 'ipoh', icon: 'landscape', image: '/image/cityMalaysia/ipoh.jpg' },
    langkawi: { key: 'langkawi', icon: 'beach_access', image: '/image/cityMalaysia/langkawi.jpg' },
    kedah: { key: 'kedah', icon: 'nature', image: '/image/cityMalaysia/kedah.jpg' },
    terengganu: { key: 'terengganu', icon: 'waves', image: '/image/cityMalaysia/terengganu.jpg' },
    perak: { key: 'perak', icon: 'terrain', image: '/image/cityMalaysia/perak.jpg' },
    perlis: { key: 'perlis', icon: 'park', image: '/image/cityMalaysia/perlis.jpg' }
  };

  const meta = townMeta[townId];
  const townKey = meta ? `townDetails.towns.${meta.key}` : null;
  const title = townKey ? t(`${townKey}.title`) : '';
  const subtitle = townKey ? t(`${townKey}.subtitle`) : '';
  const description = townKey ? t(`${townKey}.description`) : '';
  const highlights = townKey ? t(`${townKey}.highlights`, { returnObjects: true }) : [];
  const tips = townKey ? t(`${townKey}.tips`, { returnObjects: true }) : [];

  if (!meta || !title) {
    navigate('/');
    return null;
  }

  const handlePlanRide = () => {
    const msg = encodeURIComponent(t('townDetails.whatsAppMessage', { place: title }));
    window.open(
      `https://api.whatsapp.com/send/?phone=%2B601155572999&text=${msg}&type=phone_number&app_absent=0`,
      '_blank'
    );
  };

  return (
    <div className="town-details-page">
      <VicarHeader currentPage="home" />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-background">
            <img
              src={meta.image}
              alt={title}
              className="hero-bg-image"
            />
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
        </section>

        <section className="town-details-section">
          <div className="container">
            <div className="town-content">
              <div className="town-info">
                <div className="town-icon">
                  <span className="material-icons">{meta.icon}</span>
                </div>

                <h2 className="town-title">{t('townDetails.aboutTitle', { place: title })}</h2>
                <p className="town-description">{description}</p>

                <div className="town-features">
                  <h3>{t('townDetails.highlightsTitle')}</h3>
                  <ul>
                    {(Array.isArray(highlights) ? highlights : []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="town-features">
                  <h3>{t('townDetails.tipsTitle')}</h3>
                  <ul>
                    {(Array.isArray(tips) ? tips : []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="town-actions">
                  <button className="primary-btn" onClick={handlePlanRide}>
                    {t('townDetails.planRide')}
                  </button>
                  <button className="secondary-btn" onClick={() => navigate('/')}>
                    {t('townDetails.backToHome')}
                  </button>
                </div>
              </div>

              <div className="town-image">
                <img
                  src={meta.image}
                  alt={title}
                  className="town-img"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="additional-info-section">
          <div className="container">
            <h2>{t('townDetails.whyTitle')}</h2>
            <div className="info-grid">
              <div className="info-card">
                <span className="material-icons">schedule</span>
                <h3>{t('townDetails.why.card1.title')}</h3>
                <p>{t('townDetails.why.card1.desc')}</p>
              </div>
              <div className="info-card">
                <span className="material-icons">route</span>
                <h3>{t('townDetails.why.card2.title')}</h3>
                <p>{t('townDetails.why.card2.desc')}</p>
              </div>
              <div className="info-card">
                <span className="material-icons">verified</span>
                <h3>{t('townDetails.why.card3.title')}</h3>
                <p>{t('townDetails.why.card3.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        <MobileAppPromotion />
      </main>

      <VicarFooter />
      <FloatingCarButton />
    </div>
  );
}

export default TownDetails;

