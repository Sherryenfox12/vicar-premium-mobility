import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import './DiscoverDetails.css';


function DiscoverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;

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

  // Fetch specific blog from the backend
  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/load-single-blogs/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.data);
        console.log('Fetched blog:', data.data); // Debug log
      } else {
        setError(data.error || 'Failed to fetch blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(t('discover.unableToConnect'));
      } else {
        setError(t('discover.failedToFetch'));
      }
    } finally {
      setLoading(false);
    }
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

  // Get media URLs from mediaurl string
  const getMediaUrls = (mediaurl) => {
    if (!mediaurl) return [];
    const urls = mediaurl.split(',').filter(url => url.trim());
    console.log('All media URLs:', urls); // Debug log
    return urls.map(url => standardizeMediaUrl(url)).filter(url => url !== null);
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

  // Auto-scroll through media
  useEffect(() => {
    if (!autoScroll || !blog) return;

    const mediaUrls = getMediaUrls(blog.mediaurl);
    if (mediaUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaUrls.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [autoScroll, blog]);

  // Navigate to next media
  const nextMedia = () => {
    const mediaUrls = getMediaUrls(blog?.mediaurl);
    if (mediaUrls.length > 1) {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaUrls.length);
    }
  };

  // Navigate to previous media
  const prevMedia = () => {
    const mediaUrls = getMediaUrls(blog?.mediaurl);
    if (mediaUrls.length > 1) {
      setCurrentMediaIndex((prev) => 
        prev === 0 ? mediaUrls.length - 1 : prev - 1
      );
    }
  };

  // Go to specific media
  const goToMedia = (index) => {
    setCurrentMediaIndex(index);
  };

  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  // Handle media click - redirect to external link if available
  const handleMediaClick = () => {
    if (blog.linkto) {
      window.open(blog.linkto, '_blank', 'noopener,noreferrer');
    }
  };

  // Go back to discover page
  const handleBackToDiscover = () => {
    navigate('/discover');
  };

  // Fetch blog on component mount
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Scroll to top when component mounts (bounce animation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="discover-details-page">
        <VicarHeader currentPage="discover" />
        <main className="discover-details-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('discoverDetails.loadingBlog')}</p>
          </div>
        </main>
        <VicarFooter />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="discover-details-page">
        <VicarHeader currentPage="discover" />
        <main className="discover-details-content">
          <div className="error-state">
            <p>{t('discoverDetails.errorBlogNotFound')}</p>
            <button onClick={handleBackToDiscover}>{t('discoverDetails.backToDiscover')}</button>
            <button onClick={fetchBlog}>{t('discoverDetails.retry')}</button>
          </div>
        </main>
        <VicarFooter />
      </div>
    );
  }

  const mediaUrls = getMediaUrls(blog.mediaurl);
  const currentMediaUrl = mediaUrls[currentMediaIndex];

  return (
    <div className="discover-details-page">
      {/* Header Component */}
      <VicarHeader currentPage="discover" />

      {/* Main Content */}
      <main className="discover-details-content">
        <div className="container">
          {/* Back Button */}
          <button className="back-button" onClick={handleBackToDiscover}>
            
          </button>

          {/* Blog Media Gallery */}
          {mediaUrls.length > 0 && (
            <div className="blog-media-gallery">
              <div 
                className={`blog-media-container ${blog.linkto ? 'clickable-media' : ''}`}
                onClick={blog.linkto ? handleMediaClick : undefined}
                style={{ cursor: blog.linkto ? 'pointer' : 'default' }}
              >
                {currentMediaUrl.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) ? (
                  <video 
                    src={currentMediaUrl} 
                    alt={`${blog.title} - Media ${currentMediaIndex + 1}`}
                    className="blog-media"
                    controls
                    crossOrigin="anonymous"
                    preload="metadata"
                    onError={(e) => {
                      console.error('Video load error:', e.target.src);
                      e.target.style.display = 'none';
                      const placeholder = e.target.nextElementSibling;
                      if (placeholder) {
                        placeholder.style.display = 'block';
                      }
                    }}
                    onLoad={() => console.log('Video loaded successfully:', currentMediaUrl)}
                  />
                ) : (
                  <img 
                    src={currentMediaUrl} 
                    alt={`${blog.title} - Media ${currentMediaIndex + 1}`}
                    className="blog-media"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src, e.target.error);
                      console.error('Error details:', e.target.error);
                      e.target.style.display = 'none';
                      const placeholder = e.target.nextElementSibling;
                      if (placeholder) {
                        placeholder.style.display = 'block';
                      }
                    }}
                    onLoad={() => console.log('Image loaded successfully:', currentMediaUrl)}
                  />
                )}
                
                {/* Placeholder for when media fails to load */}
                <div className="blog-media-placeholder" style={{ display: 'none' }}>
                  {t('discoverDetails.mediaNotAvailable')}
                </div>
                
                {mediaUrls.length > 1 && (
                  <>
                    <div 
                      className="media-counter"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentMediaIndex + 1} / {mediaUrls.length}
                    </div>
                    <button 
                      className="media-nav prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevMedia();
                      }}
                      aria-label={t('discoverDetails.previousMedia')}
                    >
                      ‹
                    </button>
                    <button 
                      className="media-nav next"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextMedia();
                      }}
                      aria-label={t('discoverDetails.nextMedia')}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Media Thumbnails */}
              {mediaUrls.length > 1 && (
                <div className="media-thumbnails">
                  {mediaUrls.map((url, index) => (
                    <div 
                      key={index}
                      className={`media-thumbnail ${index === currentMediaIndex ? 'active' : ''} ${blog.linkto ? 'clickable-thumbnail' : ''}`}
                      onClick={blog.linkto ? handleMediaClick : () => goToMedia(index)}
                      style={{ cursor: blog.linkto ? 'pointer' : 'pointer' }}
                    >
                      {url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) ? (
                        <video 
                          src={url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="thumbnail-media"
                          crossOrigin="anonymous"
                          preload="metadata"
                        />
                      ) : (
                        <img 
                          src={url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="thumbnail-media"
                          crossOrigin="anonymous"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blog Content (Title and Body combined) */}
          <div className="blog-content-combined">
            <div className="blog-header">
              <h1 className="blog-title">{getLocalizedContent(blog.title, 'No Title')}</h1>
              <div className="blog-meta">
                <span className="blog-date">📅 {formatDate(blog.lastmodify || blog.createdby)}</span>
              </div>
            </div>

            {/* Blog Body */}
            <div className="blog-body">
              <div 
                className="blog-body-content"
                dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog.body, 'No Content') }}
              />
            </div>

            {/* External Link 
            {blog.linkto && (
              <div className="blog-external-link">
                <a 
                  href={blog.linkto} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link-btn"
                >
                  🔗 Read More at External Source
                </a>
              </div>
            )}
              */}
              
          </div>

          {/* Blog Footer */}
          <div className="blog-footer">
            <button className="back-to-discover-btn" onClick={handleBackToDiscover}>
              {t('discoverDetails.backToAllBlogs')}
            </button>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <VicarFooter />
    </div>
  );
}

export default DiscoverDetails;
