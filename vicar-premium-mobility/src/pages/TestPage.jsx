import React, { useEffect, useRef, useState } from 'react';
import './TestPage.css';

function TestPage() {
  const videoRef = useRef(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [showText, setShowText] = useState(true);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [hideVideo, setHideVideo] = useState(false);
  const hasReachedFirstFrame = useRef(false);
  const hasScrolledFirst = useRef(false);
  const videoEnded = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Prevent scrolling until video ends
    const preventScroll = (e) => {
      if (!videoEnded.current) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

      // Handle video play to pause at first frame
      const handlePlay = () => {
        // Pause immediately at first frame
        if (!hasReachedFirstFrame.current) {
          hasReachedFirstFrame.current = true;
          // Use requestAnimationFrame to ensure we pause at the first frame
          requestAnimationFrame(() => {
            video.pause();
            setShowScrollPrompt(true);
            console.log('Video paused at first frame');
          });
        }
      };

    // Handle video end
    const handleVideoEnd = () => {
      videoEnded.current = true;
      // Start fade-out animation
      setVideoFadeOut(true);
      // Show greeting after fade-out animation completes
      setTimeout(() => {
        setShowGreeting(true);
        // Hide video container shortly after greeting appears
        setTimeout(() => {
          setHideVideo(true);
        }, 500);
        console.log('Video ended - scrolling enabled');
        console.log('Greeting should be visible now');
      }, 1000); // Match the fade-out duration
    };

      // Handle scroll/wheel event to resume video
      const handleScrollTrigger = (e) => {
        // If video hasn't reached first frame yet, prevent scroll
        if (!hasReachedFirstFrame.current) {
          e.preventDefault();
          return;
        }

      // First pause point - resume video after first scroll
      if (hasReachedFirstFrame.current && !hasScrolledFirst.current) {
        e.preventDefault();
        hasScrolledFirst.current = true;
        setShowScrollPrompt(false);
        setShowText(false);
        if (video.paused) {
          video.play();
          console.log('Video resumed after first scroll');
        }
        return;
      }

      // If video is still playing, prevent scroll
      if (!videoEnded.current) {
        e.preventDefault();
      }
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleVideoEnd);
    
    // Prevent scroll until video ends
    window.addEventListener('wheel', handleScrollTrigger, { passive: false });
    window.addEventListener('touchmove', handleScrollTrigger, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });

    // Start playing the video when loaded
    const handleCanPlay = () => {
      video.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('canplay', handleCanPlay);
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);
      window.removeEventListener('scroll', preventScroll);
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="test-page">
      {!hideVideo && (
        <div className={`video-container ${videoFadeOut ? 'fade-out' : ''}`}>
          <video
            ref={videoRef}
            className="fullscreen-video"
            muted
            playsInline
          >
            <source src="/video/alphard_start_car.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className={`video-text-overlay ${!showText ? 'fade-out' : ''}`}>
            <h1 className="video-title">
              REDISCOVER<br />
              the <span className="italic">CLASSICS</span>
            </h1>
          </div>

          {showScrollPrompt && (
            <div className="scroll-prompt">
              <div className="scroll-prompt-content">
                <div className="scroll-icon">
                  <div className="mouse">
                    <div className="wheel"></div>
                  </div>
                </div>
                <p className="scroll-text">Scroll to continue</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showGreeting && (
        <div className="greeting-section">
          <div className="greeting-content">
            <h1 className="greeting-text">Hello, nice to meet you</h1>
          </div>
        </div>
      )}

      <div className="content-section">
        <div className="content-inner">
          <h1>Welcome to Toyota Experience</h1>
          <p>Scroll down to explore more...</p>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
