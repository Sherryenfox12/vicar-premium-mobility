import React from 'react';
import { useTranslation } from 'react-i18next';
import './CarSearchResultsModal.css';

const CarSearchResultsModal = ({
  isOpen,
  onClose,
  onBookNow,
  results,
  loading,
  error,
  hirePackages = {},
  selectedHirePackage = null,
  onSelectHirePackage = () => {},
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('home.availableCars')}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>{t('home.searchingCars')}</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <div className="error-icon">⚠️</div>
              <h3>{t('home.errorOccurred')}</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && results && (
            <>
              <div className="trip-info">
                {results.service_type === 'hire' ? (
                  <>
                    {results.distance_km > 0 && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.distance')}:</span>
                        <span className="trip-value">{results.distance_km} km</span>
                      </div>
                    )}
                    {results.pickup_datetime && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.pickupDateTime')}:</span>
                        <span className="trip-value">{results.pickup_datetime}</span>
                      </div>
                    )}
                    <div className="trip-info-item">
                      <span className="trip-label">{t('home.currency')}:</span>
                      <span className="trip-value">{results.currency}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {results.distance_km > 0 && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.distance')}:</span>
                        <span className="trip-value">{results.distance_km} km</span>
                      </div>
                    )}
                    {results.rental_duration && results.rental_duration.totalMinutes > 0 && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.rentalDuration')}:</span>
                        <span className="trip-value">
                          {results.rental_duration.days > 0 && `${results.rental_duration.days}d `}
                          {results.rental_duration.hours % 24}h {results.rental_duration.minutes}m
                        </span>
                      </div>
                    )}
                    {results.pickup_datetime && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.pickupDateTime')}:</span>
                        <span className="trip-value">{results.pickup_datetime}</span>
                      </div>
                    )}
                    {results.dropoff_datetime && (
                      <div className="trip-info-item">
                        <span className="trip-label">{t('home.dropoffDateTime')}:</span>
                        <span className="trip-value">{results.dropoff_datetime}</span>
                      </div>
                    )}
                    <div className="trip-info-item">
                      <span className="trip-label">{t('home.currency')}:</span>
                      <span className="trip-value">{results.currency}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="cars-list">
                {results.cars && results.cars.length > 0 ? (
                  results.cars.map((car, index) => (
                    <div key={`${car.car_id}-${car.service_type || index}`} className="car-result-card">
                      <div className="car-image-section">
                        {car.car_picture ? (
                          <img 
                            src={car.car_picture} 
                            alt={car.car_name}
                            className="car-result-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="car-placeholder" style={{ display: car.car_picture ? 'none' : 'flex' }}>
                          🚗
                        </div>
                      </div>

                      <div className="car-info-section">
                        <div className="car-header-row">
                          <h3 className="car-name">{car.car_name}</h3>
                          {car.car_type && <span className="car-type-badge">{car.car_type}</span>}
                        </div>

                        <div className="car-specs">
                          <div className="spec-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{car.max_passenger} {t('home.passengers')}</span>
                          </div>
                          <div className="spec-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{car.luggage_size}L</span>
                          </div>
                        </div>

                        {car.service_details && (
                          <p className="car-service-details">{car.service_details}</p>
                        )}

                        {car.car_highlight && (
                          <div className="car-highlights">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{car.car_highlight}</span>
                          </div>
                        )}

                        {Number(car.price_per_km) > 0 && (
                          <div className="car-price">
                            <span className="price-label">{t('home.pricePerKm')}:</span>
                            <span className="price-value">{results.currency} {car.price_per_km}</span>
                          </div>
                        )}

                        {(results.service_type === 'rent' || results.service_type === 'hire') && (
                          <div className="car-rental-pricing">
                            {Number(car.daily_rate) > 0 && (
                              <div className="car-price">
                                <span className="price-label">{t('home.dailyRate', 'Daily Rate')}:</span>
                                <span className="price-value">{results.currency} {Number(car.daily_rate).toFixed(2)}</span>
                              </div>
                            )}
                            {Number(car.total_fare) > 0 && (
                              <div className="car-price car-price--total">
                                <span className="price-label">{t('home.totalFare', 'Total Fare')}:</span>
                                <span className="price-value price-value--total">{results.currency} {Number(car.total_fare).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hire packages */}
                        {results.service_type === 'hire' && (() => {
                          const pkgData = hirePackages[car.car_id];
                          if (!pkgData) return null;
                          const isCarSelected = selectedHirePackage?.carId === car.car_id;
                          return (
                            <div className="hire-packages">
                              <p className="hire-packages-label">{t('home.selectPackage') || 'Select Package'}</p>
                              {pkgData.loading && (
                                <div className="hire-packages-loading">
                                  <div className="spinner-small"></div>
                                  <span>{t('home.loadingPackages') || 'Loading packages…'}</span>
                                </div>
                              )}
                              {pkgData.error && (
                                <p className="hire-packages-error">{pkgData.error}</p>
                              )}
                              {!pkgData.loading && pkgData.list.length === 0 && !pkgData.error && (
                                <p className="hire-packages-empty">{t('home.noPackages') || 'No packages available.'}</p>
                              )}
                              {!pkgData.loading && pkgData.list.length > 0 && (
                                <div className="hire-packages-list">
                                  {pkgData.list.map((pkg) => {
                                    const pkgId = pkg.id ?? pkg.package_id ?? pkg.hire_package_id;
                                    const pkgTitle = pkg.title ?? pkg.name ?? String(pkgId);
                                    const isSelected = isCarSelected && selectedHirePackage?.id === pkgId;
                                    return (
                                      <button
                                        key={pkgId}
                                        type="button"
                                        className={`hire-package-btn${isSelected ? ' selected' : ''}`}
                                        onClick={() =>
                                          onSelectHirePackage(
                                            isSelected
                                              ? null
                                              : { carId: car.car_id, id: pkgId, title: pkgTitle }
                                          )
                                        }
                                      >
                                        {pkgTitle}
                                        {isSelected && <span className="hire-package-check">✓</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {isCarSelected && selectedHirePackage && (
                                <p className="hire-package-selected-note">
                                  {t('home.packageSelected') || 'Package selected:'} <strong>{selectedHirePackage.title}</strong>
                                </p>
                              )}
                            </div>
                          );
                        })()}

                        <button className="book-car-btn" onClick={() => onBookNow(car)}>
                          {t('home.bookNow')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-cars-found">
                    <div className="empty-icon">🚗</div>
                    <h3>{t('home.noCarsAvailable')}</h3>
                    <p>{t('home.tryDifferentSearch')}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarSearchResultsModal;
