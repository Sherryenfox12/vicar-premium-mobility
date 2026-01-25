import React, { useState, useEffect } from 'react';
import './AD_BannerMedia.css';

const AD_BannerMedia = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mediaData, setMediaData] = useState({
    home: Array(5).fill(null), // 5 slots for home
    aboutUs: [null], // 1 slot for about us
    ourService: [null], // 1 slot for our service
    discover: [null], // 1 slot for discover
    contactUs: [null] // 1 slot for contact us
  });

  
  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;

  const tabs = [
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'aboutUs', title: 'About Us', icon: 'ℹ️' },
    { id: 'ourService', title: 'Our Service', icon: '🔧' },
    { id: 'discover', title: 'Discover', icon: '🔍' },
    { id: 'contactUs', title: 'Contact Us', icon: '📞' }
  ];

  // API functions
  const fetchBannerMedia = async (page) => {
    try {
      console.log(`Fetching banner media for ${page}...`);
      const response = await fetch(`${API_BASE_URL}/get-banner-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`Successfully fetched banner media for ${page}:`, result.data);
        return result.data;
      } else {
        console.error(`API error for ${page}:`, result.error);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching banner media for ${page}:`, error);
      return null;
    }
  };

  const uploadBannerMedia = async (page, slotIndex, file) => {
    try {
      console.log(`Uploading banner media for ${page}, slot ${slotIndex}...`);
      
      const formData = new FormData();
      formData.append('media', file);
      formData.append('page', page);
      formData.append('slotIndex', slotIndex.toString());
      
      const response = await fetch(`${API_BASE_URL}/save-banner-media`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`Successfully uploaded banner media for ${page}, slot ${slotIndex}:`, result.data);
        return {
          url: result.data.url,
          mimeType: result.data.mimeType,
          size: result.data.fileSize,
          uploadedAt: result.data.uploadedAt,
          filename: result.data.filename,
          originalName: result.data.originalName,
          thumbnail: result.data.thumbnail
        };
      } else {
        console.error(`API error uploading media:`, result.error);
        alert(`Upload failed: ${result.message}`);
        return null;
      }
    } catch (error) {
      console.error(`Error uploading banner media:`, error);
      alert(`Upload failed: ${error.message}`);
      return null;
    }
  };

  const deleteBannerMedia = async (page, slotIndex) => {
    try {
      console.log(`Deleting banner media for ${page}, slot ${slotIndex}...`);
      
      const response = await fetch(`${API_BASE_URL}/delete-banner-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, slotIndex })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`Successfully deleted banner media for ${page}, slot ${slotIndex}`);
        return true;
      } else {
        console.error(`API error deleting media:`, result.error);
        alert(`Delete failed: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting banner media:`, error);
      alert(`Delete failed: ${error.message}`);
      return false;
    }
  };

  useEffect(() => {
    // Load banner media data for all pages
    const loadBannerMedia = async () => {
      console.log('Loading banner media for all pages...');
      for (const tab of tabs) {
        const data = await fetchBannerMedia(tab.id);
        if (data) {
          console.log(`Loaded data for ${tab.id}:`, data);
          setMediaData(prev => ({
            ...prev,
            [tab.id]: data
          }));
        } else {
          console.log(`No data found for ${tab.id}`);
        }
      }
    };
    loadBannerMedia();
  }, []);

  const handleFileUpload = async (page, slotIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image (JPEG, PNG, GIF) or video (MP4, WebM) file.');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size must be less than 50MB.');
      return;
    }

    // Show loading state
    const uploadBtn = document.querySelector(`#upload-${page}-${slotIndex}`);
    const originalText = uploadBtn?.textContent;
    if (uploadBtn) {
      uploadBtn.textContent = '⏳ Uploading...';
      uploadBtn.disabled = true;
    }

    try {
      // Upload file
      const result = await uploadBannerMedia(page, slotIndex, file);
      if (result) {
        // Update local state
        setMediaData(prev => ({
          ...prev,
          [page]: prev[page].map((item, index) => 
            index === slotIndex ? result : item
          )
        }));
        
        // Show success message
        alert('Media uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      // Reset button state
      if (uploadBtn) {
        uploadBtn.textContent = originalText;
        uploadBtn.disabled = false;
      }
      
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleDeleteMedia = async (page, slotIndex) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        const result = await deleteBannerMedia(page, slotIndex);
        if (result) {
          // Update local state
          setMediaData(prev => ({
            ...prev,
            [page]: prev[page].map((item, index) => 
              index === slotIndex ? null : item
            )
          }));
          
          // Show success message
          alert('Media deleted successfully!');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    
    // Refresh data for the selected tab
    const data = await fetchBannerMedia(tabId);
    if (data) {
      setMediaData(prev => ({
        ...prev,
        [tabId]: data
      }));
    }
  };

  const renderMediaSlot = (page, slotIndex, media) => {
    const isVideo = media && media.mimeType && media.mimeType.startsWith('video/');
    
    return (
      <div className="media-slot">
        <div className="media-slot-header">
          <h4>Slot {slotIndex + 1}</h4>
          <div className="media-slot-actions">
            <input
              type="file"
              id={`upload-${page}-${slotIndex}`}
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(page, slotIndex, e)}
              style={{ display: 'none' }}
            />
            <label htmlFor={`upload-${page}-${slotIndex}`} className="upload-btn">
              📁 Upload
            </label>
            {media && (
              <button 
                className="delete-btn"
                onClick={() => handleDeleteMedia(page, slotIndex)}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
        
        <div className="media-preview">
          {media ? (
            <div className="media-content">
              {isVideo ? (
                <video 
                  src={media.url} 
                  controls 
                  className="media-element"
                  poster={media.thumbnail}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Video load error:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onLoad={() => console.log('Video loaded successfully:', media.url)}
                />
              ) : (
                <img 
                  src={media.url} 
                  alt={`Banner ${slotIndex + 1}`}
                  className="media-element"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Image load error:', e.target.src, e.target.error);
                    console.error('Error details:', e.target.error);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', media.url)}
                />
              )}
              
              {/* Fallback for failed media loads */}
              <div className="media-fallback" style={{ display: 'none' }}>
                <div className="media-placeholder">
                  <div className="placeholder-icon">❌</div>
                  <p>Failed to load media</p>
                  <p className="placeholder-hint">Check console for errors</p>
                </div>
              </div>
              
              <div className="media-info">
                <p><strong>Type:</strong> {isVideo ? 'Video' : 'Image'}</p>
                <p><strong>Size:</strong> {media.size ? `${(media.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
                <p><strong>Uploaded:</strong> {media.uploadedAt ? new Date(media.uploadedAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          ) : (
            <div className="media-placeholder">
              <div className="placeholder-icon">📷</div>
              <p>No media uploaded</p>
              <p className="placeholder-hint">Click "Upload" to add image or video</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentData = mediaData[activeTab];
    const slotCount = activeTab === 'home' ? 5 : 1;

    return (
      <div className="banner-media-content">
        <div className="content-header">
          <h2>{tabs.find(tab => tab.id === activeTab)?.title} Banner Media</h2>
          <p>
            {activeTab === 'home' 
              ? 'Manage up to 5 banner images/videos for the home page'
              : 'Manage the banner image/video for this page'
            }
          </p>
        </div>

        <div className="media-slots-container">
          {Array.from({ length: slotCount }, (_, index) => 
            renderMediaSlot(activeTab, index, currentData[index])
          )}
        </div>

        <div className="banner-media-info">
          <h3>📋 Guidelines</h3>
          <ul>
            <li>Supported formats: JPEG, PNG, GIF (images), MP4, WebM (videos)</li>
            <li>Maximum file size: 50MB</li>
            <li>Recommended dimensions: 1920x1080 or similar aspect ratio</li>
            <li>Videos should be optimized for web playback</li>
            <li>Images should be high quality but compressed for web</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="banner-media-page">
      <div className="banner-media-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-title">{tab.title}</span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

export default AD_BannerMedia;
