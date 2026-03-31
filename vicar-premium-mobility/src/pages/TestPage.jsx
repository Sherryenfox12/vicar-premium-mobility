import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddressAutocomplete from '../components/AddressAutocomplete';

const HIRE_DETAIL_API_URL = import.meta.env.VITE_LANDING_PAGE_CAR_DETAIL_URL;

// Derive the getHireDurationOptionsAPI base from the same domain
const HIRE_DURATION_OPTIONS_API_URL = HIRE_DETAIL_API_URL
  ? HIRE_DETAIL_API_URL.replace(/\/[^/]+$/, '/getHireDurationOptionsAPI')
  : '';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  return `${date} ${time}:00`;
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  background: '#fff',
  boxSizing: 'border-box',
  fontSize: 14,
  color: '#000',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 4,
  fontSize: 13,
  color: '#000',
};

// ─── Hire Duration Options Hook ───────────────────────────────────────────────
function useHirePackages(carIds) {
  const [packagesMap, setPackagesMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  useEffect(() => {
    if (!carIds || carIds.length === 0) return;

    carIds.forEach((carId) => {
      if (packagesMap[carId] !== undefined) return; // already fetched

      setLoadingMap((prev) => ({ ...prev, [carId]: true }));

      axios
        .get(HIRE_DURATION_OPTIONS_API_URL, {
          params: { car_id: carId },
        })
        .then((res) => {
          const raw = res.data;
          // Normalise: may be array, or { data: [...] }, or { packages: [...] }
          const list = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
              ? raw.data
              : Array.isArray(raw?.packages)
                ? raw.packages
                : raw != null && typeof raw === 'object'
                  ? [raw]
                  : [];
          setPackagesMap((prev) => ({ ...prev, [carId]: { list, raw } }));
        })
        .catch((err) => {
          const msg =
            err.response?.data?.msg ||
            err.response?.data?.message ||
            err.message ||
            'Unknown error';
          setErrorMap((prev) => ({ ...prev, [carId]: msg }));
          setPackagesMap((prev) => ({ ...prev, [carId]: { list: [], raw: null } }));
        })
        .finally(() => {
          setLoadingMap((prev) => ({ ...prev, [carId]: false }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(carIds)]);

  return { packagesMap, loadingMap, errorMap };
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, selected, onSelect }) {
  const id = pkg.id ?? pkg.package_id ?? pkg.hire_package_id ?? pkg.option_id;
  const title = pkg.title ?? pkg.name ?? pkg.label ?? String(id);

  return (
    <div
      onClick={() => id != null && onSelect(id)}
      style={{
        border: `2px solid ${selected ? '#c0392b' : '#ddd'}`,
        borderRadius: 10,
        padding: '12px 16px',
        background: selected ? '#fff8f0' : '#fff',
        cursor: id != null ? 'pointer' : 'default',
        marginBottom: 8,
        transition: 'border-color 0.2s, background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{title}</span>
      <span
        style={{
          display: 'inline-block',
          padding: '3px 12px',
          background: selected ? '#c0392b' : '#eee',
          color: selected ? '#fff' : '#333',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {selected ? '✓ Selected' : 'Select'}
      </span>
    </div>
  );
}

// ─── Car Result Row ───────────────────────────────────────────────────────────
function CarResultRow({ car, packagesMap, loadingMap, errorMap, selectedPackageId, onSelectPackage }) {
  const pkgData = packagesMap[car.car_id];
  const isLoading = loadingMap[car.car_id];
  const pkgError = errorMap[car.car_id];

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid #e0e0e0',
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}
    >
      {/* Car header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
        {car.car_picture && (
          <img
            src={car.car_picture}
            alt={car.car_name}
            style={{
              width: 120,
              height: 78,
              objectFit: 'cover',
              borderRadius: 8,
              flexShrink: 0,
              background: '#f4f4f4',
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px', color: '#000' }}>
            {car.car_name}
          </p>
          {car.car_type && (
            <p style={{ fontSize: 13, color: '#000', margin: '0 0 4px' }}>{car.car_type}</p>
          )}
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#000', flexWrap: 'wrap' }}>
            {car.car_id != null && <span><strong>car_id:</strong> {car.car_id}</span>}
            {car.max_passenger != null && <span><strong>max_passenger:</strong> {car.max_passenger}</span>}
            {car.luggage_size != null && <span><strong>luggage_size:</strong> {car.luggage_size}</span>}
            {car.service_type && <span><strong>service_type:</strong> {car.service_type}</span>}
            {car.price_per_km != null && <span><strong>price_per_km:</strong> {car.price_per_km}</span>}
            {car.daily_rate != null && car.daily_rate > 0 && (
              <span><strong>daily_rate:</strong> MYR {car.daily_rate}</span>
            )}
            {car.total_fare != null && car.total_fare > 0 && (
              <span><strong>total_fare:</strong> MYR {car.total_fare}</span>
            )}
            {car.car_highlight && <span><strong>highlight:</strong> {car.car_highlight}</span>}
          </div>
        </div>
      </div>

      {/* Hire Packages */}
      <div>
        <p style={{ fontWeight: 700, fontSize: 13, color: '#000', marginBottom: 8 }}>
          Hire Duration Packages
          {isLoading && (
            <span style={{ marginLeft: 8, fontWeight: 400, color: '#888', fontSize: 12 }}>
              Loading…
            </span>
          )}
        </p>

        {pkgError && (
          <p style={{ color: '#c53030', fontSize: 12, margin: 0 }}>
            Error fetching packages: {pkgError}
          </p>
        )}

        {!isLoading && !pkgError && pkgData && pkgData.list.length === 0 && (
          <p style={{ color: '#888', fontSize: 12, margin: 0 }}>No packages returned.</p>
        )}

        {!isLoading && pkgData && pkgData.list.length > 0 && (
          <div>
            {pkgData.list.map((pkg, idx) => {
              const pkgId = pkg.id ?? pkg.package_id ?? pkg.hire_package_id ?? pkg.option_id;
              return (
                <PackageCard
                  key={pkgId ?? idx}
                  pkg={pkg}
                  selected={selectedPackageId === pkgId}
                  onSelect={onSelectPackage}
                />
              );
            })}
          </div>
        )}

        {/* Raw API response for this car */}
        {pkgData?.raw && (
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 11, color: '#aaa', cursor: 'pointer' }}>
              Raw getHireDurationOptionsAPI response (car_id: {car.car_id})
            </summary>
            <pre
              style={{
                fontSize: 11,
                overflow: 'auto',
                maxHeight: 200,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginTop: 6,
                background: '#f4f4f4',
                padding: 10,
                borderRadius: 8,
                color: '#000',
              }}
            >
              {JSON.stringify(pkgData.raw, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function TestPage() {
  const [form, setForm] = useState({
    pickupAddress: '',
    pickupLat: null,
    pickupLng: null,
    pickup_date: '',
    pickup_time: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // { cars, meta }
  const [error, setError] = useState(null);

  // Selected package_id (one globally for simplicity; can be extended per-car)
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // Gather car_ids once results arrive
  const carIds = response?.cars?.map((c) => c.car_id).filter(Boolean) ?? [];

  const { packagesMap, loadingMap, errorMap } = useHirePackages(carIds);

  const handlePickupPlaceSelect = (place) => {
    if (place.geometry && place.geometry.location) {
      setForm((prev) => ({
        ...prev,
        pickupAddress: place.formatted_address || '',
        pickupLat: place.geometry.location.lat(),
        pickupLng: place.geometry.location.lng(),
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!form.pickupAddress || form.pickupLat == null) {
      alert('Please select a pickup location from the suggestions.');
      return;
    }
    if (!form.pickup_date || !form.pickup_time) {
      alert('Please enter pickup date and time.');
      return;
    }

    const payload = {
      landingPageCarDetailAPI: {
        service_type: 'hire',
        pickup_date: formatDateTime(form.pickup_date, form.pickup_time),
        pickup: {
          lat: form.pickupLat,
          lng: form.pickupLng,
        },
      },
    };

    console.log('[Hire Search] payload:', payload);
    console.log('[Hire Search] API URL:', HIRE_DETAIL_API_URL);

    try {
      setLoading(true);
      setError(null);
      setResponse(null);
      setSelectedPackageId(null);

      const res = await axios.post(HIRE_DETAIL_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('[Hire Search] raw response:', res.data);

      const raw = res.data;
      const carList = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.cars)
          ? raw.cars
          : Array.isArray(raw?.data)
            ? raw.data
            : [];

      setResponse({ cars: carList, meta: raw });
    } catch (err) {
      console.error('[Hire Search] error:', err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        'Unknown error';
      setError(msg);
      console.log('[Hire Search] error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 6, fontSize: 20, fontWeight: 700, color: '#000' }}>
        Hire Search Test
      </h2>
      <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>
        API: <code style={{ background: '#f4f4f4', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
          {HIRE_DETAIL_API_URL}
        </code>
      </p>

      {/* ── Search Form ── */}
      <form
        onSubmit={handleSearch}
        style={{
          background: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* service_type — fixed */}
        <div>
          <label style={labelStyle}>service_type</label>
          <input
            type="text"
            value="hire"
            readOnly
            style={{ ...inputStyle, background: '#eee', color: '#888' }}
          />
        </div>

        {/* pickup location */}
        <div>
          <label style={labelStyle}>pickup location</label>
          <AddressAutocomplete
            value={form.pickupAddress}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                pickupAddress: e.target.value,
                pickupLat: null,
                pickupLng: null,
              }))
            }
            onPlaceSelect={handlePickupPlaceSelect}
            placeholder="Search pickup address…"
            className="home-form-input"
          />
          {form.pickupLat != null && (
            <small style={{ color: '#000', display: 'block', marginTop: 4 }}>
              lat: {form.pickupLat}, lng: {form.pickupLng}
            </small>
          )}
        </div>

        {/* pickup_date (date + time → yyyy-mm-dd HH:ii:ss) */}
        <div>
          <label style={labelStyle}>pickup_date</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              value={form.pickup_date}
              min={getTodayDate()}
              onChange={(e) => setForm((prev) => ({ ...prev, pickup_date: e.target.value }))}
              style={{ flex: 1, ...inputStyle }}
            />
            <input
              type="time"
              value={form.pickup_time}
              onChange={(e) => setForm((prev) => ({ ...prev, pickup_time: e.target.value }))}
              style={{ flex: 1, ...inputStyle }}
            />
          </div>
          {form.pickup_date && form.pickup_time && (
            <small style={{ color: '#000', display: 'block', marginTop: 4 }}>
              → {formatDateTime(form.pickup_date, form.pickup_time)}
            </small>
          )}
        </div>

        {/* package_id display (read-only, updated after results load) */}
        <div>
          <label style={labelStyle}>package_id</label>
          <input
            type="text"
            value={selectedPackageId ?? ''}
            readOnly
            placeholder="Select a package from the results below"
            style={{ ...inputStyle, background: '#eee', color: selectedPackageId ? '#000' : '#888' }}
          />
          {selectedPackageId != null && (
            <small style={{ color: '#000', display: 'block', marginTop: 4 }}>
              Selected package_id: <strong>{selectedPackageId}</strong>
            </small>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? '#aaa' : '#c0392b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Searching…' : 'Search Hire Cars'}
        </button>
      </form>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            marginTop: 24,
            background: '#fff5f5',
            border: '1px solid #fc8181',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ color: '#c53030', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            Error
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#000' }}>{error}</p>
        </div>
      )}

      {/* ── Car Results + Hire Packages ── */}
      {response && !error && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#000' }}>
            Available Cars ({response.cars.length})
          </h3>

          {response.cars.length === 0 && (
            <p style={{ color: '#888', fontSize: 14 }}>No cars returned for the selected criteria.</p>
          )}

          {response.cars.map((car) => (
            <CarResultRow
              key={car.car_id}
              car={car}
              packagesMap={packagesMap}
              loadingMap={loadingMap}
              errorMap={errorMap}
              selectedPackageId={selectedPackageId}
              onSelectPackage={setSelectedPackageId}
            />
          ))}

          {/* Raw main API response */}
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}>
              View raw landingPageCarDetailAPI response
            </summary>
            <pre
              style={{
                fontSize: 11,
                overflow: 'auto',
                maxHeight: 300,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginTop: 8,
                background: '#f4f4f4',
                padding: 12,
                borderRadius: 8,
                color: '#000',
              }}
            >
              {JSON.stringify(response.meta, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default TestPage;
