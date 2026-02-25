import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider'; // Import your theme hook
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
  const { isDarkMode } = useTheme(); // Get the current theme state
  const [mode, setMode] = useState('map');
  const [location, setLocation] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('mental health therapist');
  const [activeTherapist, setActiveTherapist] = useState(null);
  const mapRef = useRef(null);

  // Map Tile Configurations for Dark/Light
  const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

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
      className={`flex flex-col h-full w-full overflow-hidden fixed inset-0 lg:relative ${isDarkMode ? 'bg-[#0F172A]' : 'bg-surface-light'}`}
    >

      {/* 1. THEMED HEADER */}
      <div className={`flex justify-between items-center p-2 border-b shrink-0 z-20 shadow-sm ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-border'}`}>
        <h3 className={`text-xs font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-text-main'}`}>
          {mode === 'map' ? <FaMapMarkedAlt className="text-[#5B9BD5]" /> : <FaVideo className="text-[#72C5A8]" />}
          {mode === 'map' ? 'Therapists' : 'Consultation'}
        </h3>
        <div className={`flex border rounded-md overflow-hidden ${isDarkMode ? 'bg-[#334155] border-slate-600' : 'bg-surface-light border-border'}`}>
          <button onClick={() => setMode('map')} className={`px-2.5 py-1 text-[9px] font-bold ${mode === 'map' ? 'bg-[#5B9BD5] text-white' : (isDarkMode ? 'text-slate-400' : 'text-text-muted')}`}>Map</button>
          <button onClick={() => setMode('video')} className={`px-2.5 py-1 text-[9px] font-bold ${mode === 'video' ? 'bg-[#72C5A8] text-white' : (isDarkMode ? 'text-slate-400' : 'text-text-muted')}`}>Video</button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        <AnimatePresence mode='wait'>
          {mode === 'map' ? (
            <motion.div key="map-mode" className="flex flex-col lg:flex-row w-full h-full">

              {/* THEMED MAP SECTION */}
              <div className={`w-full lg:w-2/3 h-[30%] lg:h-full relative border-b lg:border-r lg:border-b-0 shrink-0 ${isDarkMode ? 'border-slate-700' : 'border-border'}`} style={{ zIndex: 0 }}>
                {location ? (
                  <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                    <TileLayer url={isDarkMode ? darkTiles : lightTiles} />
                    {therapists.map(t => (
                      <Marker key={t.id} position={[t.latitude, t.longitude]}>
                        <Popup>
                          <div className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                            <b className="text-[10px]">{t.name}</b>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className={`h-full w-full flex items-center justify-center ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gray-50'}`}><FaSpinner className="animate-spin text-[#5B9BD5]" /></div>
                )}
              </div>

              {/* THEMED LIST SECTION */}
              <div className={`flex flex-col w-full lg:w-1/3 h-[70%] lg:h-full overflow-hidden ${isDarkMode ? 'bg-[#0F172A]' : 'bg-white'}`}>

                {/* Search Bar */}
                <form onSubmit={(e) => { e.preventDefault(); fetchTherapists(location.lat, location.lng, query); }} className={`p-2 border-b flex gap-2 shrink-0 ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-border'}`}>
                  <input
                    type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search specialists..."
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] outline-none border ${isDarkMode ? 'bg-[#334155] border-slate-600 text-white placeholder-slate-400 focus:border-[#5B9BD5]' : 'bg-gray-50 border-border text-gray-800 focus:border-[#5B9BD5]'}`}
                  />
                  <button type="submit" className="px-3 py-1.5 bg-[#5B9BD5] text-white rounded-lg text-[11px] font-bold"><FaSearch /></button>
                </form>

                {/* SCROLLABLE LIST */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-24 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center pt-8">
                      <FaSpinner className={`animate-spin text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                      <span className="text-[9px] mt-2">Loading specialists...</span>
                    </div>
                  ) : (
                    therapists.map(t => (
                      <div
                        key={t.id} onClick={() => handleTherapistSelect(t)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${activeTherapist?.id === t.id
                            ? (isDarkMode ? 'border-[#5B9BD5] bg-[#1E293B] shadow-lg' : 'border-[#5B9BD5] bg-blue-50/40 shadow-sm')
                            : (isDarkMode ? 'border-slate-700 bg-[#1E293B] hover:border-slate-500' : 'border-border bg-white hover:bg-gray-50')
                          }`}
                      >
                        <h4 className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{t.name}</h4>
                        <p className={`text-[9px] truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>📍 {t.address}</p>
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${t.phone}`} onClick={(e) => e.stopPropagation()} className={`flex-1 py-1 text-[9px] font-bold rounded border flex items-center justify-center gap-1 ${isDarkMode ? 'bg-[#064E3B] text-[#A7F3D0] border-[#065F46]' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            <FaPhoneAlt size={7} /> Call
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${t.latitude},${t.longitude}`}
                            target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            className={`flex-1 py-1 text-[9px] font-bold rounded border flex items-center justify-center gap-1 ${isDarkMode ? 'bg-[#1E3A8A] text-[#BFDBFE] border-[#1E40AF]' : 'bg-blue-50 text-blue-700 border-blue-100'}`}
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
            <div className={`h-full w-full overflow-y-auto ${isDarkMode ? 'bg-[#0F172A]' : 'bg-white'}`}><TeleTherapy onBack={() => setMode('map')} /></div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;