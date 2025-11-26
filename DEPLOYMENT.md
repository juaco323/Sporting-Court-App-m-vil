# Guía de Despliegue en AWS EC2 🚀

Esta guía detalla los pasos para desplegar el backend de la aplicación en tu servidor EC2 y conectar la app móvil.

## 1. Datos del Servidor
*   **IP Pública:** `54.226.21.206`
*   **Usuario:** `ec2-user` (Por defecto en Amazon Linux) o `ubuntu` (si es Ubuntu). Probaremos con `ec2-user` primero.
*   **Llave:** `server_key.pem` (Guardada en la raíz del proyecto).

## 2. Conexión al Servidor (SSH)

Desde la terminal de VS Code (PowerShell):

```powershell
# 1. Asegurar permisos de la llave (opcional en Windows pero recomendado)
# En Windows estándar a veces ssh se queja de permisos muy abiertos.

# 2. Conectar
ssh -i server_key.pem ec2-user@54.226.21.206
```

*Si `ec2-user` no funciona, intenta con `ubuntu@54.226.21.206`.*

## 3. Preparación del Servidor

Una vez dentro del servidor, ejecuta estos comandos para instalar Python y Git:

```bash
# Actualizar sistema
sudo yum update -y  # Si es Amazon Linux
# sudo apt update && sudo apt upgrade -y # Si es Ubuntu

# Instalar Python y Git
sudo yum install python3 git -y
# sudo apt install python3 python3-pip git -y
```

## 4. Obtener el Código

Clonaremos el repositorio directamente en el servidor:

```bash
git clone https://github.com/juaco323/Sporting-Court-App-m-vil-VersionBaseSinFirebase.git
cd Sporting-Court-App-m-vil-VersionBaseSinFirebase
git checkout versionMovilConFirebaseFinal
cd backend
```

## 5. Configurar y Ejecutar Backend

```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r backend/requirements.txt

# Ejecutar servidor (en segundo plano o con screen/tmux recomendado para producción)
# Para prueba rápida:
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

**Nota de Seguridad:** Asegúrate de que el "Security Group" de tu instancia EC2 permita tráfico entrante en el puerto **8000** (TCP).

## 6. Actualizar App Móvil

Una vez el backend esté corriendo en el servidor, debemos actualizar la app móvil para que apunte a la nueva IP en lugar de `localhost`.

1.  Editar `src/config/index.ts`.
2.  Cambiar `API_BASE_URL` a `http://54.226.21.206:8000/api/v1`.
3.  Reconstruir/Recargar la app.
