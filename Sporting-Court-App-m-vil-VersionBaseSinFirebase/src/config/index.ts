const API_BASE_URL = "http://54.226.21.206:8080/api/v1";

export const config = {
  API_BASE_URL,

  // Endpoints de autenticación
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FIREBASE_LOGIN: `${API_BASE_URL}/auth/firebase/login`,
    FIREBASE_REGISTER: `${API_BASE_URL}/auth/firebase/register`,
  },

  // Configuración OAuth Google
  GOOGLE_OAUTH: {
    webClientId: "616387990630-5lrkiap1lp8ief1tqluvaui3tq31nesh.apps.googleusercontent.com",
    androidClientId: "616387990630-815vi6mfq405mepfqk1slll19ai5tulu.apps.googleusercontent.com",
    iosClientId: "616387990630-5lrkiap1lp8ief1tqluvaui3tq31nesh.apps.googleusercontent.com", // Usamos el web por defecto si no hay iOS específico
  },

  // Endpoints de canchas
  COURTS: {
    LIST: `${API_BASE_URL}/courts`,
    DETAIL: (id: number) => `${API_BASE_URL}/courts/${id}`,
  },

  // Endpoints de reservas
  BOOKINGS: {
    CREATE: `${API_BASE_URL}/bookings`,
    LIST: `${API_BASE_URL}/bookings`,
    DETAIL: (id: number) => `${API_BASE_URL}/bookings/${id}`,
    CANCEL: (id: number) => `${API_BASE_URL}/bookings/${id}/cancel`,
  },
};
