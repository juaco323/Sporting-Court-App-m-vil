# UNAB Sporting Court - Instrucciones de Despliegue

## 🚀 Ejecutar la Aplicación desde Docker Hub

### Opción 1: Script Automatizado (Recomendado)

Descarga y ejecuta el script PowerShell:

```powershell
# Descargar el script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/rollingTrickster/unab-sporting-court/versionFinal/ejecutar-app.ps1" -OutFile "ejecutar-app.ps1"

# Ejecutar
.\ejecutar-app.ps1
```

### Opción 2: Comandos Manuales

```powershell
# Crear red Docker
docker network create unab-network

# Ejecutar Backend
docker run -d `
  --name unab-backend `
  --network unab-network `
  -p 8000:8000 `
  -v unab-db:/app/db_data `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-backend:latest

# Ejecutar Frontend
docker run -d `
  --name unab-frontend `
  --network unab-network `
  -p 80:80 `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-frontend:latest

# Inicializar base de datos (esperar 5-8 segundos antes)
Start-Sleep -Seconds 8
docker exec unab-backend python init_db.py
```

### Opción 3: Docker Compose

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: jfuenzalida/unab-sporting-court-backend:latest
    container_name: unab-backend
    ports:
      - "8000:8000"
    volumes:
      - backend_db:/app/db_data
    networks:
      - unab-network
    restart: unless-stopped
    command: >
      sh -c "python init_db.py && uvicorn main:app --host 0.0.0.0 --port 8000"

  frontend:
    image: jfuenzalida/unab-sporting-court-frontend:latest
    container_name: unab-frontend
    ports:
      - "80:80"
    networks:
      - unab-network
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend_db:
    driver: local

networks:
  unab-network:
    driver: bridge
```

Luego ejecuta:

```powershell
docker-compose up -d
```

---

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc

---

## 👥 Usuarios de Prueba

### Administrador
- **Email**: `admin@unab.cl`
- **Contraseña**: `admin123`
- **Permisos**: Gestión de canchas, ver todas las reservas

### Usuario Regular
- **Email**: `usuario@unab.cl`
- **Contraseña**: `usuario123`
- **Permisos**: Crear, editar y cancelar sus propias reservas

---

## 📋 Comandos Útiles

### Ver logs en tiempo real
```powershell
# Backend
docker logs -f unab-backend

# Frontend
docker logs -f unab-frontend
```

### Verificar estado de contenedores
```powershell
docker ps
```

### Detener la aplicación
```powershell
docker stop unab-backend unab-frontend
```

### Iniciar la aplicación (después de detener)
```powershell
docker start unab-backend unab-frontend
```

### Reiniciar la aplicación
```powershell
docker restart unab-backend unab-frontend
```

### Eliminar contenedores (mantiene la base de datos)
```powershell
docker stop unab-backend unab-frontend
docker rm unab-backend unab-frontend
```

### Backup de la base de datos
```powershell
# Crear backup dentro del contenedor
docker exec unab-backend cp /app/db_data/sporting_court.db /app/db_data/sporting_court.db.backup

# Copiar backup al sistema host
docker cp unab-backend:/app/db_data/sporting_court.db.backup ./backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').db
```

### Restaurar desde backup
```powershell
# Copiar backup al contenedor
docker cp ./sporting_court.db.backup unab-backend:/app/db_data/sporting_court.db

# Reiniciar backend
docker restart unab-backend
```

### Limpiar TODO (⚠️ Elimina también la base de datos)
```powershell
docker stop unab-backend unab-frontend
docker rm unab-backend unab-frontend
docker volume rm unab-db
docker network rm unab-network
```

---

## 🔧 Troubleshooting

### El puerto 80 está ocupado
Si el puerto 80 está en uso, cambia el mapeo de puertos:

```powershell
docker run -d `
  --name unab-frontend `
  --network unab-network `
  -p 8080:80 `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-frontend:latest
```

Accede en: http://localhost:8080

### El backend no responde
Verifica que el contenedor esté corriendo:

```powershell
docker ps | Select-String unab-backend
```

Si no aparece, revisa los logs:

```powershell
docker logs unab-backend
```

### Error al inicializar la base de datos
Ejecuta manualmente:

```powershell
docker exec -it unab-backend python init_db.py
```

### Reiniciar desde cero
```powershell
# Eliminar todo
docker stop unab-backend unab-frontend
docker rm unab-backend unab-frontend
docker volume rm unab-db

# Ejecutar de nuevo
.\ejecutar-app.ps1
```

---

## 📦 Imágenes Docker

Las imágenes están disponibles en Docker Hub:

- **Backend**: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-backend
- **Frontend**: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-frontend

### Tamaños aproximados
- Backend: ~200 MB
- Frontend: ~50 MB

---

## ✨ Características de la Aplicación

- 🔐 Autenticación con JWT
- 📱 Diseño responsive (mobile-friendly)
- 🏀 Gestión de canchas deportivas
- 📅 Sistema de reservas con validación de horarios
- ⏰ Bloqueo de horarios pasados
- 🚫 Prevención de doble reserva
- 📄 Generación de comprobantes en PDF
- 🌤️ Integración con API del clima
- 👥 Roles de usuario (Admin/Usuario)
- ✏️ Edición y cancelación de reservas

---

## 🛠️ Stack Tecnológico

### Backend
- Python 3.11
- FastAPI
- SQLite
- Uvicorn
- Alembic (migraciones)
- JWT Authentication

### Frontend
- Vue.js 3
- JavaScript ES6+
- CSS3 (Responsive)
- Lucide Icons
- jsPDF

### Infraestructura
- Docker
- Nginx (Alpine)
- Docker Compose

---

## 📞 Soporte

Para problemas o preguntas:
- GitHub: https://github.com/rollingTrickster/unab-sporting-court
- Email: admin@unab.cl

---

## 📄 Licencia

Universidad Nacional Andrés Bello (UNAB) - Proyecto Académico
