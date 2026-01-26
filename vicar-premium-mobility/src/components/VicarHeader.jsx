import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './VicarHeader.css';

function VicarHeader({ currentPage = 'home' }) {
  const { i18n, t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = useMemo(() => ([
    { to: '/', key: 'home', label: t('nav.home') },
    { to: '/about', key: 'about', label: t('nav.about') },
    { to: '/brand-story', key: 'brandStory', label: t('nav.brandStory') },
    { to: '/service', key: 'service', label: t('nav.services') },
    { to: '/discover', key: 'discover', label: t('nav.discover') },
    { to: '/contact-us', key: 'contact', label: t('nav.contact') },
  ]), [t]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(v => !v);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <header className={`vicar-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="vicar-header__top">
        <div className="vicar-header__topInner">
          <div className="vicar-header__topLeft">
            <a className="vicar-header__topLink" href="tel:+601155572999">011-55572999</a>
            <span className="vicar-header__dot" aria-hidden="true"></span>
            <a className="vicar-header__topLink" href="mailto:enquiries@kw99.com.my">enquiries@kw99.com.my</a>
          </div>
          <div className="vicar-header__topRight">
            <button className="vicar-header__lang" type="button" onClick={toggleLanguage} aria-label="Toggle language">
              EN / 中文
            </button>
          </div>
        </div>
      </div>

      <div className="vicar-header__main">
        <div className="vicar-header__mainInner">
          <Link to="/" className="vicar-header__brand" aria-label="ViCAR Home" onClick={closeMenu}>
            <img
              src="/logo/ViCAR Logo -  Tran base 2_ViCAR White base bright.png"
              alt="ViCAR"
              className="vicar-header__logo"
            />
          </Link>

          <nav className="vicar-header__nav" aria-label="Primary">
            {navItems.map(item => (
              <Link
                key={item.key}
                to={item.to}
                className={`vicar-header__link ${currentPage === item.key ? 'is-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="vicar-header__actions">
            <Link to="/contact-us" className="vicar-header__cta">
              {t('header.concierge')}
            </Link>

            <button
              type="button"
              className={`vicar-header__burger ${isMenuOpen ? 'is-open' : ''}`}
              onClick={toggleMenu}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="vicar-mobile-drawer"
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="vicar-mobile-drawer"
        className={`vicar-drawer ${isMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="vicar-drawer__header">
          <span className="vicar-drawer__title">{t('header.menu')}</span>
          <button type="button" className="vicar-drawer__close" onClick={closeMenu} aria-label="Close menu">
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="vicar-drawer__nav">
          {navItems.map(item => (
            <Link
              key={item.key}
              to={item.to}
              className={`vicar-drawer__link ${currentPage === item.key ? 'is-active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="vicar-drawer__footer">
          <Link to="/contact-us" className="vicar-drawer__cta" onClick={closeMenu}>
            {t('header.contactConcierge')}
          </Link>
          <p className="vicar-drawer__hint">{t('header.tagline')}</p>
        </div>
      </div>

      {isMenuOpen && <div className="vicar-drawerOverlay" onClick={closeMenu} aria-hidden="true"></div>}
    </header>
  );
}

export default VicarHeader;

