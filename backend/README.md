# Sistema de Reservas de Canchas Deportivas

## Integrantes
- Andrés Calderón 
- Joaquín Fuenzalida 
- Bastián Kramarenko
- Benjamín Vallejos

## Descripción
Este es un sistema completo de reservas de canchas deportivas con frontend en HTML/CSS/JavaScript vanilla y **backend profesional con FastAPI**. El sistema incluye autenticación JWT, encriptación de contraseñas con bcrypt, y documentación automática de la API.

## 🚀 Inicio Rápido

### Backend (FastAPI)
```powershell
cd backend
.\start.ps1
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Frontend
```powershell
npm run dev
```

El frontend estará disponible en http://localhost:8080

📖 **[Ver documentación completa del backend](backend/README.md)**

## Despliegue con apache
Para realizar el despliegue con apache utilizaremos XAMPP, donde luego de instalar este programa debe descargar el archivo comprimido de este Github, descomprimirlo y guardar esta carpeta, posterior a esto abriremos XAMPP donde en su interfaz principal presionaremos el boton de "Explorer" este abrira la ubicacion de los archivos para correr XAMPP, donde nos dirigiremos a la carpeta "htdocs", y copiaremos la carpeta descomprimida de los archivos de la aplicacion web, posterior a esto volveremos al XAMPP y en el apartado de Apache le daremos a "Start" y luego de esperar a que se inicie presionaremos el boton "Admin", este abrira en nuestro buscador la pagina principal de XAMPP. En esta pagina nos dirigiremos a la barra superior de nuestro buscador, editaremos el link y colocaremos "localhost/(nombre de la carpeta)" y le daremos a buscar. Luego de esto, nos deberia dirigir a nuestra pagina ya desplegada.

## 🔐 Backend con FastAPI

### Características del Backend
- ✅ **FastAPI Framework**: API moderna y rápida
- ✅ **Autenticación JWT**: Tokens seguros con expiración
- ✅ **Encriptación bcrypt**: Contraseñas hasheadas de forma segura
- ✅ **Documentación automática**: Swagger UI y ReDoc generados automáticamente
- ✅ **Base de datos SQLAlchemy**: ORM potente con SQLite
- ✅ **Sistema de roles**: Usuarios normales y administradores
- ✅ **CORS configurado**: Integración con el frontend
- ✅ **Validación Pydantic**: Validación automática de datos

### Credenciales de Prueba
Después de ejecutar `init_db.py`:
- **Admin**: `admin@unab.cl` / `admin123`
- **Usuario**: `usuario@unab.cl` / `usuario123`

### Endpoints Principales

#### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Login (form-data)
- `POST /api/v1/auth/login/json` - Login (JSON)

#### Usuarios
- `GET /api/v1/users/me` - Perfil actual 🔒
- `GET /api/v1/users` - Listar usuarios 🔒👑

#### Canchas
- `GET /api/v1/courts` - Listar canchas
- `GET /api/v1/courts/{id}` - Ver cancha
- `POST /api/v1/courts` - Crear cancha 🔒👑

#### Reservas
- `POST /api/v1/reservations` - Crear reserva 🔒
- `GET /api/v1/reservations` - Mis reservas 🔒
- `GET /api/v1/reservations/{id}` - Ver reserva 🔒
- `PUT /api/v1/reservations/{id}` - Actualizar 🔒
- `DELETE /api/v1/reservations/{id}` - Cancelar 🔒

🔒 = Requiere autenticación | 👑 = Requiere admin

### Ejemplo de Uso del API

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login/json",
    json={"email": "usuario@unab.cl", "password": "usuario123"}
)
token = response.json()["access_token"]

# Crear reserva
headers = {"Authorization": f"Bearer {token}"}
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
```
## Funcionalidades

### Autenticación
- **Login**: Acceso con RUT y contraseña
- **Registro**: Creación de cuenta con datos personales
- **Formateo automático de RUT**: Formato chileno (12.345.678-9)
- **Validación de formularios**: Campos obligatorios y validación de email

###  Gestión de Deportes
- **Fútbol**: Canchas de fútbol 11 y fútbol 7
- **Tenis**: Canchas individuales y dobles  
- **Pádel**: Canchas techadas y al aire libre
- **Información detallada**: Capacidad, características, precios y disponibilidad

### Sistema de Reservas
- **Calendario interactivo**: Navegación por meses y selección de fechas
- **Horarios disponibles**: Slots de tiempo con precios
- **Validación de fechas**: Solo fechas futuras y disponibles
- **Confirmación de reserva**: Modal con resumen de detalles

### Gestión de Reservas
- **Mis Reservas**: Lista de reservas actuales
- **Editar reservas**: Cambiar fecha y hora
- **Cancelar reservas**: Con confirmación de seguridad
- **Estados de reserva**: Confirmada/Pendiente

### Confirmación y Seguimiento
- **Página de éxito**: Confirmación visual de la reserva
- **Código de reserva**: Código único para presentar en la cancha
- **Acciones**: Descargar, compartir, ver reservas o hacer nueva reserva
- **Información importante**: Instrucciones para el día de la reserva


## Estructura de Archivos

```
/
├── backend/              # Backend FastAPI
│   ├── main.py          # Aplicación principal
│   ├── auth.py          # Sistema de autenticación JWT
│   ├── models.py        # Modelos de base de datos
│   ├── schemas.py       # Schemas Pydantic
│   ├── database.py      # Configuración de BD
│   ├── init_db.py       # Inicializador de BD
│   ├── requirements.txt # Dependencias Python
│   ├── .env             # Variables de entorno
│   ├── start.ps1        # Script de inicio rápido
│   └── README.md        # Documentación del backend
├── src/
│   ├── components/
│   │   └── vue-app.js   # Componente Vue
│   └── services/
│       └── api.js       # Servicios de API
├── index.html           # Archivo principal HTML
├── styles.css           # Estilos CSS completos
├── app.js              # Lógica JavaScript de la aplicación
├── canchas.json        # Datos estructurados de las canchas
├── reservas.json       # Datos estructurados de las reservas
├── package.json        # Configuración del proyecto
└── README.md           # Este archivo
```

## Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy**: ORM para Python
- **Pydantic**: Validación de datos
- **JWT (python-jose)**: Autenticación con tokens
- **bcrypt (passlib)**: Encriptación de contraseñas
- **Uvicorn**: Servidor ASGI de alto rendimiento

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Lógica de aplicación vanilla sin frameworks
- **Lucide Icons**: Iconografía consistente y moderna

## Características Técnicas

### 🎨 Diseño
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Tema consistente**: Variables CSS para colores y espaciado
- **Componentes reutilizables**: Sistema de clases CSS modular
- **Animaciones suaves**: Transiciones y estados hover

### 🔧 Funcionalidad
- **Estado global**: Gestión centralizada del estado de la aplicación
- **Navegación SPA**: Cambio de vistas sin recarga de página
- **Validaciones**: Formateo automático y validación de datos
- **Persistencia simulada**: Datos mantenidos durante la sesión

### 📱 Experiencia de Usuario
- **Interfaz intuitiva**: Flujo lógico de navegación
- **Feedback visual**: Estados de carga, éxito y error
- **Accesibilidad**: Etiquetas semánticas y navegación por teclado
- **Modales informativos**: Confirmaciones y detalles importantes

## Cómo Usar

### 1. Iniciar la Aplicación
- Abre `index.html` en cualquier navegador moderno
- No requiere servidor web local

### 2. Autenticación
- **Login**: Usa cualquier RUT válido y contraseña
- **Registro**: Completa todos los campos (simulado)

### 3. Reservar una Cancha
1. Selecciona un deporte en el dashboard
2. Elige una cancha disponible
3. Selecciona fecha en el calendario
4. Elige un horario disponible
5. Confirma los detalles de la reserva
6. Recibe tu código de reserva

### 4. Gestionar Reservas
- Ve a "Mis Reservas" en el dashboard
- Edita o cancela reservas existentes
- Visualiza detalles y códigos de reserva

## Datos de Prueba

### Estructura de Canchas (canchas.json)
```json
[
  {"id": "CAN-01", "deporte": "Fútbol", "nombre": "Cancha Central #1"},
  {"id": "CAN-02", "deporte": "Fútbol", "nombre": "Cancha Norte #2"},
  {"id": "CAN-03", "deporte": "Fútbol", "nombre": "Cancha Sur #3"},
  {"id": "CAN-04", "deporte": "Tenis", "nombre": "Pista Tenis #1"},
  {"id": "CAN-05", "deporte": "Tenis", "nombre": "Pista Tenis #2"},
  {"id": "CAN-06", "deporte": "Tenis", "nombre": "Pista Tenis #3"},
  {"id": "CAN-07", "deporte": "Pádel", "nombre": "Pista Pádel #1"},
  {"id": "CAN-08", "deporte": "Pádel", "nombre": "Pista Pádel #2"},
  {"id": "CAN-09", "deporte": "Pádel", "nombre": "Pista Pádel #3"}
]
```

### Estructura de Reservas (reservas.json)
```json
[
  {
    "id": "R001",
    "usuario": "Carlos Díaz",
    "canchaId": "CAN-01",
    "fecha": "2025-09-15",
    "hora": "18:00",
    "estado": "Reservada"
  }
]
```

### Deportes Disponibles
- **Fútbol**: 3 canchas (CAN-01, CAN-02, CAN-03) - 2 disponibles
- **Tenis**: 3 canchas (CAN-04, CAN-05, CAN-06) - todas disponibles  
- **Pádel**: 3 canchas (CAN-07, CAN-08, CAN-09) - 2 disponibles

### Horarios de Ejemplo
- Abierto de 8:00 a 22:00
- Algunos slots ocupados para simular realismo
- Precios variables según cancha y deporte

### Fechas No Disponibles
- Fechas pasadas
- Algunos domingos específicos
- Días 25 y 31 de cada mes (mantenimiento)

## Personalización

### Modificar Deportes
Edita el array `sportsData` en `app.js`:
```javascript
const sportsData = [
    {
        name: 'Nuevo Deporte',
        description: 'Descripción del deporte',
        icon: '🏀',
        available: 5,
        color: 'blue'
    }
];
```

### Añadir Canchas
Modifica el objeto `courtsData` en `app.js`:
```javascript
const courtsData = {
    'Nuevo Deporte': [
        {
            id: 'unique-id',
            name: 'Nombre de la Cancha',
            description: 'Descripción detallada',
            capacity: 10,
            rating: 4.5,
            pricePerHour: 30000,
            features: ['Característica 1', 'Característica 2'],
            available: true
        }
    ]
};
```

### Personalizar Estilos
Modifica las variables CSS en `styles.css`:
```css
:root {
    --primary: #tu-color-primario;
    --secondary: #tu-color-secundario;
    --radius: 0.5rem; /* Cambiar radio de bordes */
}
```

## Compatibilidad
- **Navegadores modernos**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos móviles**: iOS Safari, Chrome Mobile, Samsung Internet
- **Funcionalidades**: ES6+, CSS Grid, Flexbox, CSS Variables

## Limitaciones de la Demo
- **Persistencia**: Los datos se pierden al recargar la página
- **Autenticación**: Simulada, acepta cualquier credencial
- **Pagos**: No integrado, solo simulación de precios
- **Notificaciones**: Alertas básicas del navegador

## Posibles Mejoras Futuras
- ~~Integración con backend real~~ ✅ **¡COMPLETADO!**
- Persistencia en localStorage
- Sistema de pagos online
- Notificaciones push
- Integración con calendario del dispositivo
- Geolocalización de canchas
- Sistema de reviews y comentarios

## 📁 Archivos del Proyecto

### 🔧 Backend (FastAPI)
- `backend/main.py` - Aplicación principal con todos los endpoints
- `backend/auth.py` - Sistema de autenticación JWT + bcrypt
- `backend/models.py` - Modelos de base de datos SQLAlchemy
- `backend/schemas.py` - Validación con Pydantic
- `backend/database.py` - Configuración de base de datos
- `backend/init_db.py` - Script de inicialización con datos de prueba
- `backend/test_api.py` - Suite de pruebas automatizadas
- `backend/requirements.txt` - Dependencias Python
- `backend/.env` - Variables de entorno (configurado)
- `backend/README.md` - Documentación completa del backend

### 📖 Documentación
- `QUICKSTART.md` - ⚡ Comandos rápidos y referencia
- `INSTALL.md` - 🚀 Guía de instalación completa paso a paso
- `INTEGRATION.md` - 🔗 Guía de integración frontend-backend
- `backend/SUMMARY.md` - ✅ Resumen de todo lo implementado

### 🎨 Frontend
- `index.html` - Aplicación principal
- `app.js` - Lógica JavaScript
- `styles.css` - Estilos
- `src/services/api.js` - Servicios de API
- `src/components/vue-app.js` - Componente Vue

## 🚀 Enlaces Rápidos

Una vez que inicies el proyecto:

| Recurso | URL | Descripción |
|---------|-----|-------------|
| 🌐 Frontend | http://localhost:8080 | Aplicación web |
| 🔌 API Backend | http://localhost:8000 | API REST |
| 📖 Swagger UI | http://localhost:8000/docs | Documentación interactiva |
| 📘 ReDoc | http://localhost:8000/redoc | Documentación alternativa |
| ❤️ Health Check | http://localhost:8000/health | Estado del servidor |

## 👥 Contribuciones

Este proyecto fue desarrollado por:
- Andrés Calderón
- Joaquín Fuenzalida
- Bastián Kramarenko
- Benjamín Vallejos

---

**Nota**: Esta es una aplicación completa con frontend vanilla y backend profesional con FastAPI, incluyendo autenticación JWT, encriptación bcrypt, y documentación automática.

**Desarrollado con ❤️ para UNAB Sporting Court**




