# UNAB Sporting Court - Backend FastAPI

Backend completo desarrollado con FastAPI para el sistema de gestión de canchas deportivas.

## 🚀 Características

- ✅ **Autenticación JWT**: Sistema completo de login y registro
- ✅ **Encriptación bcrypt**: Contraseñas seguras
- ✅ **Documentación automática**: Swagger UI y ReDoc
- ✅ **Base de datos SQLAlchemy**: Con SQLite por defecto
- ✅ **CRUD completo**: Usuarios, canchas y reservas
- ✅ **Sistema de roles**: Usuarios normales y administradores

## 📋 Requisitos

- Python 3.8+
- pip

## 🔧 Instalación

### 1. Crear entorno virtual (recomendado)

```powershell
# En el directorio backend
python -m venv venv

# Activar el entorno virtual
.\venv\Scripts\Activate.ps1
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```powershell
# Copiar el archivo de ejemplo
copy .env.example .env
```

Edita el archivo `.env` y cambia el `SECRET_KEY`:

```env
SECRET_KEY=tu-clave-secreta-super-segura-aqui
```

Para generar una clave segura:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Inicializar la base de datos

```powershell
python init_db.py
```

Este script creará:
- Las tablas necesarias
- Un usuario administrador: `admin@unab.cl` / `admin123`
- Un usuario de prueba: `usuario@unab.cl` / `usuario123`
- Canchas de ejemplo (Fútbol, Tenis, Pádel)

## 🚀 Ejecutar el servidor

### Modo desarrollo (con recarga automática)

```powershell
uvicorn main:app --reload
```

### Modo producción

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 📖 Documentación

Una vez iniciado el servidor:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Autenticación

### 1. Registro de usuario

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "micontraseña123",
  "full_name": "Juan Pérez"
}
```

### 2. Login

```bash
POST /api/v1/auth/login/json
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "micontraseña123"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Usar el token

Incluye el token en el header `Authorization` de tus peticiones:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📍 Endpoints principales

### Autenticación
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Login (form-data)
- `POST /api/v1/auth/login/json` - Login (JSON)

### Usuarios
- `GET /api/v1/users/me` - Obtener perfil del usuario actual 🔒
- `GET /api/v1/users` - Listar usuarios (admin) 🔒👑

### Canchas
- `GET /api/v1/courts` - Listar canchas
- `GET /api/v1/courts/{id}` - Obtener cancha específica
- `POST /api/v1/courts` - Crear cancha (admin) 🔒👑

### Reservas
- `POST /api/v1/reservations` - Crear reserva 🔒
- `GET /api/v1/reservations` - Mis reservas 🔒
- `GET /api/v1/reservations/all` - Todas las reservas (admin) 🔒👑
- `GET /api/v1/reservations/{id}` - Obtener reserva 🔒
- `PUT /api/v1/reservations/{id}` - Actualizar reserva 🔒
- `DELETE /api/v1/reservations/{id}` - Cancelar reserva 🔒

### Estadísticas
- `GET /api/v1/stats` - Estadísticas del sistema (admin) 🔒👑

🔒 = Requiere autenticación  
👑 = Requiere rol de administrador

## 🗄️ Estructura de la base de datos

### User
- `id`: Integer (PK)
- `email`: String (Unique)
- `hashed_password`: String
- `full_name`: String
- `is_active`: Boolean
- `is_admin`: Boolean
- `created_at`: DateTime
- `updated_at`: DateTime

### Court
- `id`: Integer (PK)
- `court_id`: String (Unique)
- `name`: String
- `sport`: String
- `description`: Text
- `capacity`: Integer
- `rating`: Float
- `price_per_hour`: Integer
- `features`: Text (JSON)
- `is_active`: Boolean
- `created_at`: DateTime

### Reservation
- `id`: Integer (PK)
- `user_id`: Integer (FK)
- `court_id`: Integer (FK)
- `date`: String (YYYY-MM-DD)
- `time`: String (HH:MM)
- `duration`: Integer
- `total_price`: Integer
- `status`: String
- `notes`: Text
- `created_at`: DateTime
- `updated_at`: DateTime

## 🧪 Probar la API

### Con curl

```powershell
# Registrar usuario
curl -X POST "http://localhost:8000/api/v1/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"test@unab.cl\",\"password\":\"test123\",\"full_name\":\"Test User\"}"

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login/json" -H "Content-Type: application/json" -d "{\"email\":\"test@unab.cl\",\"password\":\"test123\"}"

# Listar canchas
curl "http://localhost:8000/api/v1/courts"

# Crear reserva (necesitas el token)
curl -X POST "http://localhost:8000/api/v1/reservations" -H "Authorization: Bearer TU_TOKEN_AQUI" -H "Content-Type: application/json" -d "{\"court_id\":1,\"date\":\"2025-11-15\",\"time\":\"15:00\",\"duration\":2}"
```

### Con Python

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login/json",
    json={"email": "usuario@unab.cl", "password": "usuario123"}
)
token = response.json()["access_token"]

# Headers con autenticación
headers = {"Authorization": f"Bearer {token}"}

# Crear reserva
response = requests.post(
    "http://localhost:8000/api/v1/reservations",
    headers=headers,
    json={
        "court_id": 1,
        "date": "2025-11-15",
        "time": "15:00",
        "duration": 2
    }
)
print(response.json())
```

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con **bcrypt**
- ✅ Tokens **JWT** con expiración (30 minutos por defecto)
- ✅ Validación de datos con **Pydantic**
- ✅ CORS configurado
- ✅ Inyección de dependencias para autenticación

## 🐳 Docker (Opcional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Construir y ejecutar:

```powershell
docker build -t unab-sporting-court-api .
docker run -p 8000:8000 unab-sporting-court-api
```

## 📝 Notas de desarrollo

- La base de datos SQLite se crea en `sporting_court.db`
- Los tokens JWT expiran en 30 minutos
- Las contraseñas se encriptan con bcrypt (factor 12)
- CORS está configurado para desarrollo (permite todos los orígenes)

## 🤝 Integración con el Frontend

El frontend debe:

1. Hacer login y guardar el token
2. Incluir el token en todas las peticiones autenticadas
3. Manejar la expiración del token (401)
4. Actualizar las llamadas a la API para usar los endpoints del backend

Ejemplo de integración en JavaScript:

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/login/json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
};

// Hacer petición autenticada
const getMyReservations = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/v1/reservations', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

## 📞 Soporte

Para problemas o preguntas sobre la API, revisa:
- Documentación en `/docs`
- Logs del servidor
- Mensajes de error detallados

---

**Desarrollado con ❤️ para UNAB Sporting Court**
