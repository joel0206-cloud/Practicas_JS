const { contextBridge } = require('electron');

const BASE_URL = 'http://localhost:3000';

/* ================================
   FUNCIÓN GENÉRICA FETCH
================================ */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    // Validar errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${errorText}`
      );
    }

    // Si no hay contenido
    if (response.status === 204) return null;

    return await response.json();

  } catch (error) {
    console.error('API ERROR:', error);
    throw error;
  }
}

/* ================================
   EXPONER API AL RENDERER
================================ */
contextBridge.exposeInMainWorld('educacionApp', {

  /* ---------- TUTORES ---------- */

  getTutores: () =>
    apiRequest('/api/tutores'),

  createTutor: (data) =>
    apiRequest('/api/tutores', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteTutor: (id) =>
    apiRequest(`/api/tutores/${id}`, {
      method: 'DELETE'
    }),

  updateTutor: (id, data) =>
    apiRequest(`/api/tutores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /* ---------- ESTUDIANTES ---------- */

  getEstudiantes: () =>
    apiRequest('/api/estudiantes'),

  createEstudiante: (data) =>
    apiRequest('/api/estudiantes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateEstudiante: (id, data) =>
    apiRequest(`/api/estudiantes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteEstudiante: (id) =>
    apiRequest(`/api/estudiantes/${id}`, {
      method: 'DELETE'
    }),

  /* ---------- NOTIFICACIONES ---------- */

  showNotification: (message) => {
    if (Notification.isSupported()) {
      new Notification('📚 Plataforma Educativa', {
        body: message
      });
    } else {
      console.warn('Notificaciones no soportadas');
    }
  }

});



