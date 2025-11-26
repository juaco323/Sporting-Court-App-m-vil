# SOLUCIÓN: Error "No autorizada" en Google OAuth

## Problema
Al iniciar sesión con Google aparece el error "no autorizada" o "unauthorized".

## Causa
Los Client IDs de Android e iOS no están configurados en Google Cloud Console, o la app no está usando los IDs correctos.

## Solución

### Opción 1: Usar solo Web Client ID (RECOMENDADO para Expo)

Expo puede usar solo el Web Client ID si se configura correctamente. Actualiza `LoginScreen.tsx`:

```typescript
// En lugar de especificar androidClientId e iosClientId
const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId: config.GOOGLE_OAUTH.webClientId,
});
```

### Opción 2: Obtener Client IDs nativos de Firebase

Si necesitas los IDs nativos, sigue estos pasos:

#### 1. Ve a Firebase Console
https://console.firebase.google.com/project/unab-sporting-court-b5294/settings/general

#### 2. En la sección "Tus apps", deberías ver:
- **Android app**: `cl.unab.sportingcourt`
- **iOS app**: `cl.unab.sportingcourt`
- **Web app**: Ya configurada

#### 3. Para Android:
1. Click en el ícono de Android
2. Si no existe, agrega una app Android:
   - **Package name**: `cl.unab.sportingcourt` (del app.json)
   - **App nickname**: "UNAB Sporting Court Android"
   - Descarga `google-services.json` (no necesario para Expo)
3. Ve a **Project Settings > Service accounts**
4. En la pestaña **Service accounts**, busca el Android Client ID
   - Formato: `XXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`

#### 4. Para iOS:
1. Click en el ícono de iOS
2. Si no existe, agrega una app iOS:
   - **Bundle ID**: `cl.unab.sportingcourt` (del app.json)
   - **App nickname**: "UNAB Sporting Court iOS"
3. Ve a **Project Settings > Service accounts**
4. Busca el iOS Client ID
   - Formato: `XXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`

#### 5. O usa Google Cloud Console:
https://console.cloud.google.com/apis/credentials?project=unab-sporting-court-b5294

- Busca en la lista de "OAuth 2.0 Client IDs"
- Deberías ver:
  - **Web client** (ya lo tienes: 616387990630-5lrkiap1lp8ief1tqluvaui3tq31nesh)
  - **Android client** (si existe)
  - **iOS client** (si existe)

### Opción 3: CREAR nuevos Client IDs (si no existen)

#### Para Android:

1. Ve a: https://console.cloud.google.com/apis/credentials?project=unab-sporting-court-b5294
2. Click en **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Selecciona **"Android"**
4. **Name**: "UNAB Sporting Court Android"
5. **Package name**: `cl.unab.sportingcourt`
6. **SHA-1 certificate fingerprint**: Obtenerlo con:

```powershell
# Para debug (Expo):
cd $env:USERPROFILE\.android
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

7. Copia el SHA-1 que aparece y pégalo
8. Click **"CREATE"**
9. Copia el **Client ID** generado

#### Para iOS:

1. En la misma página de credentials
2. Click en **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Selecciona **"iOS"**
4. **Name**: "UNAB Sporting Court iOS"
5. **Bundle ID**: `cl.unab.sportingcourt`
6. Click **"CREATE"**
7. Copia el **Client ID** generado

## Actualizar la configuración

Una vez tengas los Client IDs, actualiza `src/config/index.ts`:

```typescript
GOOGLE_OAUTH: {
  webClientId: "616387990630-5lrkiap1lp8ief1tqluvaui3tq31nesh.apps.googleusercontent.com",
  androidClientId: "TU-ANDROID-CLIENT-ID.apps.googleusercontent.com",
  iosClientId: "TU-IOS-CLIENT-ID.apps.googleusercontent.com",
},
```

## Verificación Rápida

### Prueba 1: Solo Web Client (más simple)
Actualiza LoginScreen.tsx para usar solo webClientId:

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId: config.GOOGLE_OAUTH.webClientId,
});
```

### Prueba 2: Verificar en Google Cloud Console
1. Ve a: https://console.cloud.google.com/apis/credentials?project=unab-sporting-court-b5294
2. Verifica que existe un "OAuth 2.0 Client ID" para tu plataforma
3. Si solo ves el Web client, usa la Opción 1

## Pasos siguientes

1. Reinicia la app Expo (presiona 'r' en la terminal)
2. Intenta iniciar sesión con Google nuevamente
3. Si sigue el error, revisa la consola de Expo para más detalles

## Notas Importantes

- **Expo Go** en development mode puede usar solo el webClientId
- Para **producción** (APK/IPA), NECESITAS los Client IDs nativos
- Los SHA-1 del debug keystore son diferentes al release keystore
- Firebase Authentication debe estar habilitado en Firebase Console

## Enlaces útiles

- Firebase Console: https://console.firebase.google.com/project/unab-sporting-court-b5294
- Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=unab-sporting-court-b5294
- Expo Auth Session Docs: https://docs.expo.dev/guides/authentication/#google
