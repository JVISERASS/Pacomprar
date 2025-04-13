'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function useAuthFetch() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authFetch = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token directly from currentUser instead of using getAccessToken
      if (!currentUser || !currentUser.access) {
        throw new Error('No hay sesión activa');
      }
      
      const token = currentUser.access;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401) {
        throw new Error('Sesión expirada');
      }
      
      // Check if response is okay
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || 
            (typeof errorData === 'object' ? Object.values(errorData).flat().join(', ') : '') || 
            `Error: ${response.status}`;
        } catch (e) {
          errorMessage = `Error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      // Parse JSON if needed
      if (options.parseJson !== false) {
        try {
          const data = await response.json();
          setLoading(false);
          return data;
        } catch (e) {
          console.warn('Error al procesar respuesta JSON:', e);
          setLoading(false);
          return {}; // Return empty object if JSON parsing fails
        }
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      
      if (error.message === 'Sesión expirada' || error.message === 'No hay sesión activa') {
        alert('Tu sesión ha expirado, por favor inicia sesión nuevamente');
        router.push('/login');
      }
      throw error;
    }
  }, [currentUser, router]);

  return { authFetch, loading, error };
}