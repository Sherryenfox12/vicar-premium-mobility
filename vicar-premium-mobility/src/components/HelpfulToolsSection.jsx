import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedContent from '../animation/AnimatedContent';
import './HelpfulToolsSection.css';

/**
 * Row of helpful tools: Insurance Estimator, Loan Checker, Document Checklist,
 * Check Car (Scrut), Find Your Perfect Match. Used on Best Selling and recon-car service page.
 */
function HelpfulToolsSection() {
  const { t } = useTranslation();

  const handleCardHover = (e, isEnter) => {
    const el = e.currentTarget;
    if (isEnter) {
      el.style.transform = 'translateY(-8px) scale(1.02)';
      el.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    } else {
      el.style.transform = 'translateY(0) scale(1)';
      el.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }
  };

  return (
    <section className="helpful-tools-section">
      <div className="helpful-tools-section__container">
        <h2 className="helpful-tools-section__title">{t('home.helpfulTools')}</h2>
        <div className="helpful-tools-section__wrapper">
          <div className="helpful-tools-section__scroll">
            <div className="helpful-tools-section__row">
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.1}
              >
                <Link to="/helpful-tools/insurance-estimate" className="helpful-tools-section__link">
                  <div
                    className="helpful-tools-section__card"
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                  >
                    <div className="helpful-tools-section__icon-wrap">
                      <svg className="helpful-tools-section__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>{t('home.insuranceEstimator')}</h3>
                  </div>
                </Link>
              </AnimatedContent>
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.2}
              >
                <Link to="/helpful-tools/loan-checker" className="helpful-tools-section__link">
                  <div
                    className="helpful-tools-section__card"
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                  >
                    <div className="helpful-tools-section__icon-wrap">
                      <svg className="helpful-tools-section__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>{t('home.loanChecker')}</h3>
                  </div>
                </Link>
              </AnimatedContent>
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.3}
              >
                <Link to="/helpful-tools/document-checklist" className="helpful-tools-section__link">
                  <div
                    className="helpful-tools-section__card"
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                  >
                    <div className="helpful-tools-section__icon-wrap">
                      <svg className="helpful-tools-section__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>{t('home.documentChecklist')}</h3>
                  </div>
                </Link>
              </AnimatedContent>
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.4}
              >
                <div
                  className="helpful-tools-section__card"
                  role="button"
                  tabIndex={0}
                  onClick={() => window.open('https://scrut.my/', '_blank', 'noopener,noreferrer')}
                  onKeyDown={(e) => e.key === 'Enter' && window.open('https://scrut.my/', '_blank', 'noopener,noreferrer')}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                >
                  <div className="helpful-tools-section__icon-wrap">
                    <svg className="helpful-tools-section__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>{t('home.checkCar')}</h3>
                </div>
              </AnimatedContent>
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.3}
                delay={0.5}
              >
                <Link to="/car-recommendation" className="helpful-tools-section__link">
                  <div
                    className="helpful-tools-section__card"
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                  >
                    <div className="helpful-tools-section__icon-wrap">
                      <svg className="helpful-tools-section__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3>{t('home.findCarMatch')}</h3>
                  </div>
                </Link>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpfulToolsSection;
