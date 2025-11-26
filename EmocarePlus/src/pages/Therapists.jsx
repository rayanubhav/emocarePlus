import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaVideo, FaMapMarkedAlt } from 'react-icons/fa';
import { RiMapPinFill, RiPhoneFill, RiRouteFill } from 'react-icons/ri';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Import the new component
import TeleTherapy from './TeleTherapy'; // <--- Make sure path is correct

// ... (Keep your existing Leaflet Icon fix here) ...
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Therapists = () => {
  // --- NEW STATE FOR MODE TOGGLE ---
  const [mode, setMode] = useState('map'); // 'map' or 'video'
  // ---------------------------------

  const [location, setLocation] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('mental health therapist');
  const [activeTherapist, setActiveTherapist] = useState(null);
  const mapRef = useRef(null);

  const LocationIcon = () => <RiMapPinFill className="h-5 w-5 mr-2 text-[var(--color-text-muted)]" />;
  const CallIcon = () => <RiPhoneFill className="h-4 w-4 mr-1.5" />;
  const RouteIcon = () => <RiRouteFill className="h-4 w-4 mr-1.5" />;

  useEffect(() => {
    // Only fetch location if we are in map mode
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
  }, [mode]); // Re-run when mode changes to 'map'

  const fetchTherapists = async (lat, lng, searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/therapists', {
        params: { lat, lng, query: searchQuery },
      });
      setTherapists(response.data || []);
      if (!response.data || response.data.length === 0) setError('No therapists found nearby.');
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
    if (mapRef.current) mapRef.current.flyTo([therapist.latitude, therapist.longitude], 15);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      
      {/* HEADER WITH TOGGLE */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="text-2xl font-bold text-white">
                {mode === 'map' ? 'Find Nearby Help' : 'Online Consultation'}
            </h3>
            <p className="text-gray-400 text-sm">
                {mode === 'map' ? 'Locate physical clinics near you.' : 'Connect instantly via video.'}
            </p>
        </div>
        
        {/* MODE SWITCHER BUTTONS */}
        <div className="flex bg-gray-800 p-1 rounded-lg">
            <button 
                onClick={() => setMode('map')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${mode === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                <FaMapMarkedAlt /> Map View
            </button>
            <button 
                onClick={() => setMode('video')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${mode === 'video' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                <FaVideo /> Tele-Therapy
            </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode='wait'>
            
            {/* VIEW 1: MAP (Your Existing Logic) */}
            {mode === 'map' ? (
                <motion.div 
                    key="map"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full flex flex-col lg:grid lg:grid-cols-3 gap-6"
                >
                    {/* ... (Search Bar was here, move it if you want, or keep it in the layout) ... */}
                     <div className="lg:col-span-1 h-full flex flex-col">
                        <form onSubmit={handleSearch} className="flex items-center mb-4 bg-[var(--color-surface)] p-2 rounded-lg shadow-sm">
                            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 border-none outline-none bg-transparent text-white" />
                            <button type="submit" className="btn px-4 py-2 bg-blue-600 text-white rounded">Search</button>
                        </form>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? <FaSpinner className="animate-spin text-white" /> : (
                                <ul className="space-y-3">
                                {therapists.map(therapist => (
                                    <li key={therapist.id} onClick={() => handleTherapistSelect(therapist)} className="p-4 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700 transition-all">
                                        <h4 className="font-semibold text-white">{therapist.name}</h4>
                                        <p className="text-sm text-gray-400 mt-1 flex items-center"><LocationIcon /> {therapist.address}</p>
                                    </li>
                                ))}
                                </ul>
                            )}
                        </div>
                     </div>

                     <div className="lg:col-span-2 h-full rounded-xl overflow-hidden shadow-lg bg-gray-500 relative z-0">
                        {location && (
                            <MapContainer ref={mapRef} center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {therapists.map(t => (
                                    <Marker key={t.id} position={[t.latitude, t.longitude]}>
                                        <Popup><b>{t.name}</b><br />{t.address}</Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        )}
                     </div>
                </motion.div>
            ) : (
                /* VIEW 2: VIDEO (New Component) */
                <TeleTherapy onBack={() => setMode('map')} />
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;