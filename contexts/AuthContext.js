'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const user = await AuthService.login(username, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('AuthContext - Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
      // Propagar el error completo para que se pueda manejar en los componentes
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      console.error('Error en AuthContext.register:', error);
      // Preservamos toda la información del error original
      setError(error.message);
      // Propagar el error con todos sus detalles para el componente
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const getUserProfile = async () => {
    try {
      setError(null);
      const userProfile = await AuthService.getUserProfile();
      return userProfile;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setError(null);
      console.log('AuthContext: Actualizando perfil de usuario', userData);
      const updatedProfile = await AuthService.updateUserProfile(userData);
      console.log('AuthContext: Perfil actualizado', updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('AuthContext: Error al actualizar perfil', error);
      // Conservamos los errores de validación si existen
      setError(error.message);
      throw error; // Mantenemos los detalles del error para el componente
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    getUserProfile,
    updateUserProfile,
    error,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
