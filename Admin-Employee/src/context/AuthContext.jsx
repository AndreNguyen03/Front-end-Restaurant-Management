import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Configure axios to send cookies with every request
        axios.defaults.withCredentials = true;
        
        // Make a request to validate the session
        const response = await axios.get('http://localhost:3056/api/eAuth/checkAuth');
        
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setRole(response.data.role);
        } else {
          // If not authenticated, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Only check authentication if the user is not on the login page
    if (location.pathname !== '/login') {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [navigate, location.pathname]);

  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    //localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    //localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);