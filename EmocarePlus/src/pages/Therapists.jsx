import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaVideo, FaMapMarkedAlt, FaSearch, FaPhoneAlt, FaDirections } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import TeleTherapy from './TeleTherapy';

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Therapists = () => {
  const [mode, setMode] = useState('map');
  const [location, setLocation] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('mental health therapist');
  const [activeTherapist, setActiveTherapist] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mode === 'map') {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLoc = { lat: latitude, lng: longitude };
          setLocation(newLoc);
          fetchTherapists(newLoc.lat, newLoc.lng, query);
        },
        () => {
          setError('Location access denied. Using default.');
          const defaultLocation = { lat: 19.2183, lng: 72.9781 };
          setLocation(defaultLocation);
          fetchTherapists(defaultLocation.lat, defaultLocation.lng, query);
        }
      );
    }
  }, [mode]);

  const fetchTherapists = async (lat, lng, searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/therapists', {
        params: { lat, lng, query: searchQuery },
      });
      setTherapists(response.data || []);
      if (!response.data || response.data.length === 0) {
        setError('No therapists found nearby.');
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location) fetchTherapists(location.lat, location.lng, query);
  };

  const handleTherapistSelect = (therapist) => {
    setActiveTherapist(therapist);
    if (mapRef.current) {
      mapRef.current.flyTo([therapist.latitude, therapist.longitude], 15);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full w-full overflow-hidden max-w-7xl mx-auto">

      {/* COMPACT HEADER - Improved for Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-surface shrink-0 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
            {mode === 'map' ? <FaMapMarkedAlt className="text-[#5B9BD5]" /> : <FaVideo className="text-[#72C5A8]" />}
            {mode === 'map' ? 'Nearby Help' : 'Online Session'}
          </h3>
          <p className="text-text-muted text-[11px] leading-tight hidden xs:block">
            {mode === 'map' ? 'Find local clinics' : 'Secure video consultation'}
          </p>
        </div>

        <div className="flex bg-surface-light border border-border rounded-xl overflow-hidden self-stretch sm:self-auto shadow-sm">
          <button
            onClick={() => setMode('map')}
            className={`flex-1 sm:flex-none px-4 py-2 flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${mode === 'map' ? 'bg-[#5B9BD5] text-white' : 'text-text-muted hover:bg-surface'}`}
          >
            Map
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex-1 sm:flex-none px-4 py-2 flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${mode === 'video' ? 'bg-[#72C5A8] text-white' : 'text-text-muted hover:bg-surface'}`}
          >
            Tele-Therapy
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 relative overflow-hidden bg-surface-light">
        <AnimatePresence mode='wait'>
          {mode === 'map' ? (
            <motion.div
              key="map-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row h-full w-full"
            >
              {/* LIST SECTION - Scrollable */}
              <div className="flex flex-col w-full lg:w-1/3 h-1/2 lg:h-full border-r border-border bg-surface z-10 shadow-lg lg:shadow-none">

                {/* Search Bar inside list for better context */}
                <form onSubmit={handleSearch} className="p-3 border-b border-border flex gap-2 bg-surface">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search therapist..."
                      className="w-full pl-8 pr-3 py-2 bg-surface-light border border-border rounded-lg text-xs outline-none focus:border-[#5B9BD5]"
                    />
                  </div>
                  <button type="submit" className="px-3 py-2 bg-[#5B9BD5] text-white rounded-lg text-xs font-bold">
                    Go
                  </button>
                </form>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-text-muted gap-2">
                      <FaSpinner className="animate-spin text-2xl text-[#5B9BD5]" />
                      <span className="text-[11px]">Finding experts...</span>
                    </div>
                  ) : (
                    <>
                      {therapists.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleTherapistSelect(t)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${activeTherapist?.id === t.id
                              ? 'border-[#5B9BD5] bg-blue-50/30'
                              : 'border-border bg-surface hover:border-[#5B9BD5]/50'
                            }`}
                        >
                          <h4 className="text-[13px] font-bold text-text-main">{t.name}</h4>
                          <p className="text-[10px] text-text-muted line-clamp-1 mt-1">📍 {t.address}</p>
                          <div className="flex gap-2 mt-3">
                            <a href={`tel:${t.phone}`} className="flex-1 py-1.5 bg-[#D4F2E8] text-[#3A9A7A] text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                              <FaPhoneAlt size={10} /> Call
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${t.latitude},${t.longitude}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex-1 py-1.5 bg-[#D6EAFC] text-[#3A6FA8] text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"
                            >
                              <FaDirections size={10} /> Directions
                            </a>
                          </div>
                        </div>
                      ))}
                      {therapists.length === 0 && !error && (
                        <p className="text-center text-text-muted text-[11px] mt-10">No therapists found in this area.</p>
                      )}
                      {error && <p className="text-center text-error text-[11px] mt-4">{error}</p>}
                    </>
                  )}
                </div>
              </div>

              {/* MAP SECTION - Fills the rest */}
              <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative overflow-hidden">
                {location ? (
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                  >
                    <TileLayer
                      attribution='© OpenStreetMap'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {therapists.map(t => (
                      <Marker key={t.id} position={[t.latitude, t.longitude]}>
                        <Popup>
                          <div className="p-1">
                            <b className="text-[12px] block">{t.name}</b>
                            <span className="text-[10px] text-text-muted">{t.address}</span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-surface-light">
                    <span className="text-xs text-text-muted">Initializing Map...</span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full overflow-y-auto">
              <TeleTherapy onBack={() => setMode('map')} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;