# Configuración de Firebase Authentication

## IDs de Cliente de Google OAuth

Para que funcione el login con Google, necesitas configurar los Client IDs correctos en `src/screens/LoginScreen.tsx`:

### 1. Obtener Client IDs

Ve a la [Google Cloud Console](https://console.cloud.google.com/):

1. Selecciona tu proyecto de Firebase
2. Ve a **APIs & Services** > **Credentials**
3. Busca o crea credenciales OAuth 2.0

### 2. Client IDs Necesarios

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: 'TU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'TU_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

#### Web Client ID
- **Tipo**: Web application
- **Authorized redirect URIs**: 
  - `https://auth.expo.io/@tu-usuario/unab-sporting-mobile`
  - `http://localhost:19006`

#### Android Client ID
- **Tipo**: Android
- **Package name**: `cl.unab.sportingcourt`
- **SHA-1 certificate fingerprint**: (obtén ejecutando `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`)

#### iOS Client ID
- **Tipo**: iOS
- **Bundle ID**: `cl.unab.sportingcourt`

### 3. Configurar Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Habilita **Google** como proveedor
5. Configura el **Web SDK configuration** con tu Web Client ID
6. Guarda los cambios

### 4. GitHub OAuth (Próximamente)

Para GitHub necesitarás:
1. Crear una OAuth App en GitHub Settings
2. Configurar callback URL: `https://auth.expo.io/@tu-usuario/unab-sporting-mobile`
3. Obtener Client ID y Client Secret
4. Configurar en Firebase Authentication

### 5. Backend Endpoints

Asegúrate de que tu backend tenga estos endpoints:

- `POST /api/v1/auth/firebase/login` - Login con Firebase UID existente
- `POST /api/v1/auth/firebase/register` - Registro de nuevo usuario con Firebase

#### Payload esperado:

```json
{
  "firebase_uid": "uid_from_firebase",
  "email": "user@example.com",
  "full_name": "Nombre Usuario",
  "rut": "GOOGLE-12345678" // Para usuarios de Google
}
```

### 6. Testing

Para probar en desarrollo:
- **Android**: Usa Expo Go o build de desarrollo
- **iOS**: Usa Expo Go o build de desarrollo
- **Web**: Funciona directamente con `expo start --web`

### Notas Importantes

- Los Client IDs son diferentes para cada plataforma
- El Web Client ID es el más importante y debe coincidir con Firebase
- Para producción, necesitarás Client IDs de release (no debug)
- Expo maneja automáticamente los redirects con `expo-auth-session`

### Troubleshooting

**Error: "Invalid OAuth client"**
- Verifica que los Client IDs estén correctos
- Asegúrate de que las URIs de redirect estén configuradas
- Revisa que el bundle ID/package name coincida

**Error: "DEVELOPER_ERROR"**
- SHA-1 fingerprint no coincide (Android)
- Bundle ID incorrecto (iOS)

**Error de red/timeout**
- Verifica que el backend esté corriendo
- Confirma que las URLs del backend sean accesibles desde el dispositivo
