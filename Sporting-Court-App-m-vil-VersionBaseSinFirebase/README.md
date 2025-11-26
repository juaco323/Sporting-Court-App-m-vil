# UNAB Sporting Court App 📱

Aplicación móvil para la reserva de canchas deportivas, desarrollada con React Native y Expo.

## ✨ Funcionalidades

*   **Autenticación de Usuarios:**
    *   Registro e Inicio de Sesión con Correo y Contraseña.
    *   **Inicio de Sesión con Google (Nativo):** Integración robusta usando `@react-native-google-signin/google-signin` y Firebase Auth.
*   **Gestión de Canchas:**
    *   Visualización de canchas disponibles.
    *   Filtrado por tipo de deporte.
    *   Detalles de cada cancha (características, precio, ubicación).
*   **Sistema de Reservas:**
    *   Selección de fecha y hora.
    *   Validación de disponibilidad en tiempo real.
    *   Confirmación de reserva.
*   **Comprobantes:**
    *   Generación y descarga de comprobantes de reserva en formato PDF.
*   **Perfil de Usuario:**
    *   Historial de "Mis Reservas".
    *   Información del perfil.

## 🛠 Requisitos Previos

*   Node.js (LTS recomendado).
*   Android Studio (para emulador Android) o dispositivo físico Android.
*   Cuenta de Firebase configurada (para Google Sign-In).

## 🚀 Cómo Ejecutar la App

Debido a que utilizamos librerías nativas para el Login de Google, **NO se puede utilizar la app estándar de Expo Go**. Es necesario utilizar un **Development Client**.

### 1. Configuración del Entorno

Asegúrate de tener las dependencias instaladas:

```bash
npm install
```

### 2. Configuración de Firebase y Google

El proyecto requiere los siguientes archivos y configuraciones (ya incluidos en esta rama, pero necesarios si clonas de cero):
*   `google-services.json` en la raíz del proyecto móvil.
*   `src/config/index.ts` con los IDs de cliente correctos.
*   `src/services/firebase.ts` con la configuración web de Firebase.

**Importante:** Para que Google Login funcione, debes haber agregado la huella SHA-1 de tu certificado de desarrollo/producción en la consola de Firebase y haber puesto el Web Client ID en la "Whitelist" de Firebase Auth.

### 3. Ejecutar el Backend

Asegúrate de que tu backend (FastAPI) esté corriendo. Desde la carpeta del backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Ejecutar la App Móvil

1.  Inicia el servidor de desarrollo de Expo:

    ```bash
    npx expo start --dev-client
    ```

2.  **En el Emulador/Dispositivo:**
    *   Debes tener instalada la **APK de Desarrollo** (Development Build).
    *   Si no la tienes, debes generarla con EAS Build (`eas build --profile development --platform android`) o instalar la que generamos previamente.
    *   Abre la app "UNAB Sporting Court" (la versión de desarrollo) en tu dispositivo.
    *   Conéctate al servidor local (generalmente `http://10.0.2.2:8081` en emulador Android).

## ⚠️ Notas Importantes

*   **Google Login:** Si encuentras errores como `DEVELOPER_ERROR` o `Invalid Idp Response`, verifica que tu SHA-1 y tu Web Client ID estén correctamente configurados en la consola de Firebase.
*   **PDF:** La descarga de PDF requiere permisos de almacenamiento en Android.
