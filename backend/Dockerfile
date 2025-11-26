# ==========================================
# Dockerfile para Frontend
# ==========================================
# Build stage con Node.js
FROM node:18-alpine AS builder

# Metadata
LABEL maintainer="UNAB Sporting Court"
LABEL description="Frontend para sistema de reservas deportivas"

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar archivos del proyecto
COPY . .

# Production stage con Nginx
FROM nginx:alpine

# Copiar archivos estáticos desde builder
COPY --from=builder /app /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Healthcheck para verificar que Nginx está funcionando
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
