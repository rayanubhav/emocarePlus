import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate(); // We still need this for 'Create Account'

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      
      // Set 'hasSeenGetStarted' on successful login/register
      localStorage.setItem('hasSeenGetStarted', 'true');
      
      // --- NAVIGATION REMOVED ---
      // The `App.jsx` component will now handle this automatically
      // when the `token` state changes.

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-8">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-white">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        <form onSubmit={submitForm} className="mt-8 space-y-6">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10"
              />
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10"
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10"
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </div>

          {error && <p className="text-center text-[var(--color-error)]">{error}</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-center text-[var(--color-primary)] hover:underline"
        >
          {isLogin ? 'Create an account' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;