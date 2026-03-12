import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_URL });

// Initialize socket (but don't connect yet)
const socket = io(API_URL, { autoConnect: false });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [role, setRole] = useState(localStorage.getItem('user_role') || null);
  const [isLoading, setIsLoading] = useState(true);
  // Flag: true when a brand-new user hasn't chosen a role yet
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  // Temporarily hold login data while awaiting role selection
  const [pendingAuth, setPendingAuth] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const localUser = localStorage.getItem('user');
          const savedRole = localStorage.getItem('user_role');
          const userData = localUser ? JSON.parse(localUser) : { name: 'User', role: savedRole || 'user' };

          // Ensure role is always in sync
          const resolvedRole = savedRole || userData.role || 'user';
          setUser({ ...userData, role: resolvedRole });
          setRole(resolvedRole);

          // Connect socket on load if token exists
          socket.connect();
          if (resolvedRole === 'therapist') {
            socket.emit('join_therapist_room');
          }
        } catch (error) {
          logout();
        }
      }
      setTimeout(() => setIsLoading(false), 2000);
    };
    initAuth();
  }, [token]);

  const loginSuccess = (access_token, userData) => {
    const userRole = userData.role || 'user';
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify({ ...userData, role: userRole }));
    localStorage.setItem('user_role', userRole);
    setToken(access_token);
    setUser({ ...userData, role: userRole });
    setRole(userRole);

    // Connect socket on login
    socket.connect();
    if (userRole === 'therapist') {
      socket.emit('join_therapist_room');
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const userData = response.data.user;

    // If backend signals this is a new user without a role, trigger selection
    if (userData.is_new && !userData.role) {
      setPendingAuth({ access_token: response.data.access_token, user: userData });
      setNeedsRoleSelection(true);
      return { needsRole: true };
    }

    loginSuccess(response.data.access_token, userData);
    return { needsRole: false, role: userData.role };
  };

  const loginWithGoogle = async (googleToken) => {
    const response = await api.post('/api/auth/google', { token: googleToken });
    const userData = response.data.user;

    if (userData.is_new && !userData.role) {
      setPendingAuth({ access_token: response.data.access_token, user: userData });
      setNeedsRoleSelection(true);
      return { needsRole: true };
    }

    loginSuccess(response.data.access_token, userData);
    return { needsRole: false, role: userData.role };
  };

  /** Called after the user picks a role from the Role Selection Modal */
  const confirmRole = async (selectedRole) => {
    if (!pendingAuth) return;
    try {
      // Notify backend of the chosen role
      api.defaults.headers.common['Authorization'] = `Bearer ${pendingAuth.access_token}`;
      await api.post('/api/auth/set-role', { role: selectedRole });
    } catch (err) {
      console.warn('Role set API failed, proceeding with local role:', err);
    }
    const userData = { ...pendingAuth.user, role: selectedRole };
    loginSuccess(pendingAuth.access_token, userData);
    setPendingAuth(null);
    setNeedsRoleSelection(false);
  };

  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    // New registrations always need role selection
    setPendingAuth({ access_token: response.data.access_token, user: response.data.user });
    setNeedsRoleSelection(true);
    return { needsRole: true };
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    setToken(null);
    setUser(null);
    setRole(null);
    setNeedsRoleSelection(false);
    setPendingAuth(null);
  };

  const value = {
    user, token, role, socket, isLoading,
    needsRoleSelection, confirmRole,
    login, loginWithGoogle, register, logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default api;