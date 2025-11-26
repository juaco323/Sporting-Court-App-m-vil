# 🚀 Guía de Instalación Completa

Esta guía te ayudará a instalar y configurar todo lo necesario para ejecutar el proyecto.

## 📋 Prerrequisitos

### 1. Python 3.8 o superior

#### Verificar si Python está instalado
```powershell
python --version
```

#### Si no está instalado:

**Opción A: Desde python.org (Recomendado)**
1. Visita https://www.python.org/downloads/
2. Descarga Python 3.11 o superior
3. Durante la instalación:
   - ✅ **IMPORTANTE**: Marca "Add Python to PATH"
   - Elige "Install Now"
4. Reinicia PowerShell después de la instalación
5. Verifica: `python --version`

**Opción B: Desde Microsoft Store**
1. Abre Microsoft Store
2. Busca "Python 3.11"
3. Instala
4. Verifica: `python --version`

### 2. Node.js (para el frontend)

#### Verificar si Node.js está instalado
```powershell
node --version
npm --version
```

#### Si no está instalado:
1. Visita https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Instala con las opciones por defecto
4. Reinicia PowerShell
5. Verifica: `node --version` y `npm --version`

## 🔧 Instalación del Proyecto

### Paso 1: Clonar o descargar el repositorio

Si aún no lo has hecho:
```powershell
git clone https://github.com/rollingTrickster/unab-sporting-court.git
cd unab-sporting-court
```

### Paso 2: Configurar el Backend

```powershell
# Ir al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar el entorno virtual
.\venv\Scripts\Activate.ps1

# Si hay error de permisos, ejecuta esto primero:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración (opcional, ya existe .env)
# El archivo .env ya está creado con valores seguros

# Inicializar la base de datos
python init_db.py
```

**Salida esperada:**
```
✓ Usuario administrador creado: admin@unab.cl / admin123
✓ Usuario de prueba creado: usuario@unab.cl / usuario123
✓ Cancha creada: Cancha Central #1
✓ Cancha creada: Cancha Norte #2
...
✓ Base de datos inicializada correctamente

📋 Credenciales de prueba:
   Admin: admin@unab.cl / admin123
   Usuario: usuario@unab.cl / usuario123

🚀 Inicia el servidor con: uvicorn main:app --reload
📖 Documentación disponible en: http://localhost:8000/docs
```

### Paso 3: Configurar el Frontend

```powershell
# Volver al directorio raíz
cd ..

# Instalar dependencias (si usas npm scripts)
npm install
```

## ▶️ Ejecutar el Proyecto

### Terminal 1: Iniciar el Backend

```powershell
cd backend

# Activar entorno virtual (si no está activo)
.\venv\Scripts\Activate.ps1

# Iniciar servidor
uvicorn main:app --reload
```

**O usar el script de inicio rápido:**
```powershell
cd backend
.\start.ps1
```

El backend estará disponible en:
- **API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Terminal 2: Iniciar el Frontend

```powershell
# En otro terminal, desde la raíz del proyecto
npm run dev
```

El frontend estará disponible en: http://localhost:8080

## ✅ Verificar la Instalación

### 1. Verificar el Backend

**Método 1: Navegador**
- Ve a http://localhost:8000/docs
- Deberías ver la documentación Swagger

**Método 2: Script de prueba**
```powershell
cd backend
# Asegúrate de que el servidor esté corriendo en otra terminal
python test_api.py
```

**Método 3: Curl**
```powershell
curl http://localhost:8000/health
```

Respuesta esperada:
```json
{"status":"healthy","message":"API funcionando correctamente"}
```

### 2. Verificar el Frontend

- Ve a http://localhost:8080
- Deberías ver la página de inicio/login

## 🔐 Credenciales de Prueba

Después de inicializar la base de datos:

| Tipo | Email | Contraseña | Rol |
|------|-------|-----------|-----|
| Admin | admin@unab.cl | admin123 | Administrador |
| Usuario | usuario@unab.cl | usuario123 | Usuario normal |

## 🐛 Solución de Problemas

### Problema: "python: command not found"

**Solución:**
1. Reinstala Python marcando "Add to PATH"
2. Reinicia PowerShell
3. Si el problema persiste, agrega Python al PATH manualmente:
   - Busca la ruta de instalación (ej: `C:\Users\TuUsuario\AppData\Local\Programs\Python\Python311`)
   - Agrégala a las variables de entorno PATH

### Problema: "cannot be loaded because running scripts is disabled"

**Solución:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problema: "pip: command not found"

**Solución:**
```powershell
python -m pip install --upgrade pip
```

### Problema: "Module not found: uvicorn"

**Solución:**
```powershell
# Asegúrate de estar en el entorno virtual
.\venv\Scripts\Activate.ps1

# Reinstala las dependencias
pip install -r requirements.txt
```

### Problema: "Address already in use" (puerto 8000 ocupado)

**Solución 1: Usar otro puerto**
```powershell
uvicorn main:app --reload --port 8001
```

**Solución 2: Encontrar y cerrar el proceso**
```powershell
# Ver qué está usando el puerto 8000
netstat -ano | findstr :8000

# Matar el proceso (usa el PID del comando anterior)
taskkill /PID <PID> /F
```

### Problema: CORS errors en el frontend

**Solución:**
Verifica que el backend esté configurado correctamente en `.env`:
```env
CORS_ORIGINS=["http://localhost:8080","http://127.0.0.1:8080"]
```

### Problema: "Token expired" inmediatamente después del login

**Solución:**
- Verifica que la hora del sistema esté correcta
- El token expira en 30 minutos por defecto
- Puedes cambiar esto en `.env`:
```env
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## 📦 Estructura de Directorios Después de la Instalación

```
unab-sporting-court/
├── backend/
│   ├── venv/                    # Entorno virtual (creado)
│   ├── sporting_court.db        # Base de datos SQLite (creado)
│   ├── __pycache__/            # Cache de Python (creado)
│   ├── main.py
│   ├── auth.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── src/
├── node_modules/               # Dependencias Node (creado)
├── index.html
├── app.js
├── package.json
└── README.md
```

## 🔄 Actualizar el Proyecto

```powershell
# Actualizar dependencias del backend
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt --upgrade

# Actualizar dependencias del frontend
cd ..
npm update
```

## 🗄️ Reiniciar la Base de Datos

Si necesitas reiniciar la base de datos:

```powershell
cd backend

# Eliminar la base de datos existente
Remove-Item sporting_court.db

# Volver a inicializar
python init_db.py
```

## 📞 Recursos y Ayuda

- **Documentación API**: http://localhost:8000/docs (cuando el servidor esté corriendo)
- **Guía de integración**: Ver [INTEGRATION.md](../INTEGRATION.md)
- **README del backend**: Ver [backend/README.md](README.md)
- **README principal**: Ver [README.md](../README.md)

## ✨ Siguientes Pasos

Una vez que todo esté funcionando:

1. **Explora la API** en http://localhost:8000/docs
2. **Prueba el login** con las credenciales de prueba
3. **Crea una reserva** desde el frontend
4. **Revisa la integración** en [INTEGRATION.md](../INTEGRATION.md)
5. **Lee la documentación** completa en [backend/README.md](README.md)

---

¿Aún tienes problemas? Crea un issue en GitHub con:
- El mensaje de error completo
- Los pasos que seguiste
- Tu versión de Python (`python --version`)
- Tu versión de Node.js (`node --version`)
