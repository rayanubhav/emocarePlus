import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaVideo, FaMapMarkedAlt, FaSearch, FaPhoneAlt, FaDirections } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import TeleTherapy from './TeleTherapy';

// Fixed Leaflet Marker Icons
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
          setLocation({ lat: latitude, lng: longitude });
          fetchTherapists(latitude, longitude, query);
        },
        () => {
          setError('Using default location (Thane).');
          const defaultLoc = { lat: 19.2183, lng: 72.9781 };
          setLocation(defaultLoc);
          fetchTherapists(defaultLoc.lat, defaultLoc.lng, query);
        }
      );
    }
  }, [mode]);

  const fetchTherapists = async (lat, lng, searchQuery) => {
    setLoading(true);
    try {
      const response = await api.get('/api/therapists', {
        params: { lat, lng, query: searchQuery },
      });
      setTherapists(response.data || []);
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleTherapistSelect = (therapist) => {
    setActiveTherapist(therapist);
    if (mapRef.current) {
      mapRef.current.flyTo([therapist.latitude, therapist.longitude], 15);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full w-full bg-surface-light overflow-hidden fixed inset-0 lg:relative"
    >

      {/* 1. SLIM HEADER */}
      <div className="flex justify-between items-center p-2 bg-white border-b border-border shrink-0 z-20 shadow-sm">
        <h3 className="text-xs font-bold text-text-main flex items-center gap-2">
          {mode === 'map' ? <FaMapMarkedAlt className="text-[#5B9BD5]" /> : <FaVideo className="text-[#72C5A8]" />}
          {mode === 'map' ? 'Therapists' : 'Consultation'}
        </h3>
        <div className="flex bg-surface-light border border-border rounded-md overflow-hidden">
          <button onClick={() => setMode('map')} className={`px-2.5 py-1 text-[9px] font-bold ${mode === 'map' ? 'bg-[#5B9BD5] text-white' : 'text-text-muted'}`}>Map</button>
          <button onClick={() => setMode('video')} className={`px-2.5 py-1 text-[9px] font-bold ${mode === 'video' ? 'bg-[#72C5A8] text-white' : 'text-text-muted'}`}>Video</button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        <AnimatePresence mode='wait'>
          {mode === 'map' ? (
            <motion.div
              key="map-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row w-full h-full"
            >

              {/* MAP (30% on Mobile) - Locked at top */}
              <div className="w-full lg:w-2/3 h-[30%] lg:h-full relative border-b border-border lg:border-r lg:border-b-0 shrink-0" style={{ zIndex: 0 }}>
                {location ? (
                  <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    {therapists.map(t => (
                      <Marker key={t.id} position={[t.latitude, t.longitude]}>
                        <Popup><b className="text-[10px]">{t.name}</b></Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50"><FaSpinner className="animate-spin text-[#5B9BD5]" /></div>
                )}
              </div>

              {/* LIST SECTION (70% on Mobile) - Fully scrollable */}
              <div className="flex flex-col w-full lg:w-1/3 h-[70%] lg:h-full bg-white overflow-hidden">

                {/* Compact Search Bar - Fixed at top of list */}
                <form
                  onSubmit={(e) => { e.preventDefault(); fetchTherapists(location.lat, location.lng, query); }}
                  className="p-2 border-b border-border flex gap-2 shrink-0 bg-white"
                >
                  <input
                    type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search specialists..."
                    className="flex-1 px-2 py-1.5 bg-gray-50 border border-border rounded-lg text-[11px] outline-none focus:border-[#5B9BD5]"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-[#5B9BD5] text-white rounded-lg text-[11px] font-bold"><FaSearch /></button>
                </form>

                {/* SCROLLABLE AREA FOR CARDS */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2 pb-24 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center pt-8 text-gray-400">
                      <FaSpinner className="animate-spin text-lg" />
                      <span className="text-[9px] mt-2">Loading specialists...</span>
                    </div>
                  ) : (
                    therapists.map(t => (
                      <div
                        key={t.id}
                        onClick={() => handleTherapistSelect(t)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${activeTherapist?.id === t.id ? 'border-[#5B9BD5] bg-blue-50/40 shadow-sm' : 'border-border hover:bg-gray-50'
                          }`}
                      >
                        <h4 className="text-[11px] font-bold text-gray-800 truncate">{t.name}</h4>
                        <p className="text-[9px] text-gray-500 truncate mt-0.5">📍 {t.address}</p>
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${t.phone}`} onClick={(e) => e.stopPropagation()} className="flex-1 py-1 bg-green-50 text-green-700 text-[9px] font-bold rounded border border-green-100 flex items-center justify-center gap-1">
                            <FaPhoneAlt size={7} /> Call
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${t.latitude},${t.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-1 bg-blue-50 text-blue-700 text-[9px] font-bold rounded border border-blue-100 flex items-center justify-center gap-1"
                          >
                            <FaDirections size={7} /> Route
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                  {error && <p className="text-center text-red-400 text-[9px] p-4">{error}</p>}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="h-full w-full bg-white overflow-y-auto"><TeleTherapy onBack={() => setMode('map')} /></div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;