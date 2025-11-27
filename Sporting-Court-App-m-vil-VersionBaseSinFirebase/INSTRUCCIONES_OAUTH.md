# Pasos para Completar la Configuración de Google OAuth

## 1. Actualizar Client IDs en `src/config/index.ts`

Abre el archivo `src/config/index.ts` y reemplaza los valores con tus Client IDs reales de Google:

```typescript
GOOGLE_OAUTH: {
  webClientId: "TU_WEB_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com",
  androidClientId: "TU_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  iosClientId: "TU_IOS_CLIENT_ID.apps.googleusercontent.com",
},
```

### Dónde encontrar estos valores:

#### Google Client IDs:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto Firebase
3. Ve a **APIs & Services** > **Credentials**
4. Busca tus OAuth 2.0 Client IDs:
   - **Web client**: Copia el Client ID completo
   - **Android**: Si lo creaste, copia su Client ID
   - **iOS**: Si lo creaste, copia su Client ID

**IMPORTANTE:** El **Web Client ID** es el más importante y debe estar configurado en Firebase Console también.

## 2. Configurar Redirect URIs

### En Google Cloud Console:
Para cada Client ID, agrega estas **Authorized redirect URIs**:

```
https://auth.expo.io/@TU_USUARIO_EXPO/unab-sporting-mobile
exp://localhost:8081
http://localhost:19006
unabsportingcourt://
```

## 3. Endpoints Requeridos en el Backend

Tu backend FastAPI debe tener estos endpoints para manejar el login con Firebase/Google:

### Para Google/Firebase:
```python
@app.post("/api/v1/auth/firebase/login")
async def firebase_login(data: dict):
    # Recibe: firebase_uid, email, full_name
    # Busca usuario por firebase_uid
    # Retorna: access_token, user

@app.post("/api/v1/auth/firebase/register")
async def firebase_register(data: dict):
    # Recibe: firebase_uid, email, full_name, rut
    # Crea nuevo usuario con firebase_uid
    # Retorna: access_token, user
```

## 4. Verificar Configuración en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Verifica que esté habilitado:
   - ✅ **Google** (con tu Web Client ID configurado)

## 5. Testing

### Probar Google Login:
1. Abre la app
2. Click en "Continuar con Google"
3. Selecciona tu cuenta Google
4. Debería autenticarse y crear/iniciar sesión

## Troubleshooting

### Error: "Invalid OAuth client"
- Verifica que los Client IDs estén correctos en `config/index.ts`
- Asegúrate de que las redirect URIs estén configuradas

### Error: "DEVELOPER_ERROR"
- El SHA-1 fingerprint no coincide (Android)
- Bundle ID incorrecto (iOS)

### Error: "Login failed"
- Verifica que el backend esté corriendo
- Revisa los logs del backend para ver el error específico
- Confirma que los endpoints estén implementados

## Resumen de lo que ya está implementado:

✅ Configuración de Firebase
✅ Login con Google usando expo-auth-session
✅ Manejo de tokens y autenticación
✅ Registro automático si el usuario no existe
✅ Deep linking configurado

**Solo falta:**
- Agregar tus Client IDs reales en `src/config/index.ts`
- Implementar los endpoints en el backend
- Configurar las redirect URIs en Google
