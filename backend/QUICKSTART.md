# ⚡ Comandos Rápidos - UNAB Sporting Court

## 🚀 Inicio Rápido (Primera vez)

### 1. Instalar Python
```powershell
# Descargar desde: https://www.python.org/downloads/
# ✅ IMPORTANTE: Marcar "Add Python to PATH" durante la instalación
```

### 2. Configurar Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python init_db.py
```

### 3. Iniciar Backend
```powershell
uvicorn main:app --reload
```

### 4. Iniciar Frontend (en otra terminal)
```powershell
npm run dev
```

## 🔄 Inicio Normal (ya instalado)

### Terminal 1: Backend
```powershell
cd backend
.\start.ps1
```

### Terminal 2: Frontend
```powershell
npm run dev
```

## 🧪 Probar la API

```powershell
# En el navegador:
http://localhost:8000/docs

# O con script:
cd backend
python test_api.py
```

## 🔐 Credenciales de Prueba

```
Admin:
  Email: admin@unab.cl
  Password: admin123

Usuario:
  Email: usuario@unab.cl
  Password: usuario123
```

## 📋 URLs

```
Backend API:      http://localhost:8000
Swagger Docs:     http://localhost:8000/docs
ReDoc:            http://localhost:8000/redoc
Frontend:         http://localhost:8080
```

## 🛠️ Comandos Útiles

### Backend
```powershell
# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar/actualizar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn main:app --reload

# Iniciar en otro puerto
uvicorn main:app --reload --port 8001

# Reiniciar base de datos
Remove-Item sporting_court.db
python init_db.py
```

### Frontend
```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# En puerto específico
http-server . -p 8081 -c-1
```

## 🐛 Solución Rápida de Problemas

### Error: Scripts deshabilitados
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: Puerto 8000 ocupado
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :8000

# Matar proceso
taskkill /PID <PID> /F

# O usar otro puerto
uvicorn main:app --reload --port 8001
```

### Error: Módulo no encontrado
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Error: Base de datos corrupta
```powershell
cd backend
Remove-Item sporting_court.db
python init_db.py
```

## 📖 Documentación Completa

- **Instalación**: [INSTALL.md](INSTALL.md)
- **Backend**: [backend/README.md](backend/README.md)
- **Integración**: [INTEGRATION.md](INTEGRATION.md)
- **Resumen**: [backend/SUMMARY.md](backend/SUMMARY.md)

## 🧪 Ejemplos de Uso del API

### Con PowerShell
```powershell
# Login
$body = @{email="usuario@unab.cl"; password="usuario123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login/json" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token

# Ver mi perfil
$headers = @{Authorization="Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/users/me" -Headers $headers

# Listar canchas
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/courts"

# Crear reserva
$reserva = @{
    court_id = 1
    date = "2025-11-15"
    time = "15:00"
    duration = 2
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/reservations" -Method Post -Headers $headers -Body $reserva -ContentType "application/json"
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

# Listar mis reservas
response = requests.get(
    "http://localhost:8000/api/v1/reservations",
    headers=headers
)
print(response.json())
```

## 🎯 Endpoints Principales

```
POST   /api/v1/auth/register          - Registrar
POST   /api/v1/auth/login/json        - Login
GET    /api/v1/users/me               - Mi perfil 🔒
GET    /api/v1/courts                 - Listar canchas
POST   /api/v1/reservations           - Crear reserva 🔒
GET    /api/v1/reservations           - Mis reservas 🔒
DELETE /api/v1/reservations/{id}      - Cancelar reserva 🔒
```

🔒 = Requiere token JWT

---

**Tip**: Mantén esta guía abierta mientras desarrollas para referencia rápida.
