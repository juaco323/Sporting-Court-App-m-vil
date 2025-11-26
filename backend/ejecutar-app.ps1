# ================================================
# Script para ejecutar UNAB Sporting Court
# Aplicacion de Reservas de Canchas Deportivas
# ================================================

Write-Host ""
Write-Host "UNAB SPORTING COURT - Sistema de Reservas" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Crear red si no existe
Write-Host "[Red] Configurando red Docker..." -ForegroundColor Yellow
docker network create unab-network 2>$null

# Detener y eliminar contenedores existentes
Write-Host "[Limpieza] Eliminando contenedores anteriores..." -ForegroundColor Yellow
docker stop unab-backend unab-frontend 2>$null
docker rm unab-backend unab-frontend 2>$null

Write-Host ""
Write-Host "[Descarga] Obteniendo imagenes desde Docker Hub..." -ForegroundColor Magenta
Write-Host "           (Esto puede tomar unos minutos la primera vez)" -ForegroundColor Gray

# Ejecutar backend
Write-Host ""
Write-Host "[Backend] Iniciando Backend (FastAPI + SQLite)..." -ForegroundColor Green
docker run -d `
  --name unab-backend `
  --network unab-network `
  -p 8000:8000 `
  -v unab-db:/app/db_data `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-backend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al iniciar el backend" -ForegroundColor Red
    exit 1
}

# Ejecutar frontend
Write-Host "[Frontend] Iniciando Frontend (Vue.js + Nginx)..." -ForegroundColor Green
docker run -d `
  --name unab-frontend `
  --network unab-network `
  -p 80:80 `
  --restart unless-stopped `
  jfuenzalida/unab-sporting-court-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Error al iniciar el frontend" -ForegroundColor Red
    docker stop unab-backend
    docker rm unab-backend
    exit 1
}

# Esperar a que el backend este listo
Write-Host ""
Write-Host "[Espera] Esperando a que el backend este listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Inicializar base de datos
Write-Host "[Database] Inicializando base de datos SQLite..." -ForegroundColor Magenta
docker exec unab-backend python init_db.py

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "APLICACION LISTA Y FUNCIONANDO" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "ACCESO A LA APLICACION:" -ForegroundColor Cyan
Write-Host "   Frontend:        http://localhost" -ForegroundColor White
Write-Host "   API Docs:        http://localhost:8000/docs" -ForegroundColor White
Write-Host "   API Redoc:       http://localhost:8000/redoc" -ForegroundColor White
Write-Host ""
Write-Host "USUARIOS DE PRUEBA:" -ForegroundColor Yellow
Write-Host "   Administrador:" -ForegroundColor White
Write-Host "      Email:        admin@unab.cl" -ForegroundColor Gray
Write-Host "      Contraseña:   admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "   Usuario:" -ForegroundColor White
Write-Host "      Email:        usuario@unab.cl" -ForegroundColor Gray
Write-Host "      Contraseña:   usuario123" -ForegroundColor Gray
Write-Host ""
Write-Host "COMANDOS UTILES:" -ForegroundColor Yellow
Write-Host "   Ver logs backend:   docker logs -f unab-backend" -ForegroundColor Gray
Write-Host "   Ver logs frontend:  docker logs -f unab-frontend" -ForegroundColor Gray
Write-Host "   Detener:            docker stop unab-backend unab-frontend" -ForegroundColor Gray
Write-Host "   Reiniciar:          docker restart unab-backend unab-frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
