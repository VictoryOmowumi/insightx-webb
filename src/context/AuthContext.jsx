import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '@/utils/baseUrl';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode the token and set the user
  const decodeAndSetUser = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken); // Set the decoded user information
      localStorage.setItem('user', JSON.stringify(decodedToken));
      localStorage.setItem('token', token); // Store the token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Axios headers
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // Add Axios response interceptor to handle 401 and 403 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;

        if (response) {
          const { status } = response;

          if (status === 401 || status === 403) {
            // Store the current page URL before redirecting to login
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem('redirectPath', currentPath);

            // Redirect to login page
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      decodeAndSetUser(token);
    } else {
      // Check for token in URL (Google OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        decodeAndSetUser(tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname); // Clean the URL
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${baseUrl}auth/login`, credentials);
      const { token } = response.data;
      decodeAndSetUser(token);

      // Redirect to the stored path or home page
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath'); // Clear the stored path
      window.location.href = redirectPath;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);