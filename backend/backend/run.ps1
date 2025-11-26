# Script simple para iniciar el backend
Write-Host "Iniciando backend..." -ForegroundColor Cyan

# Activar entorno virtual si existe
if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
}

# Iniciar servidor
& .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
