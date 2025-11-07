import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext'; // Import our centralized API
import { FaSpinner } from 'react-icons/fa';
import { RiMapPinFill, RiPhoneFill, RiRouteFill } from 'react-icons/ri';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix for default Leaflet icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const Therapists = () => {
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
  }, []);

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
  };

  return (
    // --- THIS IS THE FIX (Part 1) ---
    // The h-full and flex-col tell this component to fill the space
    // provided by Layout.jsx
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white">Find a Therapist Nearby</h3>
        <form onSubmit={handleSearch} className="flex items-center mt-2 bg-[var(--color-surface)] p-2 rounded-lg shadow-sm">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search therapists or clinics..." className="w-full p-2 border-none outline-none" />
          <button 
            type="submit" 
            // Hard-coded cyan button
            className="btn px-4 py-2 bg-[rgb(var(--color-primary-rgb))] text-[var(--color-on-primary)] hover:bg-[rgb(var(--color-primary-rgb)/0.9)] focus:ring-[var(--color-primary)] shadow-lg shadow-[rgb(var(--color-primary-rgb)/0.3)]"
          >
            Search
          </button>
        </form>
        {error && <p className="text-orange-400 text-sm mt-2">{error}</p>}
      </div>

      {/* --- THIS IS THE FIX (Part 2) --- */}
      {/* flex-1 and min-h-0 make this grid fill the remaining space */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* The list is now h-full and scrolls internally */}
        <div className="lg:col-span-1 h-full overflow-y-auto pr-2 custom-scrollbar">
          {loading ? <FaSpinner className="animate-spin text-white" /> : (
            <ul className="space-y-3">
              {therapists.map(therapist => (
                <motion.li
                  key={therapist.id}
                  onClick={() => handleTherapistSelect(therapist)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${activeTherapist?.id === therapist.id ? 'bg-black/20 border-[var(--color-primary)] shadow-lg' : 'bg-[var(--color-surface)] border-transparent hover:border-[var(--color-secondary)] hover:shadow-md'}`}
                  whileHover={{ scale: 1.02 }}
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
        </div>
        
        {/* The map is h-full and fixed */}
        <div className="lg:col-span-2 h-full rounded-xl overflow-hidden shadow-lg bg-gray-500">
          {location ? (
            <MapContainer ref={mapRef} center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            <div className="w-full h-full flex items-center justify-center"><FaSpinner className="animate-spin text-white" /></div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Therapists;