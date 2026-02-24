import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaVideo, FaMapMarkedAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import TeleTherapy from './TeleTherapy';

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
          setError('Location access denied. Using a default location.');
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
        setError('No therapists found nearby. Try a broader search.');
      }
    } catch (err) {
      setError("Could not connect to the server.");
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
    if (window.innerWidth < 1024 && mapRef.current) {
      mapRef.current._container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-auto lg:h-full overflow-hidden">
      {/* HEADER */}
      <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 px-1 pt-1">
        <div>
          <h3 className="text-[18px] font-bold text-text-main">
            {mode === 'map' ? 'Find Nearby Help' : 'Online Consultation'}
          </h3>
          <p className="text-text-muted text-[12px] mt-1">
            {mode === 'map' ? 'Locate clinics and therapists near you' : 'Connect instantly via secure video'}
          </p>
        </div>

        <div className="flex bg-surface-light border-[1.5px] border-border rounded-[12px] overflow-hidden">
          <button
            onClick={() => setMode('map')}
            className={`px-4 py-2 flex items-center gap-1.5 text-[12px] font-bold transition-all ${mode === 'map' ? 'bg-[#5B9BD5] text-white' : 'bg-transparent text-text-muted'}`}
          >
            <FaMapMarkedAlt /> Map View
          </button>
          <button
            onClick={() => setMode('video')}
            className={`px-4 py-2 flex items-center gap-1.5 text-[12px] font-bold transition-all ${mode === 'video' ? 'bg-[#72C5A8] text-white' : 'bg-transparent text-text-muted'}`}
          >
            <FaVideo /> Tele-Therapy
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 relative lg:min-h-0">
        <AnimatePresence mode='wait'>

          {mode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:h-full"
            >

              <div className="flex flex-col order-2 lg:order-1 lg:col-span-1 h-full min-h-0">

                <form onSubmit={handleSearch} className="flex gap-2 mb-3 shrink-0">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="mental health therapist"
                    className="flex-1 p-2.5 bg-surface border-[1.5px] border-border rounded-[12px] text-[13px] text-text-main outline-none focus:border-[#5B9BD5]"
                  />
                  <button type="submit" className="px-4 py-2.5 bg-[#5B9BD5] text-white rounded-[12px] text-[13px] font-semibold">
                    Search
                  </button>
                </form>

                <div className="h-96 lg:h-auto lg:flex-1 overflow-y-auto pr-1">
                  {loading ? (
                    <div className="text-center pt-10"><FaSpinner className="animate-spin text-[#5B9BD5] inline-block text-2xl" /></div>
                  ) : (
                    <ul className="flex flex-col gap-2.5">
                      {therapists.map(t => (
                        <li
                          key={t.id}
                          onClick={() => handleTherapistSelect(t)}
                          className={`p-3.5 bg-surface border rounded-[16px] cursor-pointer transition-all ${activeTherapist?.id === t.id
                            ? 'border-[#5B9BD5] bg-[#D6EAFC]/20 shadow-[0_2px_12px_rgba(91,155,213,0.1)]'
                            : 'border-border hover:border-[#5B9BD5]'
                            }`}
                        >
                          <h4 className="text-[13px] font-bold text-text-main">{t.name}</h4>
                          <p className="text-[11px] text-text-muted mt-1 flex items-center">
                            📍 {t.address}
                          </p>
                          <div className="flex gap-2 mt-2.5">
                            <a href={`tel:${t.phone}`} onClick={e => e.stopPropagation()} className="px-3 py-1 bg-[#D4F2E8] text-[#3A9A7A] text-[11px] font-bold rounded-full hover:opacity-85 flex items-center gap-1">
                              📞 Call
                            </a>
                            <a href={`http://maps.google.com/maps?q=${t.latitude},${t.longitude}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-3 py-1 bg-[#D6EAFC] text-[#3A6FA8] text-[11px] font-bold rounded-full hover:opacity-85 flex items-center gap-1">
                              🗺 Route
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!loading && therapists.length === 0 && (
                    <p className="text-center text-text-muted text-[13px] mt-10">No results found.</p>
                  )}
                  {error && <p className="text-center text-error text-[12px] mt-4">{error}</p>}
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-2 h-80 lg:h-full rounded-[20px] overflow-hidden border border-border relative z-0">
                {location ? (
                  <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} dragging={!L.Browser.mobile}>
                    <TileLayer
                      attribution='© OpenStreetMap'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {therapists.map(t => (
                      <Marker key={t.id} position={[t.latitude, t.longitude]}>
                        <Popup>
                          <b className="text-text-main">{t.name}</b><br /><span className=" text-text-muted text-xs">{t.address}</span>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D6EAFC] to-[#EAF7F1]">
                    <div className="text-[48px] opacity-40 mb-2">🗺️</div>
                    <div className="text-[13px] font-semibold text-text-muted">Loading Map...</div>
                  </div>
                )}
              </div>

            </motion.div>
          ) : (
            <TeleTherapy onBack={() => setMode('map')} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;