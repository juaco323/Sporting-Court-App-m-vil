# Alembic - Migraciones de Base de Datos

## 📋 Configuración Completada

Alembic ha sido instalado y configurado correctamente para manejar las migraciones de base de datos del proyecto.

## 🚀 Comandos Útiles

### Crear una nueva migración (autogenerada)
```bash
alembic revision --autogenerate -m "Descripción del cambio"
```

### Aplicar todas las migraciones pendientes
```bash
alembic upgrade head
```

### Ver el historial de migraciones
```bash
alembic history
```

### Ver el estado actual
```bash
alembic current
```

### Revertir la última migración
```bash
alembic downgrade -1
```

### Revertir todas las migraciones
```bash
alembic downgrade base
```

## 📁 Estructura

```
backend/
├── alembic/
│   ├── versions/          # Archivos de migración
│   ├── env.py            # Configuración del entorno
│   ├── script.py.mako    # Template para nuevas migraciones
│   └── README            # Documentación
├── alembic.ini           # Configuración principal
└── models.py             # Modelos de SQLAlchemy
```

## 🔧 Configuración

- **Base de datos**: Configurada desde `DATABASE_URL` en `.env`
- **Modelos**: Importados desde `models.py`
- **Metadata**: Usa `Base.metadata` para autogenerate

## 💡 Ejemplo de Flujo

1. **Modificar modelos** en `models.py`
2. **Crear migración**:
   ```bash
   alembic revision --autogenerate -m "Agregar campo telefono a User"
   ```
3. **Revisar migración** generada en `alembic/versions/`
4. **Aplicar migración**:
   ```bash
   alembic upgrade head
   ```

## ✅ Estado Actual

- ✅ Alembic instalado
- ✅ Configuración inicializada
- ✅ Integración con modelos completa
- ✅ Migración inicial creada

## 📝 Notas

- Las migraciones se generan automáticamente al detectar cambios en los modelos
- Siempre revisa las migraciones generadas antes de aplicarlas
- En producción, ejecuta las migraciones antes de desplegar el código nuevo
