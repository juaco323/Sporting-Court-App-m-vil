# UNAB Sporting Court - Comando de Ejecucion Rapida

## Comando de PowerShell para Ejecutar la Aplicacion

### Opcion 1: Script Automatizado (Recomendado)

```powershell
# Descarga y ejecuta el script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/rollingTrickster/unab-sporting-court/versionFinal/ejecutar-app.ps1" -OutFile "ejecutar-app.ps1"; .\ejecutar-app.ps1
```

### Opcion 2: Comando Directo (Una Linea)

```powershell
docker network create unab-network 2>$null; docker stop unab-backend unab-frontend 2>$null; docker rm unab-backend unab-frontend 2>$null; docker run -d --name unab-backend --network unab-network -p 8000:8000 -v unab-db:/app/db_data --restart unless-stopped jfuenzalida/unab-sporting-court-backend:latest; docker run -d --name unab-frontend --network unab-network -p 80:80 --restart unless-stopped jfuenzalida/unab-sporting-court-frontend:latest; Start-Sleep -Seconds 8; docker exec unab-backend python init_db.py; Write-Host "`n=== APLICACION LISTA ===`nFrontend: http://localhost`nAPI: http://localhost:8000/docs`n`nUsuarios:`n- Admin: admin@unab.cl / admin123`n- Usuario: usuario@unab.cl / usuario123`n" -ForegroundColor Green
```

### Opcion 3: Comandos Paso a Paso

```powershell
# 1. Crear red
docker network create unab-network

# 2. Ejecutar backend
docker run -d --name unab-backend --network unab-network -p 8000:8000 -v unab-db:/app/db_data jfuenzalida/unab-sporting-court-backend:latest

# 3. Ejecutar frontend
docker run -d --name unab-frontend --network unab-network -p 80:80 jfuenzalida/unab-sporting-court-frontend:latest

# 4. Esperar 8 segundos
Start-Sleep -Seconds 8

# 5. Inicializar base de datos
docker exec unab-backend python init_db.py
```

---

## Acceso

- **Aplicacion Web**: http://localhost
- **Documentacion API**: http://localhost:8000/docs

---

## Credenciales

### Administrador
- **Email**: admin@unab.cl
- **Password**: admin123

### Usuario Regular
- **Email**: usuario@unab.cl
- **Password**: usuario123

---

## Imagenes Docker Hub

- **Backend**: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-backend
- **Frontend**: https://hub.docker.com/r/jfuenzalida/unab-sporting-court-frontend

---

## Comandos Utiles

```powershell
# Ver logs
docker logs -f unab-backend
docker logs -f unab-frontend

# Detener
docker stop unab-backend unab-frontend

# Reiniciar
docker restart unab-backend unab-frontend

# Eliminar (mantiene base de datos)
docker stop unab-backend unab-frontend; docker rm unab-backend unab-frontend

# Eliminar TODO (incluye base de datos)
docker stop unab-backend unab-frontend; docker rm unab-backend unab-frontend; docker volume rm unab-db
```

---

## Requisitos

- Docker instalado y en ejecucion
- Puerto 80 y 8000 disponibles
- PowerShell 5.1 o superior
- Conexion a Internet (primera ejecucion)

---

## Troubleshooting

### Puerto 80 ocupado
```powershell
# Usar puerto 8080 para frontend
docker run -d --name unab-frontend --network unab-network -p 8080:80 jfuenzalida/unab-sporting-court-frontend:latest
# Acceder en: http://localhost:8080
```

### Backend no responde
```powershell
docker logs unab-backend
docker restart unab-backend
```

### Reiniciar desde cero
```powershell
docker stop unab-backend unab-frontend; docker rm unab-backend unab-frontend; docker volume rm unab-db; .\ejecutar-app.ps1
```
