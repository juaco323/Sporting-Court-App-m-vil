$modelsPath = 'c:\Users\jqnfu\Desktop\UNAB\3er año\2do semestre\Desarrollo web y movil\unab-sporting-court-main\unab-sporting-court-main\backend\models.py'
$content = Get-Content $modelsPath -Raw

# Agregar campo rut después de full_name
if ($content -notmatch 'rut = Column') {
    $content = $content -replace '(full_name = Column\(String\))', "$1
    rut = Column(String)"
}

$content | Out-File $modelsPath -Encoding UTF8
Write-Host 'Campo rut agregado al modelo User'
