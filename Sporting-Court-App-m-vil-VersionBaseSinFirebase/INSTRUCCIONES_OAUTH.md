# Pasos para Completar la Configuración de OAuth

## 1. Actualizar Client IDs en `src/config/index.ts`

Abre el archivo `src/config/index.ts` y reemplaza los valores con tus Client IDs reales:

```typescript
GOOGLE_OAUTH: {
  webClientId: "TU_WEB_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com",
  androidClientId: "TU_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  iosClientId: "TU_IOS_CLIENT_ID.apps.googleusercontent.com",
},

GITHUB_OAUTH: {
  clientId: "TU_GITHUB_CLIENT_ID",
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

#### GitHub Client ID:
1. Ve a [GitHub Settings](https://github.com/settings/developers)
2. Click en **OAuth Apps**
3. Selecciona tu aplicación
4. Copia el **Client ID**

## 2. Configurar Redirect URIs

### En Google Cloud Console:
Para cada Client ID, agrega estas **Authorized redirect URIs**:

```
https://auth.expo.io/@TU_USUARIO_EXPO/unab-sporting-mobile
exp://localhost:8081
http://localhost:19006
unabsportingcourt://
```

### En GitHub OAuth App:
En **Authorization callback URL**, agrega:

```
https://auth.expo.io/@TU_USUARIO_EXPO/unab-sporting-mobile
unabsportingcourt://
```

## 3. Endpoints Requeridos en el Backend

Tu backend FastAPI debe tener estos endpoints:

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

### Para GitHub:
```python
@app.post("/api/v1/auth/github/callback")
async def github_callback(code: str):
    # 1. Exchange code por access_token con GitHub
    # 2. Obtener datos del usuario de GitHub
    # 3. Crear/actualizar usuario en tu BD
    # 4. Retornar: access_token, user
```

**Ejemplo de implementación del endpoint de GitHub:**

```python
import httpx

@app.post("/api/v1/auth/github/callback")
async def github_callback(data: dict):
    code = data.get("code")
    
    # Exchange code por access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": "TU_GITHUB_CLIENT_ID",
                "client_secret": "TU_GITHUB_CLIENT_SECRET",
                "code": code,
            }
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        # Obtener datos del usuario
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        github_user = user_response.json()
        
        # Obtener email si no está público
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        emails = email_response.json()
        primary_email = next((e["email"] for e in emails if e["primary"]), github_user.get("email"))
    
    # Buscar o crear usuario en tu BD
    user = db.query(User).filter(User.email == primary_email).first()
    
    if not user:
        user = User(
            email=primary_email,
            full_name=github_user.get("name", github_user.get("login")),
            rut=f"GITHUB-{github_user['id']}",
            firebase_uid=f"github_{github_user['id']}",
            is_active=True
        )
        db.add(user)
        db.commit()
    
    # Generar tu propio JWT token
    jwt_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "user": user
    }
```

## 4. Verificar Configuración en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Verifica que estén habilitados:
   - ✅ **Google** (con tu Web Client ID configurado)
   - ✅ **GitHub** (con Client ID y Secret configurados)

## 5. Testing

### Probar Google Login:
1. Abre la app
2. Click en "Continuar con Google"
3. Selecciona tu cuenta Google
4. Debería autenticarse y crear/iniciar sesión

### Probar GitHub Login:
1. Abre la app
2. Click en "Continuar con GitHub"
3. Autoriza la aplicación
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

### GitHub no retorna email
- El usuario debe tener su email público en GitHub, o
- Debes solicitar el scope `user:email` (ya configurado)
- El backend debe hacer una petición adicional a `/user/emails`

## Resumen de lo que ya está implementado:

✅ Configuración de Firebase
✅ Login con Google usando expo-auth-session
✅ Login con GitHub usando WebBrowser
✅ Manejo de tokens y autenticación
✅ Registro automático si el usuario no existe
✅ Deep linking configurado

**Solo falta:**
- Agregar tus Client IDs reales en `src/config/index.ts`
- Implementar los endpoints en el backend
- Configurar las redirect URIs en Google y GitHub
