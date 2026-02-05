import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://vicar.com.my';
const DEFAULT_OG_IMAGE = SITE_URL + encodeURI('/logo/ViCAR Logo -  Tran base 2_ViCAR White base bright.png');

const DEFAULT_KEYWORDS = 'Vicar, premium mobility, car rental Malaysia, chauffeur service, reconditioned cars, luxury car rental, point to point transport, Malaysia';
const SITE_NAME = 'Vicar - Premium Mobility';

/**
 * SEO component for page-level meta tags and Open Graph
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} [props.path] - Path for canonical URL (e.g. '/', '/contact-us')
 * @param {string} [props.image] - OG image URL
 * @param {number} [props.priority] - Sitemap priority (0.0-1.0, e.g. 1.0 for Home, 0.8 for main pages)
 * @param {string} [props.keywords] - Meta keywords (optional, uses default if not provided)
 */
function SEO({ title, description, path = '/', image = DEFAULT_OG_IMAGE, priority = 0.8, keywords = DEFAULT_KEYWORDS }) {
  const canonicalUrl = `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Vicar - Premium Mobility" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="#111111" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_MY" />
      <meta property="og:locale:alternate" content="zh_MY" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="sitemap-priority" content={String(priority)} />
    </Helmet>
  );
}

export default SEO;
