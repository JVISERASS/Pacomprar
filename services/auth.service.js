const API_URL = "https://das-p2-backend.onrender.com/api/users/";

const login = async (username, password) => {
  try {
    // Asegurarnos de que la URL tiene la barra final
    const loginUrl = `${API_URL}login/`;
    console.log('Intentando login en:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Asegurarnos de que enviamos los datos exactos que espera la API
      body: JSON.stringify({ username, password }),
    });

    // Primero obtenemos el texto de la respuesta para diagnóstico
    const responseText = await response.text();
    console.log('Respuesta del servidor:', responseText);

    // Si la respuesta parece HTML, es un error especial
    if (responseText.trim().startsWith('<!DOCTYPE')) {
      throw new Error('El servidor devolvió HTML en lugar de JSON. Comprueba la URL y la conexión.');
    }

    // Si no hay respuesta, lanzar error
    if (!responseText.trim()) {
      throw new Error('El servidor devolvió una respuesta vacía');
    }

    // Intentar parsear como JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      console.error('Texto recibido:', responseText);
      throw new Error('La respuesta del servidor no es JSON válido');
    }

    // Si la respuesta no fue ok, lanzar un error con el detalle
    if (!response.ok) {
      // Si los datos de error tienen un formato específico, procesarlos
      if (data && typeof data === 'object') {
        // Crear un error personalizado con los mensajes de validación
        const error = new Error('Error al iniciar sesión');
        error.validationErrors = data; // Guardamos el objeto completo de errores
        error.statusCode = response.status;
        throw error;
      } else {
        throw new Error(data.detail || 'Error al iniciar sesión');
      }
    }

    // Verificar que tenemos los datos esperados
    if (!data.access) {
      throw new Error('La respuesta del servidor no contiene un token de acceso');
    }

    // Guardar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify({
      username: data.username || username,
      access: data.access
    }));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Obtener el texto de la respuesta para diagnóstico
    const responseText = await response.text();
    console.log('Respuesta cruda del servidor (registro):', responseText);
    
    // Si la respuesta no es OK, procesamos el error
    if (!response.ok) {
      // Intentamos parsear como JSON para extraer mensajes de error específicos
      try {
        const errorData = JSON.parse(responseText);
        console.log('Datos de error de API:', errorData);
        
        // Crear un error personalizado con los mensajes de validación
        const error = new Error('Error en el registro');
        error.validationErrors = errorData; // Guardamos el objeto completo de errores
        error.statusCode = response.status;
        throw error;
      } catch (parseError) {
        // Si no podemos parsear como JSON, usamos el texto de respuesta directamente
        if (responseText && responseText.trim()) {
          throw new Error('Error en el registro. Por favor, inténtalo de nuevo.');
        } else {
          throw new Error(`Error en el registro (código ${response.status})`);
        }
      }
    }

    // Parsear respuesta exitosa
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Error al procesar la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error detallado en el registro:', error);
    throw error;
  }
};

// Actualizamos también la función de actualización de perfil para ser consistente
const updateUserProfile = async (userData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.access) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Actualizando perfil con datos:', userData);
    
    const response = await fetch(`${API_URL}profile/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access}`,
      },
      body: JSON.stringify(userData),
    });

    // Obtener el texto de respuesta para diagnóstico
    const responseText = await response.text();
    console.log('Respuesta del servidor en actualización:', responseText);
    
    // Manejar errores
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        logout();
        throw new Error('Sesión expirada, por favor inicie sesión nuevamente');
      }
      
      // Intentar parsear como JSON para extraer mensajes de error específicos
      try {
        const errorData = JSON.parse(responseText);
        console.log('Datos de error de API:', errorData);
        
        // Crear un error personalizado con los mensajes de validación
        const error = new Error('Error al actualizar perfil');
        error.validationErrors = errorData;
        error.statusCode = response.status;
        throw error;
      } catch (parseError) {
        // Si no podemos parsear como JSON, usamos el texto de respuesta directamente
        if (responseText && responseText.trim()) {
          throw new Error('Error al actualizar perfil. Por favor, inténtalo de nuevo.');
        } else {
          throw new Error(`Error al actualizar perfil (código ${response.status})`);
        }
      }
    }

    // Parsear la respuesta exitosa
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Error al procesar la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error detallado en updateUserProfile:', error);
    throw error;
  }
};

const getUserProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.access) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}profile/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access}`,
      },
    });

    // Obtener el texto de la respuesta para diagnóstico
    const responseText = await response.text();
    console.log('Respuesta del servidor (perfil):', responseText);

    // Si la respuesta no es OK, procesamos el error
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        logout();
        throw new Error('Sesión expirada, por favor inicie sesión nuevamente');
      }

      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.detail || errorData.message || 'Error al obtener perfil');
      } catch (parseError) {
        throw new Error('Error al obtener perfil');
      }
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Error al procesar la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  logout,
  getCurrentUser,
};

export default AuthService;
