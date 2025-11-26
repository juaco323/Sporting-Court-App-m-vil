$mainPath = 'c:\Users\jqnfu\Desktop\UNAB\3er año\2do semestre\Desarrollo web y movil\unab-sporting-court-main\unab-sporting-court-main\backend\main.py'
$content = Get-Content $mainPath -Raw

# Agregar import después de 'from database import'
if ($content -notmatch 'from oauth_routes import') {
    $content = $content -replace '(from database import engine, get_db)', "$1
from oauth_routes import router as oauth_router"
}

# Agregar router después del middleware
if ($content -notmatch 'app.include_router\(oauth_router\)') {
    $content = $content -replace '(\)\s+# ============ Root Endpoint ============)', ")

# Registrar rutas OAuth
app.include_router(oauth_router)

# ============ Root Endpoint ============"
}

$content | Out-File $mainPath -Encoding UTF8
Write-Host 'Archivo main.py actualizado correctamente'
