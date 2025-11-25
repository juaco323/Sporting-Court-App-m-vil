# UNAB Sporting Court - Mobile App

Aplicación móvil React Native con Expo para el sistema de reservas de canchas deportivas de la Universidad UNAB.

## 🚀 Características

- **Autenticación**: Login, registro y autenticación con Firebase (Google, GitHub)
- **Listado de Canchas**: Navegación y filtrado por deporte
- **Búsqueda**: Buscador en tiempo real
- **Detalles de Cancha**: Información completa con características y precios
- **Reservas**: Sistema completo de reservas con selección de fecha y horario
- **Mis Reservas**: Gestión de reservas personales con opción de cancelación
- **Navegación**: Tab navigation y stack navigation integrados
- **UI Adaptada**: Diseño optimizado para smartphones

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Cuenta en Expo (https://expo.dev)
- Backend corriendo en `http://localhost:8000` o configurar IP

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
cd unab-sporting-mobile
npm install
```

2. **Configurar la URL del backend:**

Editar `src/services/api.ts` y cambiar `API_BASE_URL`:
```typescript
// Para emulador Android
const API_BASE_URL = 'http://10.0.2.2:8000';

// Para dispositivo físico en la misma red
const API_BASE_URL = 'http://TU_IP_LOCAL:8000';  // Ejemplo: http://192.168.1.10:8000
```

3. **Iniciar en modo desarrollo:**
```bash
npx expo start
```

Opciones:
- Presiona `a` para Android
- Presiona `i` para iOS
- Escanea QR con Expo Go app

## 📱 Builds con EAS

### Configuración Inicial

1. **Login en EAS:**
```bash
eas login
```

2. **Configurar proyecto:**
```bash
eas build:configure
```

3. **Actualizar `app.json`:**
- Cambia `YOUR_PROJECT_ID_HERE` por tu ID de proyecto
- Cambia `YOUR_EXPO_USERNAME` por tu usuario de Expo

### Builds de Desarrollo

**Android APK (desarrollo):**
```bash
eas build --profile development --platform android
```

**iOS Simulator:**
```bash
eas build --profile development --platform ios
```

### Builds de Producción

**Android:**
```bash
eas build --profile production --platform android
```

**iOS:**
```bash
eas build --profile production --platform ios
```

### Actualizaciones OTA

Para actualizar sin rebuild:
```bash
eas update --branch production --message "Descripción del cambio"
```

## 🏗️ Estructura del Proyecto

```
src/
├── contexts/          # Context API (Auth)
├── navigation/        # React Navigation setup
├── screens/           # Pantallas de la app
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CourtDetailScreen.tsx
│   ├── BookingScreen.tsx
│   └── ReservationsScreen.tsx
├── services/          # API y Firebase
│   ├── api.ts
│   └── firebase.ts
└── types/             # TypeScript types
```

## 🔑 Credenciales de Prueba

**Backend Local:**
- Email: `admin@unab.cl`
- Password: `admin123`

**O crear cuenta nueva desde la app**

## 🌐 Configuración del Backend

El backend debe estar corriendo y accesible:

1. **Backend local:**
```bash
cd ../unab-sporting-court/backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python init_db.py
python main.py
```

2. **Verificar acceso:**
- Desde computadora: http://localhost:8000
- Desde emulador Android: http://10.0.2.2:8000
- Desde dispositivo físico: http://TU_IP:8000

## 🐛 Troubleshooting

**Error "Failed to fetch":**
- Verifica que el backend esté corriendo
- Verifica la URL en `src/services/api.ts`
- Si usas dispositivo físico, usa tu IP local
- Asegúrate de estar en la misma red WiFi

**Errores de Firebase:**
- Verifica credenciales en `src/services/firebase.ts`
- Habilita proveedores en Firebase Console

**Build errors:**
- Limpia cache: `npx expo start -c`
- Reinstala node_modules: `rm -rf node_modules && npm install`

## 📦 Dependencias Principales

- **expo**: ^52.0.x
- **react-native**: 0.75.x
- **@react-navigation/native**: ^7.0.0
- **axios**: ^1.x
- **firebase**: ^11.x
- **@react-native-async-storage/async-storage**: ^2.x

## 🚢 Deploy

### Google Play Store

1. Build de producción:
```bash
eas build --profile production --platform android
```

2. Submit:
```bash
eas submit --platform android
```

### Apple App Store

1. Build de producción:
```bash
eas build --profile production --platform ios
```

2. Submit:
```bash
eas submit --platform ios
```

## 📄 Licencia

Este proyecto es parte del sistema de reservas de canchas deportivas de la Universidad UNAB.

## 👥 Autor

Desarrollado para UNAB - Universidad Andrés Bello
