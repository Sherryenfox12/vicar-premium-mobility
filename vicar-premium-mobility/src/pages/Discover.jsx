import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import FloatingCarButton from '../components/FloatingCarButton';
import './Discover.css';

function Discover() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banner media state
  const [bannerMedia, setBannerMedia] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;
  console.log('API_BASE_URL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:', API_BASE_URL);

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
        body: JSON.stringify({ page: 'discover' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Get the first non-null media item
        const mediaItem = result.data.find(media => media !== null);
        if (mediaItem) {
          console.log('Loaded banner media for Discover:', mediaItem);
          setBannerMedia(mediaItem);
        } else {
          console.log('No banner media found for Discover, using default');
          setBannerMedia(null);
        }
      } else {
        console.log('API returned no data for Discover, using default');
        setBannerMedia(null);
      }
    } catch (error) {
      console.error('Error fetching banner media for Discover:', error);
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


  // Helper function to get content in current language
  const getLocalizedContent = (content, fallback = '') => {
    if (!content) return fallback;
    
    // Handle both old format (string) and new format (object with en/zh)
    if (typeof content === 'string') {
      return content;
    }
    
    // New bilingual format
    const currentLang = i18n.language === 'zh' ? 'zh' : 'en';
    return content[currentLang] || content.en || content.zh || fallback;
  };

  // Fetch all blogs from the backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_VICAR_BACKEND}/api/load-all-blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        console.log('not ok');
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const data = await response.json();
      
      
      console.log('Data:', data);
      if (data.success) {
        console.log('success');
        
        setBlogs(data.data || []);
        console.log('Fetched blogs:', data.data); // Debug log
      } else {
        console.log('not success');
        setError(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(t('discover.unableToConnect'));
      } else {
        setError(t('discover.failedToFetch'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle read more button clicks
  const handleReadMore = (blogId) => {
    navigate(`/discover-details/${blogId}`);
  };

  // Empty function for explore inventory button
  const handleExploreInventory = () => {
    // TODO: Navigate to inventory page
    console.log('Explore inventory clicked');
  };

  // Empty function for contact us button
  const handleContactUs = () => {
    // TODO: Navigate to contact page
    console.log('Contact us clicked');
  };

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

  // Get first media URL from mediaurl string
  const getFirstMediaUrl = (mediaurl) => {
    if (!mediaurl) return null;
    const urls = mediaurl.split(',').filter(url => url.trim());
    console.log('Media URLs:', urls); // Debug log
    const firstUrl = urls.length > 0 ? urls[0] : null;
    return standardizeMediaUrl(firstUrl);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return t('discover.dateNotAvailable');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return t('discover.dateNotAvailable');
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="discover-page">
        <VicarHeader currentPage="discover" />
        <main>
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
                    src="/BMW M4 Competition.jpg" 
                    alt="BMW Luxury Car" 
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
                    preload="metadata"
                    onError={(e) => {
                      console.error('Video load error:', e.target.src);
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) {
                        fallback.style.display = 'block';
                      }
                    }}
                    onLoad={() => console.log('Video loaded successfully:', bannerMedia.url)}
                  />
                ) : (
                  <img 
                    src={standardizeMediaUrl(bannerMedia.url)} 
                    alt="Discover Banner" 
                    className="hero-bg-image"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src, e.target.error);
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) {
                        fallback.style.display = 'block';
                      }
                    }}
                    onLoad={() => console.log('Image loaded successfully:', bannerMedia.url)}
                  />
                )
              ) : (
                <img 
                  src="/BMW M4 Competition.jpg" 
                  alt="BMW Luxury Car" 
                  className="hero-bg-image"
                  crossOrigin="anonymous"
                />
              )}
              
              {/* Fallback for failed media loads */}
              <div className="hero-fallback" style={{ display: 'none' }}>
                <img 
                  src="/BMW M4 Competition.jpg" 
                  alt="BMW Luxury Car" 
                  className="hero-bg-image"
                  crossOrigin="anonymous"
                />
              </div>
              
              <div className="hero-overlay"></div>
              <div className="hero-black-overlay"></div>
            </div>
            <div className="hero-content">
              <h1 className="hero-title">{t('discover.heroTitle')}</h1>
              <p className="hero-subtitle">{t('discover.heroSubtitle')}</p>
            </div>
          </section>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('discover.loadingBlogs')}</p>
          </div>
        </main>
        <VicarFooter />
        
        {/* Floating Car Button */}
        <FloatingCarButton />
      </div>
    );
  }

  return (
    <div className="discover-page">
      {/* Header Component */}
      <VicarHeader currentPage="discover" />

      {/* Main Content */}
      <main>
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
                  src="/BMW M4 Competition.jpg" 
                  alt="BMW Luxury Car" 
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
                  preload="metadata"
                  onError={(e) => {
                    console.error('Video load error:', e.target.src);
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) {
                      fallback.style.display = 'block';
                    }
                  }}
                  onLoad={() => console.log('Video loaded successfully:', bannerMedia.url)}
                />
              ) : (
                <img 
                  src={standardizeMediaUrl(bannerMedia.url)} 
                  alt="Discover Banner" 
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
                src="/BMW M4 Competition.jpg" 
                alt="BMW Luxury Car" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Fallback for failed media loads */}
            <div className="hero-fallback" style={{ display: 'none' }}>
              <img 
                src="/BMW M4 Competition.jpg" 
                alt="BMW Luxury Car" 
                className="hero-bg-image"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="hero-overlay"></div>
            <div className="hero-black-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t('discover.heroTitle')}</h1>
            <p className="hero-subtitle">{t('discover.heroSubtitle')}</p>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="blog-section">
          <div className="container">
            {error ? (
              <div className="error-message">
                <p>{t('discover.errorMessage')} {error}</p>
                <button onClick={fetchBlogs}>{t('discover.retry')}</button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="empty-state">
                <p>{t('discover.noBlogsAvailable')}</p>
              </div>
            ) : (
              <div className="blog-grid">
                {blogs.map((blog) => {
                  const firstMediaUrl = getFirstMediaUrl(blog.mediaurl);
                  console.log('Blog:', blog.title, 'Media URL:', firstMediaUrl); // Debug log
                  
                  return (
                    <div key={blog._id} className="blog-card">
                      <div className="blog-image-container">
                        {firstMediaUrl ? (
                          firstMediaUrl.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) ? (
                            <video 
                              src={firstMediaUrl} 
                              alt={blog.title}
                              className="blog-image"
                              controls
                              crossOrigin="anonymous"
                              preload="metadata"
                              onError={(e) => {
                                console.error('Video load error:', e.target.src); // Debug log
                                e.target.style.display = 'none';
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder) {
                                  placeholder.style.display = 'block';
                                }
                              }}
                              onLoad={() => console.log('Video loaded successfully:', firstMediaUrl)} // Debug log
                            />
                          ) : (
                            <img 
                              src={firstMediaUrl} 
                              alt={blog.title}
                              className="blog-image"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error('Image load error:', e.target.src, e.target.error); // Debug log
                                console.error('Error details:', e.target.error);
                                e.target.style.display = 'none';
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder) {
                                  placeholder.style.display = 'block';
                                }
                              }}
                              onLoad={() => console.log('Image loaded successfully:', firstMediaUrl)} // Debug log
                            />
                          )
                        ) : (
                          <div className="blog-image-placeholder">
                            {t('discover.noMedia')}
                          </div>
                        )}
                      </div>
                      <div className="blog-content">
                        <p className="blog-date">{formatDate(blog.lastmodify || blog.createdby)}</p>
                        <h3>{getLocalizedContent(blog.title, 'No Title')}</h3>
                        <p className="blog-excerpt">{getLocalizedContent(blog.summary, 'No Summary')}</p>
                        <button className="read-more-btn" onClick={() => handleReadMore(blog._id)}>
                          {t('discover.readMore')} <span className="arrow">→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

     
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />
    </div>
  );
}

export default Discover; 