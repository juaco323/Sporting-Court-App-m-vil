# ==========================================
# Guía de Dockerización
# ==========================================

## Requisitos Previos

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)

## Configuración Inicial

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores:

```powershell
Copy-Item .env.docker.example .env.docker
```

Edita `.env.docker` y cambia al menos:
- `SECRET_KEY`: Genera una nueva clave con `openssl rand -hex 32`
- `CORS_ORIGINS`: Ajusta según tu dominio en producción

### 2. Construir las Imágenes

```powershell
docker-compose build
```

### 3. Iniciar los Contenedores

```powershell
docker-compose up -d
```

Para ver los logs en tiempo real:

```powershell
docker-compose logs -f
```

## Servicios

### Backend (FastAPI)
- **Puerto**: 8000
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Documentación API**: http://localhost:8000/docs

### Frontend (Nginx)
- **Puerto**: 80
- **URL**: http://localhost

## Comandos Útiles

### Ver Estado de los Contenedores

```powershell
docker-compose ps
```

### Detener los Contenedores

```powershell
docker-compose down
```

### Detener y Eliminar Volúmenes (⚠️ Elimina la base de datos)

```powershell
docker-compose down -v
```

### Reiniciar un Servicio Específico

```powershell
docker-compose restart backend
docker-compose restart frontend
```

### Ver Logs de un Servicio

```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Ejecutar Comandos Dentro del Contenedor

```powershell
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### Reconstruir Después de Cambios en el Código

```powershell
docker-compose up -d --build
```

## Estructura de Volúmenes

### backend_db
- **Propósito**: Persistencia de la base de datos SQLite
- **Ruta en Contenedor**: `/app/db_data`
- **Contenido**: `sporting_court.db`

Los datos se preservan entre reinicios del contenedor.

## Troubleshooting

### El backend no se conecta a la base de datos

1. Verifica que el volumen `backend_db` existe:
   ```powershell
   docker volume ls | Select-String backend_db
   ```

2. Verifica los permisos dentro del contenedor:
   ```powershell
   docker-compose exec backend ls -la /app/db_data
   ```

### El frontend no se carga

1. Verifica que Nginx está corriendo:
   ```powershell
   docker-compose exec frontend nginx -t
   ```

2. Revisa los logs de Nginx:
   ```powershell
   docker-compose logs frontend
   ```

### Error de CORS

Verifica que `CORS_ORIGINS` en `.env.docker` incluye el origen desde donde accedes a la aplicación.

### Healthcheck Falla

1. Verifica que el servicio está escuchando en el puerto correcto:
   ```powershell
   docker-compose exec backend curl http://localhost:8000/health
   docker-compose exec frontend wget -O- http://localhost:80
   ```

2. Aumenta el tiempo de `start-period` en `docker-compose.yml` si el servicio tarda en iniciar.

## Producción

### Consideraciones de Seguridad

1. **Cambia SECRET_KEY**: Genera una clave única y segura
2. **Actualiza CORS_ORIGINS**: Especifica solo los dominios permitidos
3. **Usa HTTPS**: Configura un proxy reverso (nginx, traefik) con certificados SSL
4. **Limita Exposición de Puertos**: En producción, solo expón el puerto 80/443 del frontend
5. **Variables de Entorno**: Usa Docker secrets o un gestor de secretos

### Backup de la Base de Datos

```powershell
# Crear backup
docker-compose exec backend cp /app/db_data/sporting_court.db /app/db_data/sporting_court.db.backup

# Copiar backup al host
docker cp $(docker-compose ps -q backend):/app/db_data/sporting_court.db.backup ./sporting_court.db.backup
```

### Restaurar desde Backup

```powershell
# Copiar backup al contenedor
docker cp ./sporting_court.db.backup $(docker-compose ps -q backend):/app/db_data/sporting_court.db

# Reiniciar el backend
docker-compose restart backend
```

## Desarrollo con Docker

Para desarrollo, puedes montar el código fuente como volumen:

```yaml
# Añadir en docker-compose.yml bajo el servicio backend:
volumes:
  - ./backend:/app
  - backend_db:/app/db_data

# Y cambiar el comando a:
command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Esto permite que los cambios en el código se reflejen automáticamente sin reconstruir la imagen.

## Monitoreo

### Ver Uso de Recursos

```powershell
docker stats
```

### Inspeccionar Contenedor

```powershell
docker-compose exec backend env  # Ver variables de entorno
docker-compose exec backend ps aux  # Ver procesos
```

## Limpieza

### Eliminar Contenedores Detenidos

```powershell
docker-compose down
```

### Eliminar Imágenes No Usadas

```powershell
docker image prune -a
```

### Eliminar Todo (⚠️ Cuidado)

```powershell
docker-compose down -v --rmi all
```

## Más Información

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [FastAPI en Docker](https://fastapi.tiangolo.com/deployment/docker/)
