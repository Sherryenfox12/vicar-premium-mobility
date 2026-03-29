import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaKey } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import AnimatedContent from '../animation/AnimatedContent';
import VicarHeader from '../components/VicarHeader';
import VicarFooter from '../components/VicarFooter';
import SEO from '../components/SEO';
import { renderWithVicar } from '../components/VicarWord';
import FloatingCarButton from '../components/FloatingCarButton';
import RedLine from '../components/RedLine';
import MobileAppPromotion from '../components/MobileAppPromotion';
import CarSearchResultsModal from '../components/CarSearchResultsModal';
import AddressAutocomplete from '../components/AddressAutocomplete';
import CustomerBookingModal from '../components/CustomerBookingModal';
import '../components/CustomerBookingModal.css';
import './HomePage.css';


const VIDEO_TRIGGER_STORAGE_KEY = 'vicar_home_video_last_trigger';
const VIDEO_TRIGGER_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const SEARCH_FORM_STORAGE_KEY = 'vicar_home_search_form_v1';

const shouldSkipVideo = () => {
  try {
    const lastTrigger = localStorage.getItem(VIDEO_TRIGGER_STORAGE_KEY);
    if (!lastTrigger) return false;
    const lastTime = parseInt(lastTrigger, 10);
    const now = Date.now();
    return (now - lastTime) < VIDEO_TRIGGER_COOLDOWN_MS;
  } catch {
    return false;
  }
};

const saveVideoTrigger = () => {
  try {
    localStorage.setItem(VIDEO_TRIGGER_STORAGE_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Failed to save video trigger to localStorage:', e);
  }
};

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [flow, setFlow] = useState('rental');
  const videoRef = useRef(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [showText, setShowText] = useState(true);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [hideVideo, setHideVideo] = useState(shouldSkipVideo());
  const hasReachedFirstFrame = useRef(false);
  const hasScrolledFirst = useRef(false);
  const videoEnded = useRef(false);
  const chauffeurSectionRef = useRef(null);
  const newArrivalsSectionRef = useRef(null);
  const mobileAppSectionRef = useRef(null);
  const postVideoScrollTargetRef = useRef('chauffeur');
  const scrollHandlersRef = useRef({ handleScrollTrigger: null, preventScroll: null });
  const [animatedSections, setAnimatedSections] = useState({
    rentalFlow: false
  });

  // Form state for car search
  const defaultFormData = {
    serviceType: 'hire',
    pickupAddress: '',
    pickupLat: null,
    pickupLng: null,
    dropoffAddress: '',
    dropoffLat: null,
    dropoffLng: null,
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: ''
  };

  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem(SEARCH_FORM_STORAGE_KEY);
      if (!raw) return defaultFormData;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return defaultFormData;

      const merged = { ...defaultFormData, ...parsed };
      if (typeof merged.pickupLat === 'string') merged.pickupLat = Number(merged.pickupLat);
      if (typeof merged.pickupLng === 'string') merged.pickupLng = Number(merged.pickupLng);
      if (typeof merged.dropoffLat === 'string') merged.dropoffLat = Number(merged.dropoffLat);
      if (typeof merged.dropoffLng === 'string') merged.dropoffLng = Number(merged.dropoffLng);

      return merged;
    } catch {
      return defaultFormData;
    }
  });

  // Persist search form state so navigating away/back keeps values
  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [formData]);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  // New Arrivals state
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState(null);
  const arrivalsScrollContainerRef = useRef(null);
  const [canScrollArrivalsLeft, setCanScrollArrivalsLeft] = useState(false);
  const [canScrollArrivalsRight, setCanScrollArrivalsRight] = useState(true);

  const KW99_LANDING_API_URL = `${import.meta.env.VITE_LANDING_PAGE_CAR_LIST_URL}`;

  const goToTownDetails = (id) => {
    navigate(`/town-details/${id}`);
  };

  // Handle pickup place selection
  const handlePickupPlaceSelect = (place) => {
    if (place.geometry && place.geometry.location) {
      setFormData(prev => ({
        ...prev,
        pickupAddress: place.formatted_address || '',
        pickupLat: place.geometry.location.lat(),
        pickupLng: place.geometry.location.lng()
      }));
    }
  };

  // Handle dropoff place selection
  const handleDropoffPlaceSelect = (place) => {
    if (place.geometry && place.geometry.location) {
      setFormData(prev => ({
        ...prev,
        dropoffAddress: place.formatted_address || '',
        dropoffLat: place.geometry.location.lat(),
        dropoffLng: place.geometry.location.lng()
      }));
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Calculate rental duration in hours and minutes
  const calculateRentalDuration = (pickupDate, pickupTime, dropoffDate, dropoffTime) => {
    if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      return { hours: 0, minutes: 0, totalMinutes: 0, days: 0 };
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
    
    const diffMs = dropoffDateTime - pickupDateTime;
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);

    return { hours, minutes, totalMinutes, days };
  };

  /** For chauffeur (hire), drop-off is not user-selected; estimate arrival from route distance. */
  const computeEstimatedDropoffFromRoute = (data) => {
    const distance = calculateDistance(
      data.pickupLat,
      data.pickupLng,
      data.dropoffLat,
      data.dropoffLng
    );
    const travelDurationMin = Math.round((distance / 60) * 60);
    const pickup = new Date(`${data.pickupDate}T${data.pickupTime}`);
    if (Number.isNaN(pickup.getTime())) {
      return { dropoffDate: '', dropoffTime: '', travelDurationMin: 0 };
    }
    const arrival = new Date(pickup.getTime());
    arrival.setMinutes(arrival.getMinutes() + travelDurationMin);
    const pad = (n) => String(n).padStart(2, '0');
    const dropoffDate = `${arrival.getFullYear()}-${pad(arrival.getMonth() + 1)}-${pad(arrival.getDate())}`;
    const dropoffTime = `${pad(arrival.getHours())}:${pad(arrival.getMinutes())}`;
    return { dropoffDate, dropoffTime, travelDurationMin };
  };

  // Handle form submission
  const handleSearchCars = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.pickupAddress || !formData.pickupLat || !formData.pickupLng) {
      alert(t('home.pleaseEnterPickup'));
      return;
    }

    if (!formData.dropoffAddress || !formData.dropoffLat || !formData.dropoffLng) {
      alert(t('home.pleaseEnterDropoff'));
      return;
    }

    if (!formData.pickupDate || !formData.pickupTime) {
      alert(t('home.pleaseEnterPickupDateTime'));
      return;
    }

    let effectiveDropoffDate = formData.dropoffDate;
    let effectiveDropoffTime = formData.dropoffTime;

    if (formData.serviceType === 'hire') {
      const est = computeEstimatedDropoffFromRoute(formData);
      effectiveDropoffDate = est.dropoffDate;
      effectiveDropoffTime = est.dropoffTime;
    } else {
      if (!formData.dropoffDate || !formData.dropoffTime) {
        alert(t('home.pleaseEnterDropoffDateTime'));
        return;
      }

      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
      const dropoffDateTime = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);

      if (dropoffDateTime <= pickupDateTime) {
        alert(t('home.dropoffMustBeAfterPickup'));
        return;
      }
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      setShowModal(true);

      // Fetch all available vehicles
      const response = await axios.get(KW99_LANDING_API_URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('[Landing car list API] raw response:', response.data);

      // Support both API formats: user's format { success, cars } or KW99 format { result, data }
      const apiData = response.data;
      const isUserFormat = apiData.success && Array.isArray(apiData.cars);
      const isKw99Format = apiData.result && apiData.status_code === 100 && apiData.data;

      if (isUserFormat || isKw99Format) {
        // Calculate distance between pickup and dropoff
        const distance = calculateDistance(
          formData.pickupLat,
          formData.pickupLng,
          formData.dropoffLat,
          formData.dropoffLng
        );

        // Estimate travel duration (assuming average speed of 60 km/h)
        const travelDuration = Math.round((distance / 60) * 60); // in minutes

        // Calculate rental duration
        const rentalDuration = calculateRentalDuration(
          formData.pickupDate,
          formData.pickupTime,
          effectiveDropoffDate,
          effectiveDropoffTime
        );

        let cars;

        if (isUserFormat) {
          // User's API format: cars already have max_passenger, luggage_size, etc.
          cars = apiData.cars.map(car => ({
            car_id: car.car_id,
            car_name: car.car_name,
            max_passenger: car.max_passenger ?? 4,
            luggage_size: car.luggage_size ?? 0,
            service_type: car.service_type,
            service_details: Array.isArray(car.service_details)
              ? car.service_details.map(s => s.title).join(' • ')
              : car.service_details,
            price_per_km: car.price_per_km ?? car.estimate_price_per_km,
            car_type: car.car_type,
            car_picture: car.car_picture,
            car_highlight: car.car_highlight
          }));
        } else {
          // KW99 format: transform vehicles, use API values when available
          cars = apiData.data.map(vehicle => ({
            car_id: vehicle.vehicle_id?.toString() ?? vehicle.car_id,
            car_name: vehicle.title ?? vehicle.car_name,
            max_passenger: vehicle.max_passenger ?? vehicle.max_pax ?? 4,
            luggage_size: vehicle.luggage_size ?? vehicle.luggage ?? 0,
            service_type: vehicle.service_type ?? vehicle.serviceType ?? vehicle.service,
            service_details: vehicle.brand
              ? `${vehicle.brand.toUpperCase()} ${vehicle.model} - ${vehicle.manufacturing_year}`
              : vehicle.service_details,
            price_per_km: vehicle.price_per_km ?? vehicle.estimate_price_per_km ?? 0.00,
            car_type: vehicle.vehicle_type_text ?? vehicle.car_type,
            car_picture: vehicle.img_path ?? vehicle.car_picture,
            car_highlight: vehicle.transmission_text
              ? `${vehicle.transmission_text} • ${vehicle.cc}cc • ${vehicle.exterior_color}`
              : vehicle.car_highlight
          }));
        }

        // Client-side filter: API returns all cars; filter by service_type for selected tab
        const allowedServiceTypes = formData.serviceType === 'rent'
          ? new Set(['rent'])
          : new Set(['hire', 'hailing', 'airport_transfer']);

        cars = (cars || []).filter(car => allowedServiceTypes.has(car.service_type));

        // Deduplicate by car_id (API may return duplicates)
        const seenCars = new Set();
        cars = cars.filter(car => {
          const key = String(car.car_id ?? '');
          if (!key) return false;
          if (seenCars.has(key)) return false;
          seenCars.add(key);
          return true;
        });

        const transformedData = {
          success: true,
          service_type: formData.serviceType,
          currency: apiData.currency ?? 'MYR',
          distance_km: Math.round(distance * 10) / 10,
          estimated_duration_min: travelDuration,
          rental_duration: rentalDuration,
          pickup_datetime: `${formData.pickupDate} ${formData.pickupTime}`,
          dropoff_datetime: `${effectiveDropoffDate} ${effectiveDropoffTime}`,
          cars
        };

        setSearchResults(transformedData);
      } else {
        setSearchError(response.data.msg || t('home.failedToFetchCars'));
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      setSearchError(error.response?.data?.msg || error.message || t('home.errorFetchingCars'));
    } finally {
      setSearchLoading(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSearchResults(null);
    setSearchError(null);
  };

  // Handle book now - open customer details form
  const handleBookNow = (car) => {
    setSelectedCar(car);
    setShowModal(false);
    setShowBookingForm(true);
  };

  // Handle booking form submission
  const handleBookingSubmit = async (customerData) => {
    const MY_LOCALE = 'en-MY';
    const MY_TZ = 'Asia/Kuala_Lumpur';

    const toMyDateTimeString = (date) =>
      date.toLocaleString(MY_LOCALE, {
        timeZone: MY_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

    const formatPickupDropoff = (dateStr, timeStr) => {
      if (!dateStr || !timeStr) return null;
      const dt = new Date(`${dateStr}T${timeStr}`);
      return dt.toLocaleString(MY_LOCALE, {
        timeZone: MY_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const dropoffForBooking =
      formData.serviceType === 'hire'
        ? computeEstimatedDropoffFromRoute(formData)
        : { dropoffDate: formData.dropoffDate, dropoffTime: formData.dropoffTime };

    const bookingData = {
      timestamp: toMyDateTimeString(new Date()),
      customer: {
        prefix: customerData.prefix,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        pax: customerData.pax
      },
      selected_car: selectedCar,
      pickup_datetime: formatPickupDropoff(formData.pickupDate, formData.pickupTime),
      dropoff_datetime: formatPickupDropoff(dropoffForBooking.dropoffDate, dropoffForBooking.dropoffTime),
      pickup_address: formData.pickupAddress,
      pickup_lat: formData.pickupLat,
      pickup_lng: formData.pickupLng,
      dropoff_address: formData.dropoffAddress,
      dropoff_lat: formData.dropoffLat,
      dropoff_lng: formData.dropoffLng,
      service_type: formData.serviceType
    };

    const backendUrl = import.meta.env.VITE_VICAR_BACKEND || 'http://localhost:82/api';
    try {
      const response = await fetch(`${backendUrl}/car-booking/send-telegram-car-booking-enquiry-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) {
        console.error('Booking submission failed:', await response.text());
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
    }

    setShowBookingForm(false);
    setShowBookingConfirmation(true);
  };

  const handleCityKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToTownDetails(id);
    }
  };

  // Handle skip button click - ends video and scrolls to chauffeur section
  const handleSkipVideo = () => {
    saveVideoTrigger();
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration; // Jump to end
    }
    
    // Mark video as ended
    videoEnded.current = true;
    
    // Start fade-out animation
    setVideoFadeOut(true);
    
    // Restore body scroll immediately
    document.body.style.overflow = 'auto';
    

    // Remove scroll event listeners
    if (scrollHandlersRef.current.handleScrollTrigger) {
      window.removeEventListener('wheel', scrollHandlersRef.current.handleScrollTrigger);
      window.removeEventListener('touchmove', scrollHandlersRef.current.handleScrollTrigger);
    }
    if (scrollHandlersRef.current.preventScroll) {
      window.removeEventListener('scroll', scrollHandlersRef.current.preventScroll);
    }
    
    // Hide video after fade-out animation completes
    setTimeout(() => {
      setHideVideo(true);
      
      const scrollTarget = postVideoScrollTargetRef.current;
      if (scrollTarget === 'arrivals' && newArrivalsSectionRef.current) {
        newArrivalsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (chauffeurSectionRef.current) {
        chauffeurSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1000); // Match the fade-out duration
  };

  // Video interaction effect
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
        });
      }
    };

    // Handle video end
    const handleVideoEnd = () => {
      saveVideoTrigger();
      videoEnded.current = true;
      // Start fade-out animation
      setVideoFadeOut(true);
      
      // Restore body scroll immediately when video ends
      document.body.style.overflow = 'auto';
      
      // Remove scroll event listeners since we no longer need them
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);
      window.removeEventListener('scroll', preventScroll);
      
      // Hide video after fade-out animation completes
      setTimeout(() => {
        setHideVideo(true);
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
        }
        return;
      }

      // If video is still playing, prevent scroll
      if (!videoEnded.current) {
        e.preventDefault();
      }
    };

    // Store handlers in ref for cleanup from skip button
    scrollHandlersRef.current.handleScrollTrigger = handleScrollTrigger;
    scrollHandlersRef.current.preventScroll = preventScroll;

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

  // New Arrivals functions - supports both API formats
  const fetchVehiclesData = async () => {
    try {
      const response = await fetch(KW99_LANDING_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // User's API format: { success, cars }
      if (data.success && Array.isArray(data.cars)) {
        // Deduplicate by car_id (same car may appear as hire + rent)
        const seen = new Set();
        const uniqueCars = data.cars.filter(car => {
          const key = car.car_id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        const vehicles = uniqueCars.map(car => ({
          vehicle_id: car.car_id,
          car_id: car.car_id,
          title: car.car_name,
          car_name: car.car_name,
          manufacturing_year: '',
          brand: (car.car_name || '').split(' ')[0] || '',
          model: (car.car_name || '').split(' ').slice(1).join(' ') || car.car_name,
          img_path: car.car_picture,
          car_picture: car.car_picture,
          transmission_text: null,
          cc: null,
          max_passenger: car.max_passenger ?? 4,
          luggage_size: car.luggage_size ?? 0,
          vehicle_type_text: car.car_type,
          car_type: car.car_type
        }));
        return { success: true, vehicles, message: data.msg };
      }

      // KW99 format: { result, data }
      if (data.result && data.status_code === 100 && data.data) {
        const vehicles = data.data.map(v => ({
          ...v,
          max_passenger: v.max_passenger ?? v.max_pax ?? 4,
          luggage_size: v.luggage_size ?? v.luggage ?? 0
        }));
        return { success: true, vehicles, message: data.msg };
      }

      throw new Error(data.msg || 'Failed to fetch vehicles data');
    } catch (error) {
      console.error('Error fetching vehicles data:', error);
      return {
        success: false,
        vehicles: [],
        error: error.message
      };
    }
  };

  // Fetch vehicles data on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setVehiclesLoading(true);
        setVehiclesError(null);
        
        const result = await fetchVehiclesData();
        
        if (result.success) {
          // Sort vehicles by manufacturing year (latest first)
          const sortedVehicles = result.vehicles.sort((a, b) => {
            const yearA = parseInt(a.manufacturing_year) || 0;
            const yearB = parseInt(b.manufacturing_year) || 0;
            return yearB - yearA; // Descending order (latest first)
          });
          setVehicles(sortedVehicles);
        } else {
          setVehiclesError(result.error || 'Failed to load vehicles');
        }
      } catch (err) {
        setVehiclesError('An unexpected error occurred');
        console.error('Error loading vehicles:', err);
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Handle New Arrivals scroll events
  useEffect(() => {
    const scrollContainer = arrivalsScrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkArrivalsScrollPosition);
      // Initial check
      checkArrivalsScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkArrivalsScrollPosition);
      };
    }
  }, [vehicles]);

  // Auto-scroll functionality for New Arrivals
  useEffect(() => {
    if (vehicles.length === 0) return;

    const interval = setInterval(() => {
      if (arrivalsScrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = arrivalsScrollContainerRef.current;
        
        // If we've reached the end, scroll back to beginning
        if (scrollLeft >= scrollWidth - clientWidth - 1) {
          arrivalsScrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Otherwise, scroll right by one card width
          arrivalsScrollContainerRef.current.scrollBy({
            left: 200,
            behavior: 'smooth'
          });
        }
      }
    }, 12000); // Auto-scroll every 12 seconds

    return () => clearInterval(interval);
  }, [vehicles]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.dataset.section;
            if (sectionName) {
              setAnimatedSections(prev => ({
                ...prev,
                [sectionName]: true
              }));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe only sections that need animations (rental flow)
    const sections = document.querySelectorAll('[data-section="rentalFlow"]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // New Arrivals scroll functions
  const checkArrivalsScrollPosition = () => {
    if (arrivalsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = arrivalsScrollContainerRef.current;
      setCanScrollArrivalsLeft(scrollLeft > 0);
      setCanScrollArrivalsRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollArrivalsLeft = () => {
    if (arrivalsScrollContainerRef.current) {
      const cardWidth = 350; // Card width + margin
      arrivalsScrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const scrollArrivalsRight = () => {
    if (arrivalsScrollContainerRef.current) {
      const cardWidth = 350; // Card width + margin
      arrivalsScrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  // Inline CarCard Component for New Arrivals - uses API data
  const CarCard = ({ vehicle }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (!vehicle) return null;

    const {
      vehicle_id,
      car_id,
      manufacturing_year,
      title,
      car_name,
      brand,
      model,
      img_path,
      car_picture,
      transmission_text,
      cc,
      max_passenger,
      luggage_size,
      vehicle_type_text,
      car_type
    } = vehicle;

    const displayName = title || car_name;
    const imageSrc = img_path || car_picture;
    const passengerCount = max_passenger ?? 4;
    const description = manufacturing_year && brand && model
      ? `${manufacturing_year} ${brand.toUpperCase()} ${model}`
      : (car_type || vehicle_type_text || displayName);

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    return (
      <div className="car-card">
        <div className="car-image-container">
          {!imageLoaded && (
            <div className="image-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="image-error">
              <div className="error-icon">🚗</div>
              <p>{t('home.imageUnavailable')}</p>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={displayName}
              className={`car-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        <div className="car-details">
          <div className="car-header">
            <h3 className="car-title">{displayName}</h3>
          </div>

          <div className="car-specs-info">
            {transmission_text && (
              <div className="spec-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{transmission_text}</span>
              </div>
            )}
            <div className="spec-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>{passengerCount} {t('home.seats')}</span>
            </div>
            {luggage_size != null && luggage_size > 0 && (
              <div className="spec-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{luggage_size}L</span>
              </div>
            )}
            {cc && (
              <div className="spec-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>{cc}cc</span>
              </div>
            )}
          </div>

          <div className="car-info-text">
            <p className="car-description">
              {description}
            </p>
          </div>

          <div className="car-action">
            <Link to="/contact-us" className="car-enquiry-btn">
              {t('home.enquiry')}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Loading skeleton for New Arrivals
  const LoadingSkeleton = () => (
    <div className="new-arrivals-loading">
      <div className="loading-header">
        <div className="skeleton-title"></div>
      </div>
      <div className="loading-cards">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
              <div className="skeleton-text skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error state for New Arrivals
  const ErrorState = () => (
    <div className="new-arrivals-error">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h3>{t('home.failedToLoadArrivals')}</h3>
        <p>{vehiclesError}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          {t('home.retry')}
        </button>
      </div>
    </div>
  );

  // Empty state for New Arrivals
  const EmptyState = () => (
    <div className="new-arrivals-empty">
      <div className="empty-content">
        <div className="empty-icon">🚗</div>
        <h3>{t('home.noVehiclesAvailable')}</h3>
        <p>{t('home.checkBackLater')}</p>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <SEO
        title="Home"
        description="Your trusted all-in-one mobility platform for premium vehicles and chauffeur services in Malaysia. Car rental, chauffeur service, and reconditioned cars."
        path="/"
        priority={1.0}
      />
      {/* Header Component */}
      <VicarHeader currentPage="home" />

      <main className="main-content">
        {/* Video Interaction Section - Replaces Hero */}
        {!hideVideo && (
          <div className={`home-video-container ${videoFadeOut ? 'fade-out' : ''}`}>
            <video
              ref={videoRef}
              className="home-fullscreen-video"
              muted
              playsInline
            >
              <source src="/video/alphard_start_car.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className={`home-video-text-overlay ${!showText ? 'fade-out' : ''}`}>
              <p className="home-video-eyebrow">{renderWithVicar(t('home.vicarPremiumMobility'))}</p>
              <h1 className="home-video-title">
                {t('home.arriveInQuietLuxury').split(' ').slice(0, 2).join(' ')}<br />
                <span className="lux-gold">{t('home.arriveInQuietLuxury').split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="home-video-subtitle">
                {t('home.chauffeurServiceTagline')}
              </p>
            </div>

            {showScrollPrompt && (
              <div className="home-scroll-prompt">
                <div className="home-scroll-prompt-content">
                  <div className="home-scroll-icon">
                    <div className="home-mouse">
                      <div className="home-wheel"></div>
                    </div>
                  </div>
                  <p className="home-scroll-text">{t('home.scrollToContinue')}</p>
                </div>
              </div>
            )}

            <button 
              className="skip-video-btn"
              onClick={handleSkipVideo}
              aria-label="Skip video"
            >
              {t('home.skip')}
            </button>

          </div>
        )}

        {/* Chauffeur Service Section */}
        <section ref={chauffeurSectionRef} className="chauffeur-service-section">
          <div className="chauffeur-bg-overlay"></div>
          <div className="chauffeur-content">
            <div className="chauffeur-text-side">
              <p className="lux-eyebrow">{t('home.chauffeurAirportCity')}</p>
              <h2 className="chauffeur-title">{t('home.malaysiaChauffeurService')}</h2>
              <p className="chauffeur-subtitle">
                {t('home.experienceLuxuryTransport')}
              </p>

{/* 

              <div className="lux-trustbar" aria-label="Trusted partners">
                <div className="lux-trust-item">
                  <img className="lux-trust-logo" src="/kw99.png" alt="KW99" loading="lazy" />
                </div>
                <div className="lux-trust-divider" aria-hidden="true"></div>
                <div className="lux-trust-item">
                  <span className="lux-trust-text">{t('home.concierge24')}</span>
                </div>
                <div className="lux-trust-divider" aria-hidden="true"></div>
                <div className="lux-trust-item">
                  <span className="lux-trust-text">{t('home.premiumFleet')}</span>
                </div>
              </div>
              */}



              <div className="chauffeur-features">
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.professionalDrivers')}</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.availability24')}</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.luxuryVehicles')}</span>
                </div>
              </div>
            </div>
            
            <div className="chauffeur-form-side">
              <div className="chauffeur-form-card">
                <div className="home-form-tabs">
                  <button 
                    className={`home-form-tab ${formData.serviceType === 'hire' ? 'active' : ''}`}
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        serviceType: 'hire',
                        dropoffDate: '',
                        dropoffTime: ''
                      }))
                    }
                    type="button"
                  >
                    {t('home.chauffeurService')}
                  </button>
                  <button 
                    className={`home-form-tab ${formData.serviceType === 'rent' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, serviceType: 'rent' }))}
                    type="button"
                  >
                    {t('home.carRental')}
                  </button>
                </div>
                
                <form className="home-booking-form" onSubmit={handleSearchCars}>
                  <div className="home-form-group">
                    <label className="home-form-label">{t('home.from')}</label>
                    <div className="home-input-with-icon">
                      <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <AddressAutocomplete
                        value={formData.pickupAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                        onPlaceSelect={handlePickupPlaceSelect}
                        placeholder={t('home.addressPlaceholder')}
                        className="home-form-input"
                      />
                    </div>
                  </div>

                  <div className="home-form-group">
                    <label className="home-form-label">{t('home.to')}</label>
                    <div className="home-input-with-icon">
                      <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <AddressAutocomplete
                        value={formData.dropoffAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, dropoffAddress: e.target.value }))}
                        onPlaceSelect={handleDropoffPlaceSelect}
                        placeholder={t('home.addressPlaceholder')}
                        className="home-form-input"
                      />
                    </div>
                  </div>

                  <div className="home-form-row">
                    <div className="home-form-group flex-1">
                      <label className="home-form-label">{t('home.pickupDate')}</label>
                      <div className="home-input-with-icon">
                        <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                          type="date" 
                          className="home-form-input"
                          value={formData.pickupDate}
                          min={getTodayDate()}
                          onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="home-form-group flex-1">
                      <label className="home-form-label">{t('home.pickupTime')}</label>
                      <div className="home-input-with-icon">
                        <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                          type="time" 
                          className="home-form-input"
                          value={formData.pickupTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {formData.serviceType === 'rent' && (
                    <div className="home-form-row">
                      <div className="home-form-group flex-1">
                        <label className="home-form-label">{t('home.dropoffDate')}</label>
                        <div className="home-input-with-icon">
                          <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <input 
                            type="date" 
                            className="home-form-input"
                            value={formData.dropoffDate}
                            min={formData.pickupDate || getTodayDate()}
                            onChange={(e) => setFormData(prev => ({ ...prev, dropoffDate: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="home-form-group flex-1">
                        <label className="home-form-label">{t('home.dropoffTime')}</label>
                        <div className="home-input-with-icon">
                          <svg className="home-input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <input 
                            type="time" 
                            className="home-form-input"
                            value={formData.dropoffTime}
                            min={formData.pickupDate === formData.dropoffDate ? formData.pickupTime : undefined}
                            onChange={(e) => setFormData(prev => ({ ...prev, dropoffTime: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="home-search-btn">
                    {t('home.search')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* Our Services Section */}
        <section className="home-our-services-section">
          <div className="container">
            <div className="lux-servicesHeader">
              <p className="lux-eyebrow">{t('home.signatureServices')}</p>
              <div className="lux-servicesHeaderRow">
                <div>
                  <h2 className="home-services-title">{t('home.ourServices')}</h2>
                  <p className="lux-servicesSubtitle">
                    {t('home.curatedMobility')}
                  </p>
                </div>
                <Link to="/service" className="lux-btn lux-btn--secondary lux-btnLink lux-servicesAll">
                  {t('home.viewAll')}
                </Link>
              </div>
            </div>

            <div className="lux-servicesMosaic" aria-label="Our services">
              {/* Tile A – text panel (like the left block in the reference) */}
              <div className="lux-servicesTile lux-servicesTile--intro">
                <p className="lux-servicesKicker">{renderWithVicar(t('home.vicarPremiumMobilityShort'))}</p>
                <h3 className="lux-servicesIntroTitle">
                  {t('home.chauffeurLedTravel')}
                </h3>
                <p className="lux-servicesIntroBody">
                  {t('home.discreetService')}
                </p>
                <div className="lux-servicesIntroActions">
                  <a href="#mobile-app-promotion" className="lux-btn lux-btn--primary lux-btnLink">
                    {t('home.bookChauffeur')}
                  </a>
                </div>
              </div>

              {/* Tile 1 – Airport transfers */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.05}>
                <div className="lux-servicesTile lux-servicesTile--tile1 lux-servicesTile--noClick" aria-label="Airport transfers">
                  <img src="/image/kwpic/DSC07584.png" alt="Airport transfers" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.airportTransfers')}</h3>
                    <p className="lux-servicesDesc">{t('home.flightMonitoring')}</p>
                  </div>
                </div>
              </AnimatedContent>

              {/* Tile 2 – City-to-city rides */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.2}>
                <div className="lux-servicesTile lux-servicesTile--tile2 lux-servicesTile--noClick" aria-label="City-to-city rides">
                  <img src="/image/ourservice_mini_1.png" alt="City-to-city rides" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.cityToCityRides')}</h3>
                    <p className="lux-servicesDesc">{t('home.longDistanceTravel')}</p>
                  </div>
                </div>
              </AnimatedContent>

              {/* Tile 3 – Chauffeur hailing */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.15}>
                <div className="lux-servicesTile lux-servicesTile--tile3 lux-servicesTile--noClick" aria-label="Chauffeur hailing">
                  <img src="/image/kwpic/DSC07603.jpg.jpeg" alt="Chauffeur hailing" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.chauffeurHailing')}</h3>
                    <p className="lux-servicesDesc">{t('home.onDemandBooking')}</p>
                  </div>
                </div>
              </AnimatedContent>

              {/* Tile 4 – Hourly and full day hire */}
              <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.2} delay={0.2}>
                <div className="lux-servicesTile lux-servicesTile--tile4 lux-servicesTile--noClick" aria-label="Hourly and full day hire">
                  <img src="/image/ourservice_mini_4.png" alt="Hourly and full day hire" className="lux-servicesMedia" loading="lazy" />
                  <div className="lux-servicesOverlay">
                    <h3 className="lux-servicesTitle">{t('home.hourlyFullDayHire')}</h3>
                    <p className="lux-servicesDesc">{t('serviceDetails.hourlyFeature1')}</p>
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* Explore Malaysia - City to City Section */}
        <section className="explore-malaysia-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('home.exploreMalaysiaTitle')}</h2>
              <p className="section-subtitle">{t('home.exploreMalaysiaSubtitle')}</p>
            </div>

            <div className="city-grid">
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.1}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('kuala-lumpur')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'kuala-lumpur')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/kualalumpur.jpg" alt="Kuala Lumpur" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.kualaLumpur')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.15}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('penang')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'penang')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/penang.jpg" alt="Penang" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.penang')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.2}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('johor')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'johor')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/johor.jpg" alt="Johor Bahru" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.johorBahru')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.25}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('melaka')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'melaka')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/melaka.jpg" alt="Melaka" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.melaka')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.3}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('ipoh')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'ipoh')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/ipoh.jpg" alt="Ipoh" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.ipoh')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.15}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('langkawi')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'langkawi')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/langkawi.jpg" alt="Langkawi" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.langkawi')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.2}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('kedah')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'kedah')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/kedah.jpg" alt="Kedah" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.kedah')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.25}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('terengganu')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'terengganu')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/terengganu.jpg" alt="Terengganu" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.terengganu')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.3}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('perak')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'perak')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/perak.jpg" alt="Perak" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.perak')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power2.out"
                initialOpacity={0}
                animateOpacity
                scale={0.95}
                threshold={0.2}
                delay={0.35}
              >
                <div
                  className="city-card"
                  onClick={() => goToTownDetails('perlis')}
                  onKeyDown={(e) => handleCityKeyDown(e, 'perlis')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="city-image-container">
                    <img src="/image/cityMalaysia/perlis.jpg" alt="Perlis" className="city-image" />
                    <div className="city-overlay">
                      <h3 className="city-name">{t('city.perlis')}</h3>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            <div className="view-more-container">
             
            </div>
          </div>
        </section>

        {/* Red Line Separator */}
        <RedLine />

        {/* Flow Section */}
        <section className="flow-section">
          <div className="container">
            <div className="flow-content rental-flow" data-section="rentalFlow">
              <div className="lux-flow">
                <div className="lux-flow__intro">
                  <p className="lux-eyebrow">{t('home.experience')}</p>
                  <h2 className="lux-flow__title">{t('home.rentalTitle')}</h2>
                  <p className="lux-flow__desc">{t('home.rentalDescription')}</p>

                  <div className="lux-flow__pills" aria-label="Service highlights">
                    <span className="lux-flow__pill">{t('home.concierge24')}</span>
                    <span className="lux-flow__pill">{t('home.discreetOnTime')}</span>
                    <span className="lux-flow__pill">{t('home.premiumFleet')}</span>
                  </div>

                  <Link to="/contact-us" className="lux-btn lux-btn--primary lux-btnLink lux-flow__cta">
                    {t('home.requestConcierge')}
                  </Link>
                </div>

                <ol className="lux-flow__steps" aria-label="How it works">
                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.05}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaCar />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">01</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep1Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep1Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>

                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.12}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaCalendarAlt />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">02</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep2Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep2Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>

                  <AnimatedContent distance={40} direction="vertical" duration={1.1} ease="power2.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.25} delay={0.19}>
                    <li className="lux-step">
                      <div className="lux-step__marker" aria-hidden="true">
                        <FaKey />
                      </div>
                      <div className="lux-step__card">
                        <div className="lux-step__top">
                          <span className="lux-step__num">03</span>
                          <span className="lux-step__hairline" aria-hidden="true"></span>
                        </div>
                        <h3 className="lux-step__title">{t('home.rentalStep3Title')}</h3>
                        <p className="lux-step__desc">{t('home.rentalStep3Desc')}</p>
                      </div>
                    </li>
                  </AnimatedContent>
                </ol>
              </div>
            </div>
          </div>
        </section>

   {/* Red Line Separator */}
   <RedLine />

        {/* New Arrivals - Dynamic from API */}
        <section ref={newArrivalsSectionRef} className="new-arrivals-section">
          {/* Navigation Buttons - positioned at the edge like stage buttons */}
          <button 
            className={`stage-nav-btn stage-nav-left ${!canScrollArrivalsLeft ? 'disabled' : ''}`}
            onClick={scrollArrivalsLeft}
            disabled={!canScrollArrivalsLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <button 
            className={`stage-nav-btn stage-nav-right ${!canScrollArrivalsRight ? 'disabled' : ''}`}
            onClick={scrollArrivalsRight}
            disabled={!canScrollArrivalsRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('home.newArrivals')}</h2>
              <p className="section-subtitle">
                {t('home.newArrivalsSubtitle')}
              </p>
            </div>

            {vehiclesLoading ? (
              <LoadingSkeleton />
            ) : vehiclesError ? (
              <ErrorState />
            ) : vehicles.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="arrivals-carousel">
                  {/* Scrollable Container */}
                  <div 
                    className="arrivals-scroll-container"
                    ref={arrivalsScrollContainerRef}
                  >
                    <div className="arrivals-cards">
                      {vehicles.map((vehicle, index) => (
                        <CarCard 
                          key={`${vehicle.vehicle_id ?? vehicle.car_id ?? index}`}
                          vehicle={vehicle}
                        />
                      ))}
                      
                      {/* Duplicate cards for infinite scroll effect */}
                      {vehicles.length > 0 && vehicles.map((vehicle, index) => (
                        <CarCard 
                          key={`duplicate-${vehicle.vehicle_id ?? vehicle.car_id ?? index}`}
                          vehicle={vehicle}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* View All Button 
                <div className="section-footer">
                  <button 
                    className="view-all-btn"
                    onClick={() => window.open('https://app.kw99.com.my/app-browse', '_blank', 'noopener,noreferrer')}
                  >
                    <span>{t('home.viewAllVehicles')}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                */}
              </>
            )}
          </div>
        </section>
        

        {/* Red Line Separator */}
        <RedLine />

        {/* Premium Concierge CTA */}
        <section className="lux-cta-section">
          <div className="container">
            <div className="lux-cta-card">
              <div className="lux-cta-copy">
                <p className="lux-eyebrow">{t('home.privateConcierge')}</p>
                <h2 className="lux-cta-title">
                  {t('home.reservedRefinedEffortless').split('.').slice(0, 2).join('. ')}. <span className="lux-gold">{(t('home.reservedRefinedEffortless').split('.')[2] ?? '').trim()}{t('home.reservedRefinedEffortless').split('.')[2] ? '.' : ''}</span>
                </h2>
                <p className="lux-cta-subtitle">
                  {t('home.ctaSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Promotion */}
        <div ref={mobileAppSectionRef}>
          <MobileAppPromotion />
        </div>
      </main>

      {/* Footer Component */}
      <VicarFooter />

      {/* Floating Car Button */}
      <FloatingCarButton />

      {/* Car Search Results Modal */}
      <CarSearchResultsModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onBookNow={handleBookNow}
        results={searchResults}
        loading={searchLoading}
        error={searchError}
      />

      {/* Customer Booking Form Modal */}
      <CustomerBookingModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        onSubmit={handleBookingSubmit}
        selectedCar={selectedCar}
        pickupDatetime={
          formData.pickupDate && formData.pickupTime
            ? `${formData.pickupDate} ${formData.pickupTime}`
            : null
        }
      />

      {/* Booking Confirmation Popup */}
      {showBookingConfirmation && (
        <div className="cbm-confirm-overlay">
          <div className="cbm-confirm-modal">
            <div className="cbm-confirm-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="cbm-confirm-title">Request Received!</h2>
            <p className="cbm-confirm-msg">
              Thank you for your interest. Your booking request is being processed and our team will contact you shortly.
            </p>
            <button
              className="cbm-confirm-close-btn"
              onClick={() => {
                setShowBookingConfirmation(false);
                setSelectedCar(null);
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
   
    </div>
  );
}

export default HomePage;
