(function(global) {
    'use strict';

    // Configuración de la API
    const API_BASE_URL = global.ENV?.API_BASE_URL || 'http://localhost:8000';
    const API_VERSION = '/api/v1';
    
    // Helper para obtener el token JWT del localStorage
    const getAuthToken = () => {
        return localStorage.getItem('auth_token');
    };

    // Helper para configurar headers con autenticación
    const getAuthHeaders = () => {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    // Helper para manejar respuestas de la API
    const handleResponse = async (response) => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
            throw new Error(errorData.detail || `Error ${response.status}`);
        }
        return response.json();
    };

    // API Service con todas las funciones
    const ApiService = {
        // ============================================
        // AUTENTICACIÓN
        // ============================================
        
        /**
         * Registrar un nuevo usuario
         * @param {Object} userData - {email, password, full_name}
         * @returns {Promise<Object>} Usuario creado
         */
        async register(userData) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    full_name: userData.full_name || `${userData.nombre || ''} ${userData.apellido || ''}`.trim()
                })
            });
            return handleResponse(response);
        },

        /**
         * Iniciar sesión
         * @param {string} email - Email del usuario
         * @param {string} password - Contraseña
         * @returns {Promise<Object>} Token de acceso
         */
        async login(email, password) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/auth/login/json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await handleResponse(response);
            
            // Guardar token en localStorage
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
            }
            
            return data;
        },

        /**
         * Cerrar sesión
         */
        logout() {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
        },

        /**
         * Obtener información del usuario actual
         * @returns {Promise<Object>} Usuario actual
         */
        async getCurrentUser() {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/users/me`, {
                headers: getAuthHeaders()
            });
            return handleResponse(response);
        },

        /**
         * Verificar si el usuario está autenticado
         * @returns {boolean}
         */
        isAuthenticated() {
            return !!getAuthToken();
        },

        // ============================================
        // CANCHAS
        // ============================================

        /**
         * Obtener todas las canchas
         * @param {string} sport - Filtrar por deporte (opcional)
         * @returns {Promise<Array>} Lista de canchas
         */
        async getCourts(sport = null) {
            let url = `${API_BASE_URL}${API_VERSION}/courts`;
            if (sport) {
                url += `?sport=${encodeURIComponent(sport)}`;
            }
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            });
            return handleResponse(response);
        },

        /**
         * Obtener una cancha por ID
         * @param {number} courtId - ID de la cancha
         * @returns {Promise<Object>} Datos de la cancha
         */
        async getCourtById(courtId) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/courts/${courtId}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            return handleResponse(response);
        },

        /**
         * Crear una nueva cancha (solo admin)
         * @param {Object} courtData - Datos de la cancha
         * @returns {Promise<Object>} Cancha creada
         */
        async createCourt(courtData) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/courts`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(courtData)
            });
            return handleResponse(response);
        },

        /**
         * Obtener disponibilidad de una cancha (reservas existentes)
         * @param {number} courtId - ID de la cancha
         * @param {string} date - Fecha en formato YYYY-MM-DD (opcional)
         * @returns {Promise<Array>} Lista de reservas de la cancha
         */
        async getCourtAvailability(courtId, date = null) {
            let url = `${API_BASE_URL}${API_VERSION}/courts/${courtId}/availability`;
            if (date) {
                url += `?date=${date}`;
            }
            const response = await fetch(url);
            return handleResponse(response);
        },

        // ============================================
        // RESERVAS
        // ============================================

        /**
         * Crear una nueva reserva
         * @param {Object} reservationData - {court_id, date, time, duration, notes}
         * @returns {Promise<Object>} Reserva creada
         */
        async createReservation(reservationData) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/reservations`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(reservationData)
            });
            return handleResponse(response);
        },

        /**
         * Obtener todas las reservas del usuario actual
         * @returns {Promise<Array>} Lista de reservas
         */
        async getMyReservations() {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/reservations`, {
                headers: getAuthHeaders()
            });
            return handleResponse(response);
        },

        /**
         * Obtener una reserva por ID
         * @param {number} reservationId - ID de la reserva
         * @returns {Promise<Object>} Datos de la reserva
         */
        async getReservationById(reservationId) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/reservations/${reservationId}`, {
                headers: getAuthHeaders()
            });
            return handleResponse(response);
        },

        /**
         * Actualizar una reserva
         * @param {number} reservationId - ID de la reserva
         * @param {Object} updateData - Datos a actualizar
         * @returns {Promise<Object>} Reserva actualizada
         */
        async updateReservation(reservationId, updateData) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/reservations/${reservationId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData)
            });
            return handleResponse(response);
        },

        /**
         * Cancelar una reserva
         * @param {number} reservationId - ID de la reserva
         * @returns {Promise<Object>} Mensaje de confirmación
         */
        async cancelReservation(reservationId) {
            const response = await fetch(`${API_BASE_URL}${API_VERSION}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return handleResponse(response);
        },

        // ============================================
        // UTILIDADES (mantener funcionalidad existente)
        // ============================================

        /**
         * Fetch 5-day/3h forecast from OpenWeatherMap
         */
        async fetchWeather(lat, lon, apiKey, { units = 'metric', lang = 'es' } = {}) {
            if (!apiKey) {
                throw new Error('Falta OPENWEATHER_API_KEY. Defínelo en window.ENV.OPENWEATHER_API_KEY');
            }
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`;
            const resp = await fetch(url);
            if (!resp.ok) {
                const text = await resp.text().catch(() => '');
                throw new Error(`Error al obtener el clima (${resp.status}): ${text}`);
            }
            return resp.json();
        },

        /**
         * LocalStorage helpers para compatibilidad
         */
        loadLocalReservations(key = 'courtReservations') {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : null;
            } catch (_) {
                localStorage.removeItem(key);
                return null;
            }
        },

        saveLocalReservations(reservations, key = 'courtReservations') {
            try {
                localStorage.setItem(key, JSON.stringify(reservations || []));
            } catch (_) {
                // noop
            }
        }
    };

    // Expose
    global.ApiService = ApiService;

    // ENV shim
    global.ENV = global.ENV || {
        OPENWEATHER_API_KEY: '61f6915417ca53ccd95fb615cc7fb019',
        API_BASE_URL: 'http://localhost:8000'
    };
})(window);

