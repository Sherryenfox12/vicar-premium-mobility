import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

function FloatingCarButton() {
  // Floating car button state
  const [showFloatingCar, setShowFloatingCar] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [upUpAnimation, setUpUpAnimation] = useState(null);

  // Load the "Up up up" animation data only when floating car appears
  useEffect(() => {
    if (showFloatingCar && !upUpAnimation) {
      fetch('/Up up up.json')
        .then(response => response.json())
        .then(data => setUpUpAnimation(data))
        .catch(error => {
          console.log('Failed to load up up animation:', error);
          setUpUpAnimation(null);
        });
    }
  }, [showFloatingCar, upUpAnimation]);

  // Scroll event listener for floating car button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 300) {
        if (!showFloatingCar && !isSlidingOut) {
          setShowFloatingCar(true);
          setIsSlidingOut(false);
        }
      } else {
        if (showFloatingCar && !isSlidingOut) {
          setIsSlidingOut(true);
          setTimeout(() => {
            setShowFloatingCar(false);
            setIsSlidingOut(false);
          }, 500);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFloatingCar, isSlidingOut]);

  const handleClick = () => {
    if (showFloatingCar) {
      setIsBouncing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsBouncing(false), 1000);
    }
  };

  return (
    <div 
      className={`floating-car-button ${showFloatingCar ? 'show' : ''} ${isBouncing ? 'bouncing' : ''} ${isSlidingOut ? 'sliding-out' : ''}`}
      onClick={handleClick}
    >
      <svg 
        className="floating-arrow-icon"
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
      <img 
        src="/alphard top view 2.png" 
        alt="Car Top View" 
        className="floating-car-image"
      />
      {upUpAnimation && (
        <div className="up-up-animation-container">
          <Lottie 
            animationData={upUpAnimation} 
            className="up-up-animation" 
            loop={true}
            autoplay={true}
            onError={(error) => {
              console.log('Up up animation error:', error);
              setUpUpAnimation(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FloatingCarButton;





