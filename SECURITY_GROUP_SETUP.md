# Guía Paso a Paso: Configurar Security Group en AWS 🔧

## Opción 1: Desde la Consola Web de AWS (Recomendado)

### Paso 1: Acceder a EC2
1. Ve a https://console.aws.amazon.com/ec2/
2. Asegúrate de estar en la región correcta (donde está tu instancia)

### Paso 2: Encontrar tu Instancia
1. En el menú lateral, haz clic en **"Instances"** (Instancias)
2. Busca tu instancia: `i-0b43f3119bec7c018`
3. Haz clic en el ID de la instancia

### Paso 3: Acceder al Security Group
1. En la pestaña de detalles de la instancia, busca la sección **"Security"**
2. Verás algo como: **Security groups: sg-XXXXXXXXX**
3. Haz clic en el nombre del Security Group (el link azul)

### Paso 4: Editar Reglas de Entrada
1. En la página del Security Group, ve a la pestaña **"Inbound rules"**
2. Haz clic en el botón **"Edit inbound rules"**

### Paso 5: Agregar Nueva Regla
1. Haz clic en **"Add rule"**
2. Configura la nueva regla:
   - **Type:** Custom TCP
   - **Protocol:** TCP
   - **Port range:** 8000
   - **Source:** Custom → `0.0.0.0/0` (permite desde cualquier IP)
   - **Description:** "Backend API" (opcional)

### Paso 6: Guardar
1. Haz clic en **"Save rules"**
2. ¡Listo! Los cambios son inmediatos

---

## Opción 2: Usando AWS CLI (Alternativa)

Si tienes AWS CLI instalado y configurado:

```bash
# 1. Obtener el ID del Security Group
aws ec2 describe-instances --instance-ids i-0b43f3119bec7c018 --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text

# 2. Agregar la regla (reemplaza sg-XXXXXXXXX con el ID obtenido)
aws ec2 authorize-security-group-ingress \
    --group-id sg-XXXXXXXXX \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0
```

---

## Verificación

Después de configurar el Security Group, verifica que funciona:

### Desde el navegador:
```
http://54.226.21.206:8000/docs
```

Deberías ver la documentación interactiva de FastAPI.

### Desde la terminal:
```bash
curl http://54.226.21.206:8000/docs
```

---

## ⚠️ Nota de Seguridad

**Para producción**, considera restringir el acceso:
- En lugar de `0.0.0.0/0`, usa tu IP específica
- O configura un Application Load Balancer con HTTPS
- O usa un VPN/bastion host

---

## Solución de Problemas

Si después de configurar el Security Group no funciona:

1. **Verifica que uvicorn esté corriendo:**
   ```bash
   ssh -i server_key.pem ec2-user@54.226.21.206 "ps aux | grep uvicorn"
   ```

2. **Revisa los logs:**
   ```bash
   ssh -i server_key.pem ec2-user@54.226.21.206 "tail -n 50 backend/app.log"
   ```

3. **Verifica que el puerto esté escuchando:**
   ```bash
   ssh -i server_key.pem ec2-user@54.226.21.206 "sudo netstat -tlnp | grep 8000"
   ```

4. **Reinicia el backend si es necesario:**
   ```bash
   ssh -i server_key.pem ec2-user@54.226.21.206 "sudo pkill uvicorn && cd backend/backend && nohup ../venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 > ../app.log 2>&1 &"
   ```
