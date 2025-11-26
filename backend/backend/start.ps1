# Script de inicio rápido para el backend
Write-Host "🚀 Iniciando UNAB Sporting Court Backend..." -ForegroundColor Cyan
Write-Host ""

# Verificar si existe el entorno virtual
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creando entorno virtual..." -ForegroundColor Yellow
    py -m venv venv
}

# Activar entorno virtual
Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Instalar/actualizar dependencias
Write-Host "📥 Verificando dependencias..." -ForegroundColor Yellow
& .\venv\Scripts\python.exe -m pip install --quiet --upgrade pip
& .\venv\Scripts\python.exe -m pip install --quiet -r requirements.txt

# Verificar si existe la base de datos
if (-not (Test-Path "sporting_court.db")) {
    Write-Host "🗄️  Inicializando base de datos..." -ForegroundColor Yellow
    & .\venv\Scripts\python.exe init_db.py
}

Write-Host ""
Write-Host "✅ Todo listo!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Iniciando servidor en http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 Documentación: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor usando la ruta completa al Python del venv
& .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
