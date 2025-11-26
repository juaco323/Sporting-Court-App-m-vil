# 🔒 Guía para Subir el Proyecto a GitHub de Forma Segura

## ✅ Archivos Protegidos por .gitignore

### 🚨 CRÍTICO - Nunca se subirán:
- ✅ `.env` y `backend/.env` - Variables de entorno con secretos
- ✅ `*.db` y `*.sqlite` - Bases de datos SQLite con datos
- ✅ `venv/` y `backend/venv/` - Entorno virtual Python
- ✅ `__pycache__/` - Caché de Python
- ✅ `*.log` - Archivos de logs
- ✅ `*.pem`, `*.key`, `*.cert` - Certificados y claves
- ✅ `node_modules/` - Dependencias de Node.js

### ✅ SÍ se subirán (son seguros):
- ✅ `.env.example` y `backend/.env.example` - Plantillas sin datos reales
- ✅ Todo el código fuente (`.py`, `.js`, `.html`, `.css`)
- ✅ `requirements.txt` - Lista de dependencias
- ✅ `Dockerfile` y `docker-compose.yml` - Configuración de Docker
- ✅ `alembic/` - Sistema de migraciones
- ✅ Documentación (`.md`)

---

## 📋 CHECKLIST ANTES DE SUBIR

### 1. Verificar que .gitignore está funcionando
```powershell
# Ver qué archivos se subirían
git status

# Verificar que NO aparecen:
# ❌ .env
# ❌ backend/.env
# ❌ sporting_court.db
# ❌ venv/
# ❌ __pycache__/
```

### 2. Revisar archivos sensibles
```powershell
# Buscar archivos .env que no deberían estar
git ls-files | findstr "\.env$"

# Buscar bases de datos
git ls-files | findstr "\.db$"

# Si aparece alguno, agregarlo al .gitignore
```

### 3. Verificar que los .example existen
```powershell
# Deben existir estos archivos:
ls .env.example
ls backend\.env.example
```

---

## 🚀 PASOS PARA SUBIR A GITHUB

### Opción 1: Primera vez (Repositorio Nuevo)

```powershell
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Ver qué se va a subir (verificar que no hay archivos sensibles)
git status

# 4. Hacer el primer commit
git commit -m "feat: Integración completa Backend-Frontend con Docker y Alembic

- Backend FastAPI con autenticación JWT
- Sistema de migraciones con Alembic
- Dockerización completa (backend, db, frontend)
- Integración frontend Vue.js con API REST
- CRUD completo de canchas y reservas
- Documentación automática con Swagger"

# 5. Crear repositorio en GitHub (desde la web github.com)
# Luego conectarlo:

# 6. Agregar el remote
git remote add origin https://github.com/TU_USUARIO/unab-sporting-court.git

# 7. Subir a GitHub
git push -u origin main
# O si tu rama es master:
git push -u origin master
```

---

### Opción 2: Actualizar Repositorio Existente

```powershell
# 1. Verificar el estado
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "feat: Integración Backend-Frontend completada"

# 4. Push
git push origin integracionBackend
# O la rama que estés usando
```

---

## 🔍 VERIFICACIONES DE SEGURIDAD

### Antes de hacer push, verifica:

```powershell
# 1. ¿Qué archivos se van a subir?
git diff --cached --name-only

# 2. ¿Hay algún .env?
git diff --cached --name-only | findstr "\.env$"
# No debería mostrar nada

# 3. ¿Hay bases de datos?
git diff --cached --name-only | findstr "\.db$"
# No debería mostrar nada

# 4. Ver el contenido de un archivo específico antes de subirlo
git show :.env.example
```

---

## ⚠️ SI ACCIDENTALMENTE SUBISTE UN ARCHIVO SENSIBLE

### Eliminar archivo del historial de Git:

```powershell
# 1. Eliminar del staging
git rm --cached .env
git rm --cached backend/.env
git rm --cached *.db

# 2. Commit
git commit -m "fix: Eliminar archivos sensibles"

# 3. Push
git push origin integracionBackend

# 4. Si ya se subió en commits anteriores, usar git-filter-branch
# (más complejo, mejor prevenir)
```

### Si el archivo YA está en el historial:

```powershell
# Opción A: Reescribir historia (CUIDADO - solo si no han clonado)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Opción B: BFG Repo-Cleaner (más fácil)
# Descargar de: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --delete-files *.db
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Luego force push (PELIGROSO)
git push origin --force --all
```

---

## 📝 ARCHIVO README.md PARA GITHUB

Crea o actualiza el README.md con instrucciones de configuración:

```markdown
# UNAB Sporting Court

Sistema de reservas de canchas deportivas con FastAPI y Vue.js

## 🚀 Configuración

1. Clonar el repositorio
2. Copiar archivos de configuración:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
3. Editar las variables de entorno con tus valores
4. Seguir instrucciones en INTEGRACION_COMPLETADA.md

## ⚠️ IMPORTANTE
**Nunca subas archivos .env con datos reales**
```

---

## 🔐 BUENAS PRÁCTICAS

### 1. Usar .env.example
```bash
# .env.example (SÍ se sube)
SECRET_KEY=tu-secret-key-aqui-cambiar-en-produccion
DATABASE_URL=sqlite:///./sporting_court.db
```

### 2. Documentar variables necesarias
En el README.md, lista todas las variables que deben configurarse.

### 3. GitHub Secrets (para CI/CD)
Si usas GitHub Actions, guarda secretos en:
- Settings → Secrets and variables → Actions → New repository secret

### 4. .gitignore desde el inicio
Siempre crea .gitignore ANTES del primer commit.

---

## 📊 VERIFICAR QUÉ SE SUBIÓ

Después de hacer push:

```powershell
# Ver archivos en el repositorio remoto
git ls-tree -r main --name-only

# O visita GitHub y revisa los archivos
```

---

## 🆘 COMANDOS ÚTILES

```powershell
# Ver archivos ignorados
git status --ignored

# Ver tamaño del repositorio
git count-objects -vH

# Ver historial de un archivo
git log --follow -- .env

# Verificar si un archivo está en Git
git ls-files | findstr "archivo.ext"

# Limpiar archivos no rastreados
git clean -fd

# Ver ramas
git branch -a

# Cambiar de rama
git checkout nombre-rama

# Crear nueva rama
git checkout -b nueva-rama
```

---

## ✅ CHECKLIST FINAL

Antes de hacer `git push`, verifica:

- [ ] `.gitignore` está en su lugar
- [ ] No hay archivos `.env` en `git status`
- [ ] No hay archivos `.db` en `git status`
- [ ] No hay carpeta `venv/` en `git status`
- [ ] Los archivos `.env.example` SÍ están incluidos
- [ ] El README.md tiene instrucciones de configuración
- [ ] Has revisado `git diff --cached`
- [ ] Has probado clonar en otra carpeta para verificar

---

## 📚 RECURSOS

- [Git Documentation](https://git-scm.com/doc)
- [GitHub .gitignore Templates](https://github.com/github/gitignore)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

## 💡 TIPS

1. **Nunca** hagas `git add -f` para forzar archivos ignorados
2. **Revisa** siempre `git status` antes de commit
3. **Usa** ramas para features nuevos
4. **Escribe** mensajes de commit descriptivos
5. **Haz** push frecuentemente para no perder trabajo

---

**¡Listo para subir de forma segura! 🚀**

_Última actualización: 10 de Noviembre, 2025_
