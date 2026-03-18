import React, { useState, useEffect, useRef } from 'react';
import './AddressAutocomplete.css';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onPlaceSelect, 
  placeholder = "Enter address...",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from OpenStreetMap Nominatim
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Using Nominatim API with Malaysia country code bias
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `countrycodes=my`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'VicarPremiumMobility/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(e);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to fetch suggestions after 300ms
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const selectedPlace = {
      formatted_address: suggestion.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(suggestion.lat),
          lng: () => parseFloat(suggestion.lon)
        }
      },
      address_components: suggestion.address
    };

    // Update input value
    onChange({ target: { value: suggestion.display_name } });
    
    // Call parent callback
    onPlaceSelect(selectedPlace);
    
    // Close suggestions
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="address-autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {isLoading && (
        <div className="autocomplete-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.place_id}-${index}`}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <svg className="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div className="suggestion-content">
                <div className="suggestion-secondary">
                  {suggestion.display_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="autocomplete-suggestions">
          <div className="suggestion-item no-results">
            No results found
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
