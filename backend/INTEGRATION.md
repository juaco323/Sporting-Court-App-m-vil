# Guía de Integración Frontend-Backend

Esta guía te ayudará a conectar el frontend existente con el nuevo backend de FastAPI.

## 📋 Índice
1. [Preparación](#preparación)
2. [Autenticación](#autenticación)
3. [Integración de Endpoints](#integración-de-endpoints)
4. [Manejo de Errores](#manejo-de-errores)
5. [Ejemplo Completo](#ejemplo-completo)

## Preparación

### 1. Iniciar el Backend

```powershell
cd backend
.\start.ps1
```

El backend estará en http://localhost:8000

### 2. Configurar el Frontend

El frontend debe comunicarse con el backend en lugar de usar datos mock locales.

## Autenticación

### Crear un módulo de autenticación

Crea o actualiza `src/services/auth.js`:

```javascript
const API_URL = 'http://localhost:8000';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Registrar usuario
    async register(email, password, fullName) {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                full_name: fullName
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error en el registro');
        }

        return response.json();
    }

    // Login
    async login(email, password) {
        const response = await fetch(`${API_URL}/api/v1/auth/login/json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Credenciales inválidas');
        }

        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('token', this.token);
        return data;
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.token;
    }

    // Obtener headers con autenticación
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Obtener perfil del usuario
    async getProfile() {
        const response = await fetch(`${API_URL}/api/v1/users/me`, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
                throw new Error('Sesión expirada');
            }
            throw new Error('Error al obtener perfil');
        }

        return response.json();
    }
}

// Exportar instancia singleton
const authService = new AuthService();
export default authService;
```

## Integración de Endpoints

### Actualizar el servicio de API

Actualiza `src/services/api.js` para usar el backend real:

```javascript
import authService from './auth.js';

const API_URL = 'http://localhost:8000';

const ApiService = {
    // ===== CANCHAS =====
    
    async getCourts(sport = null) {
        const url = sport 
            ? `${API_URL}/api/v1/courts?sport=${encodeURIComponent(sport)}`
            : `${API_URL}/api/v1/courts`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar canchas');
        return response.json();
    },

    async getCourt(courtId) {
        const response = await fetch(`${API_URL}/api/v1/courts/${courtId}`);
        if (!response.ok) throw new Error('Cancha no encontrada');
        return response.json();
    },

    // ===== RESERVAS =====
    
    async createReservation(reservationData) {
        const response = await fetch(`${API_URL}/api/v1/reservations`, {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(reservationData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear reserva');
        }

        return response.json();
    },

    async getMyReservations() {
        const response = await fetch(`${API_URL}/api/v1/reservations`, {
            headers: authService.getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                authService.logout();
                throw new Error('Sesión expirada');
            }
            throw new Error('Error al cargar reservas');
        }

        return response.json();
    },

    async getReservation(reservationId) {
        const response = await fetch(`${API_URL}/api/v1/reservations/${reservationId}`, {
            headers: authService.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Reserva no encontrada');
        return response.json();
    },

    async updateReservation(reservationId, updateData) {
        const response = await fetch(`${API_URL}/api/v1/reservations/${reservationId}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al actualizar reserva');
        }

        return response.json();
    },

    async cancelReservation(reservationId) {
        const response = await fetch(`${API_URL}/api/v1/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: authService.getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al cancelar reserva');
        }

        return response.json();
    },

    // ===== CLIMA (mantener si se usa) =====
    
    async fetchWeather(lat, lon, apiKey, options = {}) {
        const { units = 'metric', lang = 'es' } = options;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener el clima');
        return response.json();
    }
};

// Exportar para uso global
window.ApiService = ApiService;
export default ApiService;
```

## Manejo de Errores

### Crear un manejador de errores centralizado

```javascript
// src/utils/errorHandler.js

export function handleApiError(error) {
    console.error('Error de API:', error);

    if (error.message === 'Sesión expirada') {
        // Redirigir al login
        showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
        setTimeout(() => {
            window.location.hash = '#auth';
        }, 2000);
        return;
    }

    if (error.message.includes('fetch')) {
        showNotification('No se pudo conectar con el servidor. Verifica tu conexión.', 'error');
        return;
    }

    showNotification(error.message || 'Ha ocurrido un error', 'error');
}

function showNotification(message, type = 'info') {
    // Implementa tu sistema de notificaciones aquí
    alert(message); // Reemplazar con tu sistema de notificaciones
}
```

## Ejemplo Completo

### Integración en app.js

```javascript
// En app.js, actualiza las funciones para usar el API real

// ===== LOGIN =====
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        showLoadingState('login-btn', true);
        
        // Usar el servicio de autenticación
        await authService.login(email, password);
        
        // Obtener perfil del usuario
        const user = await authService.getProfile();
        
        // Actualizar estado global
        appState.user = user;
        appState.currentView = 'dashboard';
        
        showNotification('¡Bienvenido!', 'success');
        renderApp();
        
    } catch (error) {
        handleApiError(error);
    } finally {
        showLoadingState('login-btn', false);
    }
}

// ===== REGISTRO =====
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const fullName = document.getElementById('register-name').value;
    
    try {
        showLoadingState('register-btn', true);
        
        // Registrar usuario
        await authService.register(email, password, fullName);
        
        // Auto-login después del registro
        await authService.login(email, password);
        
        // Obtener perfil
        const user = await authService.getProfile();
        appState.user = user;
        appState.currentView = 'dashboard';
        
        showNotification('¡Registro exitoso!', 'success');
        renderApp();
        
    } catch (error) {
        handleApiError(error);
    } finally {
        showLoadingState('register-btn', false);
    }
}

// ===== CREAR RESERVA =====
async function createReservation() {
    try {
        showLoadingState('confirm-reservation-btn', true);
        
        const reservationData = {
            court_id: appState.selectedCourt.id,
            date: appState.selectedDate,
            time: appState.selectedTime,
            duration: 1, // o lo que el usuario seleccione
            notes: 'Reserva desde la aplicación web'
        };
        
        const reservation = await ApiService.createReservation(reservationData);
        
        // Actualizar estado
        appState.reservations.push(reservation);
        appState.currentView = 'confirmation';
        
        showNotification('¡Reserva creada exitosamente!', 'success');
        renderApp();
        
    } catch (error) {
        handleApiError(error);
    } finally {
        showLoadingState('confirm-reservation-btn', false);
    }
}

// ===== CARGAR CANCHAS =====
async function loadCourts(sport) {
    try {
        showLoadingState('courts-container', true);
        
        const courts = await ApiService.getCourts(sport);
        
        // Renderizar canchas
        renderCourts(courts);
        
    } catch (error) {
        handleApiError(error);
    } finally {
        showLoadingState('courts-container', false);
    }
}

// ===== CARGAR MIS RESERVAS =====
async function loadMyReservations() {
    try {
        showLoadingState('reservations-list', true);
        
        const reservations = await ApiService.getMyReservations();
        
        appState.reservations = reservations;
        renderReservations(reservations);
        
    } catch (error) {
        handleApiError(error);
    } finally {
        showLoadingState('reservations-list', false);
    }
}

// ===== CANCELAR RESERVA =====
async function cancelReservation(reservationId) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        return;
    }
    
    try {
        await ApiService.cancelReservation(reservationId);
        
        // Actualizar lista de reservas
        appState.reservations = appState.reservations.filter(
            r => r.id !== reservationId
        );
        
        showNotification('Reserva cancelada exitosamente', 'success');
        renderApp();
        
    } catch (error) {
        handleApiError(error);
    }
}

// ===== UTILIDADES =====
function showLoadingState(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        element.classList.add('loading');
        element.innerHTML = '<span>Cargando...</span>';
    } else {
        element.disabled = false;
        element.classList.remove('loading');
    }
}
```

## Consideraciones Importantes

### 1. CORS
El backend ya está configurado para aceptar peticiones desde:
- `http://localhost:8080`
- `http://127.0.0.1:8080`
- `http://localhost:8081`

### 2. Tokens JWT
Los tokens expiran en 30 minutos. El frontend debe:
- Guardar el token en localStorage
- Incluirlo en todas las peticiones autenticadas
- Manejar errores 401 (sesión expirada)

### 3. Formato de Datos

#### Fechas
```javascript
// Backend espera: "YYYY-MM-DD"
const date = "2025-11-15";
```

#### Horas
```javascript
// Backend espera: "HH:MM"
const time = "15:00";
```

#### Canchas
```javascript
// El backend devuelve:
{
    id: 1,              // ID numérico (usar este para reservas)
    court_id: "CAN-01", // ID de texto
    name: "Cancha Central #1",
    sport: "Fútbol",
    // ...
}
```

## Testing

### Probar la integración

1. **Iniciar el backend**:
```powershell
cd backend
uvicorn main:app --reload
```

2. **Probar la API**:
```powershell
cd backend
python test_api.py
```

3. **Iniciar el frontend**:
```powershell
npm run dev
```

4. **Probar el flujo completo**:
   - Registrar un usuario
   - Hacer login
   - Ver canchas
   - Crear una reserva
   - Ver mis reservas
   - Cancelar una reserva

## Recursos Adicionales

- **Swagger UI**: http://localhost:8000/docs (documentación interactiva)
- **ReDoc**: http://localhost:8000/redoc (documentación alternativa)
- **Backend README**: [backend/README.md](backend/README.md)

---

¿Necesitas ayuda? Revisa los logs del backend y usa las herramientas de desarrollo del navegador (F12) para ver las peticiones HTTP.
