// 🧪 Script de Prueba Rápida - Sistema de Reservas de Canchas
// Copia y pega este script en la consola del navegador (F12) para probar el sistema

console.log('🧪 Iniciando pruebas del sistema...\n');

// 1. Limpiar datos anteriores
console.log('📝 Paso 1: Limpiando datos anteriores...');
localStorage.clear();
console.log('✅ localStorage limpiado\n');

// 2. Verificar estado inicial
console.log('📝 Paso 2: Verificando estado inicial...');
console.log('Usuarios registrados:', localStorage.getItem('registeredUsers') || 'ninguno');
console.log('Reservas:', localStorage.getItem('courtReservations') || 'ninguna');
console.log('✅ Estado inicial verificado\n');

// 3. Simular registro de usuarios
console.log('📝 Paso 3: Simulando registro de usuarios...');
const users = [
    {
        rut: '11111111-1',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        password: '123456'
    },
    {
        rut: '22222222-2',
        nombre: 'María',
        apellido: 'González',
        email: 'maria@example.com',
        password: '654321'
    }
];
localStorage.setItem('registeredUsers', JSON.stringify(users));
console.log('✅ Usuarios registrados:', users.length);
console.log('   - Juan Pérez (RUT: 11111111-1, Password: 123456)');
console.log('   - María González (RUT: 22222222-2, Password: 654321)\n');

// 4. Simular reservas de Juan
console.log('📝 Paso 4: Simulando reservas de Juan Pérez...');
const reservationsJuan = [
    {
        id: 'R' + Date.now(),
        codigo: 'AB1234',
        usuario: 'Juan Pérez',
        canchaId: 'CAN-01',
        cancha: 'Cancha Central #1',
        deporte: 'Fútbol',
        fecha: '2025-10-20',
        hora: '15:00',
        precio: 45000,
        estado: 'Reservada'
    },
    {
        id: 'R' + (Date.now() + 1),
        codigo: 'CD5678',
        usuario: 'Juan Pérez',
        canchaId: 'CAN-04',
        cancha: 'Pista Tenis #1',
        deporte: 'Tenis',
        fecha: '2025-10-21',
        hora: '16:00',
        precio: 25000,
        estado: 'Reservada'
    }
];
localStorage.setItem('courtReservations', JSON.stringify(reservationsJuan));
console.log('✅ Reservas de Juan creadas:', reservationsJuan.length);
console.log('   - Fútbol: Cancha Central #1 (2025-10-20 15:00)');
console.log('   - Tenis: Pista Tenis #1 (2025-10-21 16:00)\n');

// 5. Instrucciones de prueba manual
console.log('🎯 INSTRUCCIONES DE PRUEBA MANUAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('✅ AHORA RECARGA LA PÁGINA (F5) y sigue estos pasos:');
console.log('');
console.log('1️⃣ INICIAR SESIÓN COMO JUAN:');
console.log('   RUT: 11111111-1');
console.log('   Contraseña: 123456');
console.log('   → Deberías ver el contador en (2) reservas');
console.log('');
console.log('2️⃣ IR A "MIS RESERVAS":');
console.log('   → Deberías ver 2 reservas de Juan');
console.log('   → Cancha de Fútbol y Tenis');
console.log('');
console.log('3️⃣ CREAR UNA NUEVA RESERVA:');
console.log('   → Selecciona Pádel');
console.log('   → Elige cualquier cancha, fecha y hora');
console.log('   → Confirma la reserva');
console.log('   → El contador debe cambiar a (3)');
console.log('');
console.log('4️⃣ CERRAR SESIÓN');
console.log('');
console.log('5️⃣ INICIAR SESIÓN COMO MARÍA:');
console.log('   RUT: 22222222-2');
console.log('   Contraseña: 654321');
console.log('   → El contador debe mostrar (0) reservas');
console.log('');
console.log('6️⃣ IR A "MIS RESERVAS":');
console.log('   → Debe estar vacío');
console.log('   → NO debe ver las reservas de Juan');
console.log('');
console.log('7️⃣ CREAR RESERVA COMO MARÍA:');
console.log('   → Haz una reserva cualquiera');
console.log('   → El contador debe cambiar a (1)');
console.log('');
console.log('8️⃣ CERRAR SESIÓN Y VOLVER A LOGIN COMO JUAN:');
console.log('   → Juan debe seguir viendo sus 3 reservas');
console.log('   → María debe seguir viendo solo su 1 reserva');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('💡 PARA VER LOGS DETALLADOS:');
console.log('   Mantén la consola abierta mientras usas la app');
console.log('   Verás mensajes como:');
console.log('   - "Login exitoso: [Nombre]"');
console.log('   - "Reserva creada: {...}"');
console.log('   - "Reservas del usuario: X"');
console.log('');
console.log('🐛 SI ALGO NO FUNCIONA:');
console.log('   1. Verifica que no haya errores en consola');
console.log('   2. Ejecuta: JSON.parse(localStorage.getItem("courtReservations"))');
console.log('   3. Ejecuta: JSON.parse(localStorage.getItem("registeredUsers"))');
console.log('');
console.log('✅ ¡LISTO! Ahora recarga la página (F5) y empieza las pruebas.');
