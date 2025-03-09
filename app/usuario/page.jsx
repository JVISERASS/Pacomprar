'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

export default function UserProfileEditPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    locality: '',
    municipality: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { currentUser, getUserProfile, updateUserProfile } = useAuth();
  const router = useRouter();

  // Cargar los datos del perfil del usuario al montar el componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const profile = await getUserProfile();
        
        // Formatear la fecha para el input de tipo date
        let formattedDate = '';
        if (profile.birth_date) {
          formattedDate = new Date(profile.birth_date).toISOString().split('T')[0];
        }
        
        // Rellenar el formulario con los datos del perfil
        setFormData({
          username: profile.username || '',
          email: profile.email || '',
          password: '',
          confirmPassword: '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          birth_date: formattedDate,
          locality: profile.locality || '',
          municipality: profile.municipality || ''
        });
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar el perfil. Por favor, inténtalo de nuevo más tarde.');
        
        // Si la sesión expiró, redirigir al login
        if (err.message.includes('Sesión expirada')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, getUserProfile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    if (!password) return true; // Si no hay contraseña, no validamos (no se va a actualizar)
    // Al menos 8 caracteres y contener letras y números
    const regEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regEx.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      
      if (!validatePassword(formData.password)) {
        setError('La contraseña debe tener al menos 8 caracteres y contener letras y números');
        return;
      }
    }
    
    // Preparar datos para actualización
    const updateData = {...formData};
    delete updateData.confirmPassword;
    
    // Si no hay nueva contraseña, no enviarla
    if (!updateData.password) {
      delete updateData.password;
    }
    
    // Asegurarnos que birth_date tiene el formato correcto
    if (updateData.birth_date) {
      const date = new Date(updateData.birth_date);
      if (isNaN(date.getTime())) {
        setError('Fecha de nacimiento inválida');
        return;
      }
      updateData.birth_date = date.toISOString().split('T')[0];
    }

    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      await updateUserProfile(updateData);
      
      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      
      // Comprobar si el error contiene información detallada de validación
      if (err.validationErrors) {
        // Mostrar los errores específicos de la API en un formato más amigable
        const errorMessages = [];
        
        Object.entries(err.validationErrors).forEach(([field, messages]) => {
          const fieldName = getFieldDisplayName(field);
          
          if (Array.isArray(messages)) {
            messages.forEach(message => {
              errorMessages.push(`${fieldName}: ${formatErrorMessage(message)}`);
            });
          } else if (typeof messages === 'string') {
            errorMessages.push(`${fieldName}: ${formatErrorMessage(messages)}`);
          }
        });
        
        setError(errorMessages.join('\n'));
      } else if (err.message && err.message.includes('{')) {
        // Intentar extraer y formatear JSON incluido en el mensaje de error
        try {
          const jsonStart = err.message.indexOf('{');
          const jsonEnd = err.message.lastIndexOf('}') + 1;
          const jsonString = err.message.substring(jsonStart, jsonEnd);
          const errorData = JSON.parse(jsonString);
          
          const errorMessages = [];
          Object.entries(errorData).forEach(([field, messages]) => {
            const fieldName = getFieldDisplayName(field);
            
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                errorMessages.push(`${fieldName}: ${formatErrorMessage(message)}`);
              });
            } else if (typeof messages === 'string') {
              errorMessages.push(`${fieldName}: ${formatErrorMessage(messages)}`);
            }
          });
          
          setError(errorMessages.join('\n'));
        } catch (e) {
          // Si falla el parseo, mostrar mensaje original
          setError(formatErrorMessage(err.message));
        }
      } else {
        setError(formatErrorMessage(err.message) || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setUpdating(false);
    }
  };
  
  // Función para obtener nombre legible de los campos
  const getFieldDisplayName = (field) => {
    const fieldNames = {
      username: 'Nombre de usuario',
      email: 'Email',
      password: 'Contraseña',
      first_name: 'Nombre',
      last_name: 'Apellidos',
      birth_date: 'Fecha de nacimiento',
      locality: 'Localidad',
      municipality: 'Municipio'
    };
    
    return fieldNames[field] || field;
  };
  
  // Función para formatear mensajes de error
  const formatErrorMessage = (message) => {
    // Traducción de mensajes comunes de error
    const translations = {
      'A user with that username already exists.': 'Este nombre de usuario ya está en uso.',
      'This password is too common.': 'Esta contraseña es demasiado común.',
      'This password is too short. It must contain at least 8 characters.': 'La contraseña es demasiado corta. Debe tener al menos 8 caracteres.',
      'Enter a valid email address.': 'Introduce una dirección de email válida.',
      'This field may not be blank.': 'Este campo no puede estar vacío.',
      'Date has wrong format.': 'El formato de fecha es incorrecto. Usa el formato YYYY-MM-DD.',
      'Date has wrong format. Use one of these formats instead: YYYY-MM-DD.': 'El formato de fecha es incorrecto. Usa el formato YYYY-MM-DD.'
    };
    
    return translations[message] || message;
  };

  // Si está cargando, mostrar un mensaje
  if (loading) {
    return <div className={styles.loading}>Cargando información del perfil...</div>;
  }

  return (
    <div className={styles.profileEditContainer}>
      <div className={styles.profileEditBox}>
        <h2 className={styles.title}>Editar Perfil</h2>
        
        {error && (
          <div className={styles.error}>
            {error.split('\n').map((line, index) => (
              <div key={index} className={styles.errorLine}>{line}</div>
            ))}
          </div>
        )}
        {success && <div className={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nombre de usuario*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled // El nombre de usuario no se puede modificar
                className={styles.input}
                title="El nombre de usuario no se puede cambiar"
              />
              <small>El nombre de usuario no se puede modificar</small>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Nueva contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Dejar en blanco para no cambiarla"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirme la nueva contraseña"
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="first_name">Nombre*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="last_name">Apellidos*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="birth_date">Fecha de nacimiento*</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="locality">Localidad*</label>
              <input
                type="text"
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="municipality">Municipio*</label>
              <input
                type="text"
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className={styles.cancelButton}
              disabled={updating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
