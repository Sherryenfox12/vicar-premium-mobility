import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './CustomerBookingModal.css';

const NAME_PREFIXES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];

const defaultCustomer = {
  prefix: 'Mr',
  name: '',
  email: '',
  phone: '',
  pax: 1
};

const CustomerBookingModal = ({ isOpen, onClose, onSubmit, selectedCar, pickupDatetime }) => {
  const [customer, setCustomer] = useState(defaultCustomer);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!customer.name.trim()) newErrors.name = 'Full name is required.';
    if (!customer.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!customer.pax || customer.pax < 1) {
      newErrors.pax = 'Please enter the number of passengers.';
    }
    return newErrors;
  };

  const handleChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ ...customer });
    setCustomer(defaultCustomer);
    setErrors({});
  };

  const handleOverlayClick = () => {
    setCustomer(defaultCustomer);
    setErrors({});
    onClose();
  };

  return (
    <div className="cbm-overlay" onClick={handleOverlayClick}>
      <div className="cbm-modal" onClick={e => e.stopPropagation()}>
        <div className="cbm-header">
          <h2 className="cbm-title">Your Details</h2>
          <p className="cbm-subtitle">Please fill in your details so we can process your booking.</p>
          <button className="cbm-close-btn" onClick={handleOverlayClick} aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {selectedCar && (
          <div className="cbm-car-summary">
            {selectedCar.car_picture && (
              <img src={selectedCar.car_picture} alt={selectedCar.car_name} className="cbm-car-img" />
            )}
            <div className="cbm-car-info">
              <span className="cbm-car-name">{selectedCar.car_name}</span>
              {selectedCar.car_type && <span className="cbm-car-type">{selectedCar.car_type}</span>}
              {pickupDatetime && (
                <span className="cbm-pickup-time">Pickup: {pickupDatetime}</span>
              )}
            </div>
          </div>
        )}

        <form className="cbm-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="cbm-field">
            <label className="cbm-label">Full Name <span className="cbm-required">*</span></label>
            <div className="cbm-name-row">
              <select
                className="cbm-prefix-select"
                value={customer.prefix}
                onChange={e => handleChange('prefix', e.target.value)}
              >
                {NAME_PREFIXES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="text"
                className={`cbm-input cbm-input--name ${errors.name ? 'cbm-input--error' : ''}`}
                placeholder="Your full name"
                value={customer.name}
                onChange={e => handleChange('name', e.target.value)}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="cbm-error">{errors.name}</span>}
          </div>

          {/* Phone */}
          <div className="cbm-field">
            <label className="cbm-label">Phone Number <span className="cbm-required">*</span></label>
            <PhoneInput
              country="my"
              value={customer.phone}
              onChange={value => handleChange('phone', value)}
              inputClass={`cbm-phone-input${errors.phone ? ' cbm-input--error' : ''}`}
              buttonClass="cbm-phone-flag-btn"
              containerClass="cbm-phone-container"
              dropdownClass="cbm-phone-dropdown"
              enableSearch
              searchPlaceholder="Search country..."
              preferredCountries={['my', 'sg', 'us', 'gb', 'au']}
            />
            {errors.phone && <span className="cbm-error">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div className="cbm-field">
            <label className="cbm-label">Email Address <span className="cbm-required">*</span></label>
            <input
              type="email"
              className={`cbm-input ${errors.email ? 'cbm-input--error' : ''}`}
              placeholder="you@example.com"
              value={customer.email}
              onChange={e => handleChange('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="cbm-error">{errors.email}</span>}
          </div>

          {/* Number of Passengers */}
          <div className="cbm-field">
            <label className="cbm-label">Number of Passengers <span className="cbm-required">*</span></label>
            <input
              type="number"
              className={`cbm-input ${errors.pax ? 'cbm-input--error' : ''}`}
              placeholder="e.g. 2"
              min={1}
              max={selectedCar?.max_passenger}
              value={customer.pax}
              onChange={e => handleChange('pax', parseInt(e.target.value) || '')}
            />
            {selectedCar?.max_passenger && (
              <span className="cbm-hint">Max capacity: {selectedCar.max_passenger} passengers</span>
            )}
            {errors.pax && <span className="cbm-error">{errors.pax}</span>}
          </div>

          <div className="cbm-actions">
            <button type="button" className="cbm-btn cbm-btn--secondary" onClick={handleOverlayClick}>
              Cancel
            </button>
            <button type="submit" className="cbm-btn cbm-btn--primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerBookingModal;
