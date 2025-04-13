'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('pacomprarUser') || 'null');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const login = async (username, password) => {
    const credentials = {
      username: username,
      password: password
    };
    
    const response = await fetch('https://pacomprarserver.onrender.com/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const user = await response.json();
    localStorage.setItem('pacomprarUser', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('pacomprarUser') || '{}');
      const token = currentUser?.access || '';
      const refreshToken = currentUser?.refresh || '';

      if (token && refreshToken) {
        try {
          await fetch('https://pacomprarserver.onrender.com/api/usuarios/log-out/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              refresh: refreshToken
            })
          });
        } catch (apiError) {
          console.log('API logout call failed, but continuing with local logout');
        }
      }
    } finally {
      localStorage.removeItem('pacomprarUser');
      setCurrentUser(null);
    }
  };

  // Add getUserProfile function
  const getUserProfile = async () => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch('https://pacomprarserver.onrender.com/api/usuarios/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesión expirada o inválida');
        }
        throw new Error('Error al obtener el perfil de usuario');
      }
      
      return await response.json();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  // Add updateUserProfile function
  const updateUserProfile = async (userData) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch('https://pacomprarserver.onrender.com/api/usuarios/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      
      return await response.json();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      logout, 
      getUserProfile, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
