import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaVideo, FaMapMarkedAlt } from 'react-icons/fa';
import { RiMapPinFill, RiPhoneFill, RiRouteFill } from 'react-icons/ri';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Import the new TeleTherapy component
// Make sure this file exists in the same folder!
import TeleTherapy from './TeleTherapy'; 

// Fix for default Leaflet icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Therapists = () => {
  // State for Toggle
  const [mode, setMode] = useState('map'); // 'map' or 'video'
  
  // State for Data
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
          const defaultLocation = { lat: 19.2183, lng: 72.9781 }; // Thane
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
      console.error("Failed to fetch therapists:", err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location) {
      fetchTherapists(location.lat, location.lng, query);
    }
  };

  const handleTherapistSelect = (therapist) => {
    setActiveTherapist(therapist);
    if (mapRef.current) {
      mapRef.current.flyTo([therapist.latitude, therapist.longitude], 15);
    }
    // Optional: Scroll map into view on mobile
    if (window.innerWidth < 1024) {
       mapRef.current._container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      // FIX: 'h-auto' allows scrolling on mobile, 'lg:h-full' locks it on desktop
      className="flex flex-col h-auto lg:h-full" 
    >
      
      {/* HEADER SECTION */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {mode === 'map' ? 'Find Nearby Help' : 'Online Consultation'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
             {mode === 'map' ? 'Locate physical clinics near you.' : 'Connect instantly via video.'}
          </p>
        </div>
        
        {/* TOGGLE BUTTONS */}
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
      {/* FIX: lg:min-h-0 ensures grid doesn't overflow on desktop */}
      <div className="flex-1 relative lg:min-h-0">
        <AnimatePresence mode='wait'>
            
            {/* VIEW 1: MAP MODE */}
            {mode === 'map' ? (
                <motion.div 
                    key="map"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    // FIX: Flex-col for mobile (stacked), Grid for Desktop (side-by-side)
                    className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:h-full"
                >
                     
                     {/* LIST SECTION */}
                     {/* FIX: Order-2 puts it below the map on mobile */}
                     <div className="flex flex-col order-2 lg:order-1 lg:col-span-1 h-full">
                        <form onSubmit={handleSearch} className="flex items-center mb-4 bg-[var(--color-surface)] p-2 rounded-lg shadow-sm shrink-0">
                          <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            placeholder="Search..." 
                            className="w-full p-2 border-none outline-none bg-transparent text-white placeholder-gray-500" 
                          />
                          <button 
                            type="submit" 
                            className="btn px-4 py-2 bg-[rgb(var(--color-primary-rgb))] text-[var(--color-on-primary)] rounded shadow-lg"
                          >
                            Search
                          </button>
                        </form>
                        
                        {/* List Container */}
                        {/* FIX: Fixed height on mobile (h-96) to allow internal scrolling, auto-fill on desktop */}
                        <div className="h-96 lg:h-full overflow-y-auto pr-2 custom-scrollbar bg-black/20 p-2 rounded-xl border border-gray-700">
                          {loading ? <div className="text-center pt-10"><FaSpinner className="animate-spin text-white inline-block text-2xl" /></div> : (
                            <ul className="space-y-3">
                              {therapists.map(therapist => (
                                <motion.li
                                  key={therapist.id}
                                  onClick={() => handleTherapistSelect(therapist)}
                                  whileHover={{ scale: 1.02 }}
                                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${activeTherapist?.id === therapist.id ? 'bg-black/40 border-blue-500 shadow-lg' : 'bg-[var(--color-surface)] border-transparent hover:border-gray-500'}`}
                                >
                                  <h4 className="font-semibold text-white">{therapist.name}</h4>
                                  <p className="text-sm text-[var(--color-text-muted)] flex items-center mt-1">
                                    <LocationIcon /> {therapist.address}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-3">
                                    <a href={`tel:${therapist.phone}`} className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700">
                                      <CallIcon /> Call
                                    </a>
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${therapist.latitude},${therapist.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600">
                                      <RouteIcon /> Route
                                    </a>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          )}
                          {!loading && therapists.length === 0 && (
                             <p className="text-center text-gray-400 mt-10">No results found.</p>
                          )}
                        </div>
                     </div>

                     {/* MAP SECTION */}
                     {/* FIX: Order-1 puts map ON TOP on mobile. Fixed height (h-80) on mobile. */}
                     <div className="order-1 lg:order-2 lg:col-span-2 h-80 lg:h-full rounded-xl overflow-hidden shadow-lg bg-gray-500 relative z-0">
                        {location ? (
                          <MapContainer 
                            ref={mapRef} 
                            center={[location.lat, location.lng]} 
                            zoom={13} 
                            scrollWheelZoom={false} 
                            style={{ height: '100%', width: '100%' }}
                            // Optional: Disable drag on mobile to prevent "scroll trapping"
                            dragging={!L.Browser.mobile} 
                          >
                            <TileLayer
                              attribution='© OpenStreetMap'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {therapists.map(therapist => (
                              <Marker key={therapist.id} position={[therapist.latitude, therapist.longitude]}>
                                <Popup>
                                  <b>{therapist.name}</b><br />{therapist.address}
                                </Popup>
                              </Marker>
                            ))}
                          </MapContainer>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                             <FaSpinner className="animate-spin text-white text-3xl" />
                          </div>
                        )}
                     </div>

                </motion.div>
            ) : (
                /* VIEW 2: VIDEO MODE */
                <TeleTherapy onBack={() => setMode('map')} />
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Therapists;