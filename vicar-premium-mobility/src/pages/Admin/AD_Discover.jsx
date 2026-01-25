import React, { useState, useEffect, useRef } from 'react';
import './AD_Discover.css';
import SimpleRichEditor from '../../components/SimpleRichEditor';
import SimpleRichRenderer from '../../components/SimpleRichRenderer';

const AD_Discover = () => {
  const richEditorRef = useRef(null);
  const richEditorZhRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    title: {
      en: '',
      zh: ''
    },
    summary: {
      en: '',
      zh: ''
    },
    body: {
      en: '',
      zh: ''
    },
    linkto: '',
    mediaurl: ''
  });

  // Media upload state
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentMedia, setCurrentMedia] = useState([]); // Current media URLs from existing blog
  const [mediaToDelete, setMediaToDelete] = useState([]); // Media URLs to be deleted
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState(null);

  const API_BASE_URL = `${import.meta.env.VITE_VICAR_BACKEND}/api`;

  // Fetch all blogs from the backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/load-all-blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data || []);
        setFilteredBlogs(data.data || []);
        console.log('Fetched blogs:', data.data); // Debug log
      } else {
        setError(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to fetch blogs. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Upload multiple media files
  const uploadMultipleMedia = async (files) => {
    try {
             setUploadingMedia(true);
       setMediaUploadError(null);
       
       // Try multiple upload first
       try {
         const formData = new FormData();
         files.forEach((file, index) => {
           formData.append('media', file);
         });
         
         const response = await fetch(`${API_BASE_URL}/upload-multiple-media`, {
           method: 'POST',
           body: formData
         });
         
         const data = await response.json();
         
         if (data.success) {
           return data.files.map(file => file.url); // Return array of URLs
         } else {
           throw new Error(data.error || 'Multiple media upload failed');
         }
       } catch (multipleError) {
         // Fallback to individual uploads
         const urls = [];
         for (const file of files) {
           const formData = new FormData();
           formData.append('media', file);
           
           const response = await fetch(`${API_BASE_URL}/upload-media`, {
             method: 'POST',
             body: formData
           });
           
           const data = await response.json();
           
           if (data.success) {
             urls.push(data.file.url);
           } else {
             throw new Error(`Failed to upload ${file.name}: ${data.error}`);
           }
         }
         
         return urls;
       }
    } catch (err) {
      setMediaUploadError(err.message);
      throw err;
    } finally {
      setUploadingMedia(false);
    }
  };

  // Create new blog
  const createBlog = async (e) => {
    e.preventDefault();
    
    // Get current HTML content from rich text editors
    const htmlContentEn = richEditorRef.current ? richEditorRef.current.getCurrentHTML() : formData.body.en;
    const htmlContentZh = richEditorZhRef.current ? richEditorZhRef.current.getCurrentHTML() : formData.body.zh;
    
    // Validate that at least one media file is selected
    if (mediaFiles.length === 0) {
      setMediaUploadError('Please select at least one media file');
      return;
    }
    
    // Validate bilingual content - check if fields are not empty strings
    if (!formData.title.en?.trim() || !formData.title.zh?.trim() || 
        !formData.summary.en?.trim() || !formData.summary.zh?.trim() || 
        !htmlContentEn?.trim() || !htmlContentZh?.trim()) {
      setMediaUploadError('Please fill in both English and Chinese versions for all fields');
      return;
    }
    
    try {
      let mediaUrls = [];
      
      // Upload media if selected
      if (mediaFiles.length > 0) {
        mediaUrls = await uploadMultipleMedia(mediaFiles);
      }
      
      const blogData = {
        title: {
          en: formData.title.en.trim(),
          zh: formData.title.zh.trim()
        },
        summary: {
          en: formData.summary.en.trim(),
          zh: formData.summary.zh.trim()
        },
        body: {
          en: htmlContentEn.trim(), // Use the HTML content from the English editor
          zh: htmlContentZh.trim() // Use the HTML content from the Chinese editor
        },
        linkto: formData.linkto,
        mediaurl: mediaUrls.join(',') // Join multiple URLs with comma for backend
      };
       
       const response = await fetch(`${API_BASE_URL}/create-blogs`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(blogData)
       });
       
       const data = await response.json();
      
      if (data.success) {
        // Reset form and refresh blogs
        setFormData({
          title: { en: '', zh: '' },
          summary: { en: '', zh: '' },
          body: { en: '', zh: '' },
          linkto: '',
          mediaurl: ''
        });
        setMediaFiles([]);
        setCurrentMedia([]);
        setMediaToDelete([]);
        setShowAddForm(false);
        // Reset the file input
        const fileInput = document.getElementById('media');
        if (fileInput) fileInput.value = '';
        fetchBlogs();
        alert('Blog created successfully!');
      } else {
        alert(data.error || 'Failed to create blog');
      }
         } catch (err) {
       alert('Error creating blog: ' + err.message);
     }
  };

  // Delete media files from server
  const deleteMediaFiles = async (mediaUrls) => {
    const deletePromises = mediaUrls.map(async (url) => {
      try {
        // Extract filename from URL
        const filename = url.split('/').pop();
        const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          console.warn(`Failed to delete file: ${filename}`);
        }
        return { success: response.ok, filename };
      } catch (error) {
        console.error(`Error deleting file ${url}:`, error);
        return { success: false, filename: url.split('/').pop(), error: error.message };
      }
    });
    
    return Promise.all(deletePromises);
  };

  // Update existing blog
  const updateBlog = async (e) => {
    e.preventDefault();
    
    // Get current HTML content from rich text editors
    const htmlContentEn = richEditorRef.current ? richEditorRef.current.getCurrentHTML() : formData.body.en;
    const htmlContentZh = richEditorZhRef.current ? richEditorZhRef.current.getCurrentHTML() : formData.body.zh;
    
    // Calculate final media URLs (current media minus deleted media plus new media)
    const remainingCurrentMedia = currentMedia.filter(url => !mediaToDelete.includes(url));
    const totalMediaCount = remainingCurrentMedia.length + mediaFiles.length;
    
    // Validate that at least one media file remains
    if (totalMediaCount === 0) {
      setMediaUploadError('Please select at least one media file');
      return;
    }
    
    // Validate bilingual content - check if fields are not empty strings
    if (!formData.title.en?.trim() || !formData.title.zh?.trim() || 
        !formData.summary.en?.trim() || !formData.summary.zh?.trim() || 
        !htmlContentEn?.trim() || !htmlContentZh?.trim()) {
      setMediaUploadError('Please fill in both English and Chinese versions for all fields');
      return;
    }
    
    try {
      let mediaUrls = [...remainingCurrentMedia];
      
      // Upload new media if selected
      if (mediaFiles.length > 0) {
        const newMediaUrls = await uploadMultipleMedia(mediaFiles);
        mediaUrls = [...mediaUrls, ...newMediaUrls];
      }
      
      const blogData = {
        title: {
          en: formData.title.en.trim(),
          zh: formData.title.zh.trim()
        },
        summary: {
          en: formData.summary.en.trim(),
          zh: formData.summary.zh.trim()
        },
        body: {
          en: htmlContentEn.trim(), // Use the HTML content from the English editor
          zh: htmlContentZh.trim() // Use the HTML content from the Chinese editor
        },
        linkto: formData.linkto,
        mediaurl: mediaUrls.join(',') // Join multiple URLs with comma for backend
      };
      
      const response = await fetch(`${API_BASE_URL}/update-blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Delete media files that were marked for deletion
        if (mediaToDelete.length > 0) {
          console.log('Deleting media files:', mediaToDelete);
          const deleteResults = await deleteMediaFiles(mediaToDelete);
          const failedDeletions = deleteResults.filter(result => !result.success);
          
          if (failedDeletions.length > 0) {
            console.warn('Some media files could not be deleted:', failedDeletions);
          }
        }
        
        // Reset form and refresh blogs
        setFormData({
          title: { en: '', zh: '' },
          summary: { en: '', zh: '' },
          body: { en: '', zh: '' },
          linkto: '',
          mediaurl: ''
        });
        setMediaFiles([]);
        setCurrentMedia([]);
        setMediaToDelete([]);
        setEditingBlog(null);
        // Reset the file input
        const fileInput = document.getElementById('media');
        if (fileInput) fileInput.value = '';
        fetchBlogs();
        alert('Blog updated successfully!');
      } else {
        alert(data.error || 'Failed to update blog');
      }
    } catch (err) {
      alert('Error updating blog: ' + err.message);
    }
  };

  // Delete blog
  const deleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    
    try {
      // First, get the blog data to extract media URLs
      const blogResponse = await fetch(`${API_BASE_URL}/load-single-blogs/${blogId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const blogData = await blogResponse.json();
      
      if (!blogData.success) {
        alert('Failed to load blog data for deletion');
        return;
      }
      
      // Delete the blog
      const response = await fetch(`${API_BASE_URL}/delete-blogs/${blogId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Delete associated media files
        if (blogData.data.mediaurl) {
          const mediaUrls = blogData.data.mediaurl.split(',').filter(url => url.trim());
          if (mediaUrls.length > 0) {
            console.log('Deleting media files for deleted blog:', mediaUrls);
            const deleteResults = await deleteMediaFiles(mediaUrls);
            const failedDeletions = deleteResults.filter(result => !result.success);
            
            if (failedDeletions.length > 0) {
              console.warn('Some media files could not be deleted:', failedDeletions);
            }
          }
        }
        
        fetchBlogs();
        alert('Blog deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Error deleting blog: ' + err.message);
    }
  };

  // Edit blog
  const editBlog = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: {
        en: blog.title?.en || '',
        zh: blog.title?.zh || ''
      },
      summary: {
        en: blog.summary?.en || '',
        zh: blog.summary?.zh || ''
      },
      body: {
        en: blog.body?.en || '',
        zh: blog.body?.zh || ''
      },
      linkto: blog.linkto || '',
      mediaurl: blog.mediaurl || ''
    });
    setMediaFiles([]);
    
    // Set current media from existing blog
    const existingMedia = blog.mediaurl ? blog.mediaurl.split(',').filter(url => url.trim()) : [];
    setCurrentMedia(existingMedia);
    setMediaToDelete([]); // Reset media to delete
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingBlog(null);
    setFormData({
      title: { en: '', zh: '' },
      summary: { en: '', zh: '' },
      body: { en: '', zh: '' },
      linkto: '',
      mediaurl: ''
    });
    setMediaFiles([]);
    setCurrentMedia([]);
    setMediaToDelete([]);
    // Reset the file input
    const fileInput = document.getElementById('media');
    if (fileInput) fileInput.value = '';
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested language fields
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      // Handle simple fields like linkto
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle media file selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Calculate total media count (current + new files)
    const totalMediaCount = currentMedia.length + files.length - mediaToDelete.length;
    
    // Validate total file count (1-3 files)
    if (totalMediaCount > 3) {
      setMediaUploadError(`Maximum 3 media files allowed. You have ${currentMedia.length - mediaToDelete.length} current files and trying to add ${files.length} new files.`);
      return;
    }
    
    if (files.length === 0) {
      setMediaFiles([]);
      setMediaUploadError(null);
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setMediaUploadError('Invalid file type. Only images and videos are allowed.');
      return;
    }
    
    setMediaFiles(files);
    setMediaUploadError(null);
  };

  // Handle removing selected files
  const removeSelectedFile = (indexToRemove) => {
    const newFiles = mediaFiles.filter((_, index) => index !== indexToRemove);
    setMediaFiles(newFiles);
    
    // Reset file input if no files left
    if (newFiles.length === 0) {
      const fileInput = document.getElementById('media');
      if (fileInput) fileInput.value = '';
    }
    
    setMediaUploadError(null);
  };

   // Handle current media deletion
   const handleDeleteCurrentMedia = (mediaUrl) => {
     // Calculate total media count after deletion
     const remainingCurrentMedia = currentMedia.length - 1 - mediaToDelete.length;
     const totalMediaCount = remainingCurrentMedia + mediaFiles.length;
     
     // Validate minimum file count (at least 1 file)
     if (totalMediaCount < 1) {
       setMediaUploadError('At least 1 media file is required');
       return;
     }
     
     // Add to media to delete list
     setMediaToDelete(prev => [...prev, mediaUrl]);
     setMediaUploadError(null);
   };

   // Handle undo current media deletion
   const handleUndoDeleteCurrentMedia = (mediaUrl) => {
     // Calculate total media count after undo
     const totalMediaCount = currentMedia.length + mediaFiles.length - (mediaToDelete.length - 1);
     
     // Validate maximum file count (max 3 files)
     if (totalMediaCount > 3) {
       setMediaUploadError('Maximum 3 media files allowed');
       return;
     }
     
     // Remove from media to delete list
     setMediaToDelete(prev => prev.filter(url => url !== mediaUrl));
     setMediaUploadError(null);
   };

  // Handle media navigation
  const nextMedia = (blogId) => {
    setMediaIndices(prev => ({
      ...prev,
      [blogId]: ((prev[blogId] || 0) + 1) % (blogs.find(b => b._id === blogId)?.mediaurl?.split(',').filter(url => url.trim()).length || 1)
    }));
  };

  const prevMedia = (blogId) => {
    setMediaIndices(prev => ({
      ...prev,
      [blogId]: prev[blogId] === 0 ? 
        (blogs.find(b => b._id === blogId)?.mediaurl?.split(',').filter(url => url.trim()).length - 1) : 
        (prev[blogId] || 0) - 1
    }));
  };

  // Search and filter blogs
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog => {
        const titleEn = blog.title?.en?.toLowerCase() || '';
        const titleZh = blog.title?.zh?.toLowerCase() || '';
        const summaryEn = blog.summary?.en?.toLowerCase() || '';
        const summaryZh = blog.summary?.zh?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return titleEn.includes(searchLower) || 
               titleZh.includes(searchLower) ||
               summaryEn.includes(searchLower) || 
               summaryZh.includes(searchLower);
      });
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

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

  // Get first media URL from mediaurl string (for debugging)
  const getFirstMediaUrl = (mediaurl) => {
    if (!mediaurl) return null;
    const urls = mediaurl.split(',').filter(url => url.trim());
    console.log('Media URLs:', urls); // Debug log
    const firstUrl = urls.length > 0 ? urls[0] : null;
    return standardizeMediaUrl(firstUrl);
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);





  // Render blog form
  const renderBlogForm = () => (
    <div className="ad-discover-blog-form-overlay">
      <div className="ad-discover-blog-form">
        <div className="ad-discover-form-header">
          <h3>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h3>
          <button 
            className="ad-discover-close-btn"
            onClick={() => {
              setShowAddForm(false);
              cancelEdit();
            }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={editingBlog ? updateBlog : createBlog}>
          <div className="ad-discover-form-group">
            <label htmlFor="title.en">Title (English) *</label>
            <input
              type="text"
              id="title.en"
              name="title.en"
              value={formData.title.en}
              onChange={handleInputChange}
              required
              maxLength={200}
              placeholder="Enter blog title in English"
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="title.zh">Title (Chinese) *</label>
            <input
              type="text"
              id="title.zh"
              name="title.zh"
              value={formData.title.zh}
              onChange={handleInputChange}
              required
              maxLength={200}
              placeholder="输入中文博客标题"
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="summary.en">Summary (English) *</label>
            <textarea
              id="summary.en"
              name="summary.en"
              value={formData.summary.en}
              onChange={handleInputChange}
              required
              maxLength={500}
              placeholder="Enter blog summary in English"
              rows={3}
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="summary.zh">Summary (Chinese) *</label>
            <textarea
              id="summary.zh"
              name="summary.zh"
              value={formData.summary.zh}
              onChange={handleInputChange}
              required
              maxLength={500}
              placeholder="输入中文博客摘要"
              rows={3}
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="body.en">Content (English) *</label>
            <SimpleRichEditor
              ref={richEditorRef}
              value={formData.body.en}
              placeholder="Enter blog content in English..."
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="body.zh">Content (Chinese) *</label>
            <SimpleRichEditor
              ref={richEditorZhRef}
              value={formData.body.zh}
              placeholder="输入中文博客内容..."
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="linkto">External Link (Optional)</label>
            <input
              type="url"
              id="linkto"
              name="linkto"
              value={formData.linkto}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="ad-discover-form-group">
            <label htmlFor="media">Media Files (Required, 1-3 files)</label>
            <input
              type="file"
              id="media"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
            />
                         <p className="ad-discover-file-hint">Select 1-3 media files (images or videos)</p>
            {mediaUploadError && (
              <p className="ad-discover-error-message">{mediaUploadError}</p>
            )}
            {mediaFiles.length > 0 && (
              <div className="ad-discover-selected-files">
                <p className="ad-discover-file-info">Selected files:</p>
                {mediaFiles.map((file, index) => (
                  <div key={index} className="ad-discover-file-item">
                    <span>📁 {file.name} ({file.type})</span>
                    <button 
                      type="button" 
                      className="ad-discover-remove-file-btn"
                      onClick={() => removeSelectedFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {editingBlog && currentMedia.length > 0 && (
              <div className="ad-discover-current-media">
                <p>Current media:</p>
                {currentMedia.map((url, index) => {
                  const isMarkedForDeletion = mediaToDelete.includes(url);
                  return (
                    <div key={index} className={`ad-discover-current-file ${isMarkedForDeletion ? 'marked-for-deletion' : ''}`}>
                      <span>🔗 {url}</span>
                      {isMarkedForDeletion ? (
                        <button 
                          type="button" 
                          className="ad-discover-undo-delete-btn"
                          onClick={() => handleUndoDeleteCurrentMedia(url)}
                          title="Undo delete"
                        >
                          ↶
                        </button>
                      ) : (
                        <button 
                          type="button" 
                          className="ad-discover-delete-file-btn"
                          onClick={() => handleDeleteCurrentMedia(url)}
                          title="Delete file"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="ad-discover-form-actions">
            <button 
              type="button" 
              className="ad-discover-cancel-btn"
              onClick={() => {
                setShowAddForm(false);
                cancelEdit();
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="ad-discover-submit-btn"
              disabled={uploadingMedia}
            >
              {uploadingMedia ? 'Uploading...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render blog cards
  const renderBlogCards = () => {
    if (filteredBlogs.length === 0) {
      return (
        <div className="ad-discover-empty-state">
          <p>No blogs found. {searchTerm ? 'Try adjusting your search.' : 'Create your first blog post!'}</p>
        </div>
      );
    }

    return (
      <div className="ad-discover-blogs-grid">
        {filteredBlogs.map((blog) => {
          const firstMediaUrl = getFirstMediaUrl(blog.mediaurl);
          console.log('Blog:', blog.title, 'Media URL:', firstMediaUrl); // Debug log
          
          return (
            <div key={blog._id} className="ad-discover-blog-card">
                        <div className="ad-discover-blog-image">
                          {(() => {
                            if (blog.mediaurl) {
                              const mediaUrls = blog.mediaurl.split(',').filter(url => url.trim());
                              
                              if (mediaUrls.length > 0) {
                                return (
                                  <div className="ad-discover-media-gallery">
                                    {(() => {
                                      const currentIndex = mediaIndices[blog._id] || 0;
                                      const currentUrl = mediaUrls[currentIndex];
                                      
                                      return (
                                        <div className="ad-discover-media-item">
                                          {currentUrl.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) ? (
                                            <video 
                                              src={standardizeMediaUrl(currentUrl)} 
                                              alt={`${blog.title} - Media ${currentIndex + 1}`}
                                              className="ad-discover-blog-image"
                                              controls
                                              onError={(e) => {
                                                console.error('Video load error:', e.target.src);
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                              }}
                                              onLoad={() => console.log('Video loaded successfully:', currentUrl)}
                                            />
                                          ) : (
                                            <img 
                                              src={standardizeMediaUrl(currentUrl)} 
                                              alt={`${blog.title} - Media ${currentIndex + 1}`}
                                              className="ad-discover-blog-image"
                                              crossOrigin="anonymous"
                                              onError={(e) => {
                                                console.error('Image load error:', e.target.src, e.target.error);
                                                console.error('Error details:', e.target.error);
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                              }}
                                              onLoad={() => console.log('Image loaded successfully:', currentUrl)}
                                            />
                                          )}
                                          
                                          {mediaUrls.length > 1 && (
                                            <>
                                              <div className="ad-discover-media-counter">
                                                {currentIndex + 1} / {mediaUrls.length}
                                              </div>
                                              <button 
                                                className="ad-discover-media-nav prev"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  prevMedia(blog._id);
                                                }}
                                              >
                                                ‹
                                              </button>
                                              <button 
                                                className="ad-discover-media-nav next"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  nextMedia(blog._id);
                                                }}
                                              >
                                                ›
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                          <div className="ad-discover-no-image" style={{ display: blog.mediaurl ? 'none' : 'block' }}>
                            📝 No Media
                          </div>
                        </div>
            
                         <div className="ad-discover-blog-content">
               <h4 className="ad-discover-blog-title">
                 <div className="ad-discover-blog-title-en">{blog.title?.en || 'No English title'}</div>
                 <div className="ad-discover-blog-title-zh">{blog.title?.zh || '无中文标题'}</div>
               </h4>
               <p className="ad-discover-blog-summary">
                 <div className="ad-discover-blog-summary-en">{blog.summary?.en || 'No English summary'}</div>
                 <div className="ad-discover-blog-summary-zh">{blog.summary?.zh || '无中文摘要'}</div>
               </p>
               {blog.body && (
                 <div className="ad-discover-blog-body">
                   <div className="ad-discover-blog-body-en">
                     <strong>English Content:</strong>
                     <SimpleRichRenderer content={blog.body?.en || ''} />
                   </div>
                   <div className="ad-discover-blog-body-zh">
                     <strong>中文内容:</strong>
                     <SimpleRichRenderer content={blog.body?.zh || ''} />
                   </div>
                 </div>
               )}
               {blog.linkto && (
                 <a href={blog.linkto} target="_blank" rel="noopener noreferrer" className="ad-discover-blog-link">
                   🔗 External Link
                 </a>
               )}
               <div className="ad-discover-blog-meta">
                 <span>📅 {new Date(blog.createdby).toLocaleDateString()}</span>
                 <span>🔄 {new Date(blog.lastmodify).toLocaleDateString()}</span>
               </div>
               
               <div className="ad-discover-blog-actions">
                 <button 
                   className="ad-discover-edit-btn"
                   onClick={() => editBlog(blog)}
                 >
                   Edit
                 </button>
                 <button 
                   className="ad-discover-delete-btn"
                   onClick={() => deleteBlog(blog._id)}
                 >
                   Delete
                 </button>
               </div>
             </div>
          </div>
        );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ad-discover">
        <div className="ad-discover-loading-state">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-discover">
      <div className="discover-header">
        <h2>Blog Management</h2>
        <p>Manage your blog posts and discover content</p>
      </div>

      <div className="discover-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
        
                 <div className="control-buttons">
           <button 
             className="add-blog-btn"
             onClick={() => setShowAddForm(true)}
           >
             + Add New Blog
           </button>
         </div>
      </div>

      {error && (
        <div className="ad-discover-error-message">
          <p>Error: {error}</p>
          <button onClick={fetchBlogs}>Retry</button>
        </div>
      )}

      <div className="discover-content">
        {renderBlogCards()}
      </div>

      {(showAddForm || editingBlog) && renderBlogForm()}
    </div>
  );
};

export default AD_Discover;
