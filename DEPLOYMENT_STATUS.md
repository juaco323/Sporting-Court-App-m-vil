# Estado del Deployment ✅

## Backend Desplegado Exitosamente

El backend está corriendo en el servidor EC2:
- **IP Pública:** 54.226.21.206
- **Puerto:** 8000
- **Estado:** ✅ Activo (uvicorn corriendo)
- **API Docs:** http://54.226.21.206:8000/docs

## Cambios Realizados

### 1. Backend en EC2
- ✅ Código desplegado en `/home/ec2-user/backend`
- ✅ Entorno virtual creado
- ✅ Dependencias instaladas
- ✅ Uvicorn corriendo en background

### 2. App Móvil
- ✅ `src/config/index.ts` actualizado para apuntar a `http://54.226.21.206:8000/api/v1`

## ⚠️ IMPORTANTE: Configurar Security Group

Para que la app móvil pueda conectarse al backend, debes:

1. Ve a la **Consola de AWS EC2**
2. Selecciona tu instancia
3. Ve a la pestaña **Security** (Seguridad)
4. Haz clic en el **Security Group** asociado
5. Edita las **Inbound Rules** (Reglas de entrada)
6. Agrega una nueva regla:
   - **Type:** Custom TCP
   - **Port:** 8000
   - **Source:** 0.0.0.0/0 (o tu IP específica para mayor seguridad)
7. Guarda los cambios

## Verificación

Una vez configurado el Security Group, prueba desde tu navegador:
```
http://54.226.21.206:8000/docs
```

Si ves la documentación de FastAPI, todo está funcionando correctamente.

## Próximos Pasos

1. Configura el Security Group (paso crítico)
2. Recarga la app móvil
3. Prueba el login y las funcionalidades
4. Si todo funciona, considera:
   - Configurar HTTPS con un certificado SSL
   - Usar un dominio personalizado
   - Configurar un proceso manager (systemd) para que uvicorn se reinicie automáticamente

## Comandos Útiles

### Ver logs del backend:
```bash
ssh -i server_key.pem ec2-user@54.226.21.206 "cat backend/app.log"
```

### Reiniciar el backend:
```bash
ssh -i server_key.pem ec2-user@54.226.21.206 "sudo pkill uvicorn && cd backend/backend && nohup ../venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 > ../app.log 2>&1 &"
```

### Ver estado del proceso:
```bash
ssh -i server_key.pem ec2-user@54.226.21.206 "ps aux | grep uvicorn"
```
