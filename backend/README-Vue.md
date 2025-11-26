# Sistema de Reservas de Canchas - Vue.js

Esta es una versión completa del sistema de reservas de canchas deportivas desarrollada con Vue.js 3.

## Archivos de la versión Vue.js

- `vue-index.html` - Archivo principal HTML con Vue.js
- `vue-app.js` - Lógica de la aplicación Vue.js
- `vue-styles.css` - Estilos adaptados para Vue.js

## Características implementadas

### 🔐 Sistema de Autenticación
- Login y registro de usuarios
- Validación de formularios
- Estado reactivo del usuario

### 🏟️ Gestión de Deportes y Canchas
- Selección de deportes (Fútbol, Tenis, Pádel)
- Visualización de canchas disponibles
- Información detallada de cada cancha
- Precios y características

### 📅 Sistema de Reservas
- Calendario interactivo
- Selección de fechas y horarios
- Prevención de reservas en fechas pasadas
- Verificación de disponibilidad

### 📋 Gestión de Reservas
- Listado de reservas del usuario
- Cancelación de reservas
- Modificación de horarios
- Códigos únicos de reserva

### ✅ Confirmación y Éxito
- Modales de confirmación
- Página de éxito con detalles
- Descarga y compartir reservas
- Información importante

## Mejoras de Vue.js vs Vanilla JavaScript

### 🚀 Reactividad
- Estado reactivo automático
- Actualizaciones de UI en tiempo real
- Binding bidireccional en formularios

### 🎯 Gestión de Estado
- Estado centralizado en data()
- Computed properties para datos derivados
- Watchers para efectos secundarios

### 📱 Mejores Prácticas
- Componente único con separación de responsabilidades
- Métodos organizados por funcionalidad
- Eventos manejados declarativamente

### 🔄 Navegación Fluida
- Navegación basada en estado reactivo
- Transiciones automáticas entre vistas
- Historia de navegación limpia

## Cómo usar

1. **Abrir la aplicación**:
   ```
   Abrir vue-index.html en el navegador
   ```

2. **Autenticación**:
   - Registrarse con datos válidos
   - O iniciar sesión (cualquier RUT y contraseña)

3. **Reservar una cancha**:
   - Seleccionar un deporte
   - Elegir una cancha
   - Seleccionar fecha y hora
   - Confirmar reserva

4. **Gestionar reservas**:
   - Ver en "Mis Reservas"
   - Modificar o cancelar reservas
   - Descargar comprobantes

## Tecnologías utilizadas

- **Vue.js 3** - Framework reactivo
- **Lucide Icons** - Iconografía
- **Bootstrap 5** - Sistema de grid
- **CSS Custom Properties** - Theming
- **LocalStorage** - Persistencia de datos

## Estructura de datos

### Usuario
```javascript
{
  rut: "12.345.678-9",
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@email.com"
}
```

### Reserva
```javascript
{
  id: "R123456",
  codigo: "AB1234",
  usuario: "Juan Pérez",
  canchaId: "CAN-01",
  cancha: "Cancha Central #1",
  deporte: "Fútbol",
  fecha: "2025-10-20",
  hora: "18:00",
  precio: 45000,
  estado: "Reservada"
}
```

## Características técnicas de Vue.js

### Computed Properties
- `calendarDays` - Generación dinámica del calendario
- `availableTimeSlots` - Horarios disponibles según reservas

### Watchers
- `reservations` - Persiste automáticamente en localStorage
- `currentView` - Reinicializa iconos al cambiar vista

### Lifecycle Hooks
- `mounted()` - Inicialización de iconos y carga de datos

### Event Handling
- Eventos de formulario con `@submit.prevent`
- Navegación con `@click`
- Modales con `@click.self` para cerrar

### Conditional Rendering
- `v-if` / `v-else` para vistas y estados
- `v-show` para elementos que se ocultan/muestran

### List Rendering
- `v-for` con keys únicos
- Renderizado eficiente de listas grandes

## Ventajas sobre la versión original

1. **Menos código** - Vue maneja el DOM automáticamente
2. **Más mantenible** - Estructura organizadas en methods
3. **Mejor performance** - Actualizaciones selectivas del DOM
4. **Más escalable** - Fácil agregar nuevas características
5. **Debugging más fácil** - Vue DevTools integration
6. **Estado predecible** - Flujo unidireccional de datos

## Próximas mejoras posibles

- [ ] Componentes separados (Header, Calendar, etc.)
- [ ] Vue Router para navegación
- [ ] Pinia/Vuex para gestión de estado
- [ ] API REST integration
- [ ] Autenticación JWT
- [ ] Tests unitarios con Jest/Vitest
- [ ] PWA capabilities
- [ ] Internacionalización (i18n)

¡La aplicación está lista para usar! 🎉