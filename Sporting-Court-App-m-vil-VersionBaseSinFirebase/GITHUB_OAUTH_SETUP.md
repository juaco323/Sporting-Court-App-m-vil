# Actualización del Backend para GitHub OAuth

## Instrucciones para completar la implementación de GitHub OAuth

### 1. Agregar endpoint para servir el HTML de callback

En `backend/main.py`, agrega estos imports al inicio:

```python
from fastapi.responses import HTMLResponse
from pathlib import Path
```

### 2. Agregar el endpoint para servir el HTML

Agrega este endpoint en `backend/main.py` (después de incluir los routers):

```python
@app.get("/api/v1/auth/github/web-callback", response_class=HTMLResponse)
async def github_web_callback():
    """
    Endpoint que sirve la página HTML que captura el código de GitHub
    y lo procesa automáticamente
    """
    html_file = Path(__file__).parent / "github_callback.html"
    with open(html_file, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)
```

### 3. Configurar GitHub OAuth App

Ve a: https://github.com/settings/developers

Encuentra tu OAuth App (Client ID: Ov23liXeUYbaobfsb2kC)

**Cambia** la "Authorization callback URL" a:
```
http://192.168.1.81:8000/api/v1/auth/github/web-callback
```

### 4. Reiniciar el servidor backend

```powershell
# Detén el servidor actual (Ctrl+C)

# Reinicia con:
cd "c:\Users\jqnfu\Desktop\UNAB\3er año\2do semestre\Desarrollo web y movil\unab-sporting-court-main"
.\.venv\Scripts\Activate.ps1
cd "unab-sporting-court-main\backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Probar desde la app móvil

1. Recarga la app (presiona 'r' en la terminal de Expo)
2. Click en "Continuar con GitHub"
3. Autoriza la aplicación en GitHub
4. Deberías ver:
   - Una página web que dice "Autenticando con GitHub..."
   - Luego "¡Login Exitoso!"
   - Intenta volver a la app automáticamente

## Cómo funciona el nuevo flujo:

1. **App móvil** → Abre navegador con URL de GitHub
2. **GitHub** → Usuario autoriza → Redirige a backend con código
3. **Backend** → Sirve HTML que procesa el código
4. **HTML** → Llama al endpoint `/api/v1/auth/github/callback` con el código
5. **Backend** → Intercambia código por token, crea/actualiza usuario, retorna JWT
6. **HTML** → Intenta abrir deep link `unabsportingcourt://oauth/github?token=...`
7. **App móvil** → Recibe el token y autentica al usuario (si el deep link funciona)

## Nota sobre Deep Links

Si el deep link no funciona automáticamente, el usuario tendrá que:
1. Cerrar el navegador manualmente
2. Volver a la app
3. Intentar login nuevamente (esta vez ya estará autenticado en GitHub)

O puedes implementar un polling que revise si el usuario se autenticó exitosamente.

## Archivos modificados:

- ✅ `backend/github_callback.html` (CREADO)
- ⏳ `backend/main.py` (ACTUALIZAR - ver instrucciones arriba)
- ✅ `src/screens/LoginScreen.tsx` (ACTUALIZADO)
