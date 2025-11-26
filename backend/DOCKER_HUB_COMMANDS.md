# Comandos para Subir Imágenes a Docker Hub

## 1. Iniciar Sesión en Docker Hub

```powershell
docker login
```

Te pedirá tu usuario y contraseña de Docker Hub.

## 2. Etiquetar las Imágenes

```powershell
# Etiquetar backend
docker tag unab-sporting-court-main-backend:latest jfuenzalida/unab-sporting-court-backend:latest

# Etiquetar frontend
docker tag unab-sporting-court-main-frontend:latest jfuenzalida/unab-sporting-court-frontend:latest
```

## 3. Subir las Imágenes a Docker Hub

```powershell
# Subir backend
docker push jfuenzalida/unab-sporting-court-backend:latest

# Subir frontend
docker push jfuenzalida/unab-sporting-court-frontend:latest
```

✅ **Imágenes ya publicadas en Docker Hub:**
- https://hub.docker.com/r/jfuenzalida/unab-sporting-court-backend
- https://hub.docker.com/r/jfuenzalida/unab-sporting-court-frontend

## 4. Comando para que Otros Ejecuten la Aplicación

Después de subir las imágenes, cualquier persona puede ejecutar la aplicación con:

```powershell
# Descargar y ejecutar la aplicación completa
docker network create unab-network

# Ejecutar backend
docker run -d `
  --name unab-backend `
  --network unab-network `
  -p 8000:8000 `
  -v unab-db:/app/db_data `
  jfuenzalida/unab-sporting-court-backend:latest

# Ejecutar frontend
docker run -d `
  --name unab-frontend `
  --network unab-network `
  -p 80:80 `
  jfuenzalida/unab-sporting-court-frontend:latest

# Esperar unos segundos e inicializar la base de datos
Start-Sleep -Seconds 5
docker exec unab-backend python init_db.py
```

**Acceder a la aplicación:** http://localhost

---

## Comando Todo-en-Uno (Simplificado)

Guarda este comando en un archivo `ejecutar-app.ps1`:

```powershell
# ================================================
# Script para ejecutar UNAB Sporting Court
# ================================================

Write-Host "🏀 Iniciando UNAB Sporting Court..." -ForegroundColor Cyan

# Crear red si no existe
docker network create unab-network 2>$null

# Detener y eliminar contenedores existentes
Write-Host "📦 Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker stop unab-backend unab-frontend 2>$null
docker rm unab-backend unab-frontend 2>$null

# Ejecutar backend
Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
docker run -d `
  --name unab-backend `
  --network unab-network `
  -p 8000:8000 `
  -v unab-db:/app/db_data `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-backend:latest

# Ejecutar frontend
Write-Host "🌐 Iniciando frontend..." -ForegroundColor Green
docker run -d `
  --name unab-frontend `
  --network unab-network `
  -p 80:80 `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-frontend:latest

# Esperar a que el backend esté listo
Write-Host "⏳ Esperando a que el backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Inicializar base de datos
Write-Host "🗄️ Inicializando base de datos..." -ForegroundColor Magenta
docker exec unab-backend python init_db.py

Write-Host ""
Write-Host "✅ ¡Aplicación lista!" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "📍 Backend API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ver logs:" -ForegroundColor Yellow
Write-Host "  docker logs -f unab-backend"
Write-Host "  docker logs -f unab-frontend"
Write-Host ""
Write-Host "Para detener:" -ForegroundColor Yellow
Write-Host "  docker stop unab-backend unab-frontend"
```

**Ejecutar el script:**

```powershell
.\ejecutar-app.ps1
```

---

## Usuarios de Prueba

Una vez iniciada la aplicación:

- **Administrador:**
  - Email: `admin@unab.cl`
  - Contraseña: `admin123`

- **Usuario:**
  - Email: `usuario@unab.cl`
  - Contraseña: `usuario123`

---

## Comandos de Mantenimiento

### Ver logs en tiempo real
```powershell
docker logs -f unab-backend
docker logs -f unab-frontend
```

### Detener la aplicación
```powershell
docker stop unab-backend unab-frontend
```

### Eliminar contenedores (mantiene la base de datos)
```powershell
docker rm unab-backend unab-frontend
```

### Reiniciar la aplicación
```powershell
docker restart unab-backend unab-frontend
```

### Backup de la base de datos
```powershell
docker exec unab-backend cp /app/db_data/sporting_court.db /app/db_data/sporting_court.db.backup
docker cp unab-backend:/app/db_data/sporting_court.db.backup ./backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').db
```

### Eliminar TODO (incluyendo base de datos) ⚠️
```powershell
docker stop unab-backend unab-frontend
docker rm unab-backend unab-frontend
docker volume rm unab-db
docker network rm unab-network
```

---

## Verificar que las Imágenes están en Docker Hub

```powershell
# Ver imágenes locales
docker images | Select-String "unab-sporting-court"

# Buscar en Docker Hub (después de subir)
# Visita: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-backend
# Visita: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-frontend
```

---

## Alternativa: Usar docker-compose desde Docker Hub

Puedes crear un `docker-compose.hub.yml` para facilitar el despliegue:

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

**Ejecutar con docker-compose:**

```powershell
docker-compose -f docker-compose.hub.yml up -d
```
