// Estado global de la aplicación
// Estado global de la aplicación
const appState = {
    currentView: 'auth',
    user: null,
    selectedSport: '',
    selectedCourt: null,
    selectedDate: null,
    selectedTime: '',
    reservations: [],  // SIEMPRE empezar vacío
    editingReservation: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

// Datos mock
const sportsData = [
    {
        name: 'Fútbol',
        description: 'Canchas de fútbol 11 y fútbol 7',
        icon: '⚽',
        available: 3,
        color: 'green'
    },
    {
        name: 'Tenis',
        description: 'Canchas de tenis individuales y dobles',
        icon: '🎾',
        available: 3,
        color: 'orange'
    },
    {
        name: 'Pádel',
        description: 'Canchas de pádel techadas y al aire libre',
        icon: '🏓',
        available: 3,
        color: 'purple'
    }
];

const courtsData = {
    'Fútbol': [
        {
            id: 'CAN-01',
            name: 'Cancha Central #1',
            description: 'Cancha de fútbol 11 con césped sintético de última generación',
            capacity: 22,
            rating: 4.8,
            pricePerHour: 45000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Sintético', 'Marcador Electrónico'],
            available: true
        },
        {
            id: 'CAN-02',
            name: 'Cancha Norte #2',
            description: 'Cancha de fútbol 7 ideal para partidos más íntimos',
            capacity: 14,
            rating: 4.6,
            pricePerHour: 35000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Natural', 'Gradas Cubiertas'],
            available: true
        },
        {
            id: 'CAN-03',
            name: 'Cancha Sur #3',
            description: 'Cancha multiuso con césped híbrido',
            capacity: 22,
            rating: 4.7,
            pricePerHour: 40000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Híbrido', 'Sistema de Riego'],
            available: false
        }
    ],
    'Tenis': [
        {
            id: 'CAN-04',
            name: 'Pista Tenis #1',
            description: 'Cancha de tenis profesional con superficie de polvo de ladrillo',
            capacity: 4,
            rating: 4.9,
            pricePerHour: 25000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Polvo de Ladrillo', 'Red Profesional'],
            available: true
        },
        {
            id: 'CAN-05',
            name: 'Pista Tenis #2',
            description: 'Cancha de tenis con superficie dura, ideal para principiantes',
            capacity: 4,
            rating: 4.5,
            pricePerHour: 20000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Superficie Dura', 'Gradas'],
            available: true
        },
        {
            id: 'CAN-06',
            name: 'Pista Tenis #3',
            description: 'Cancha de tenis cubierta para jugar en cualquier clima',
            capacity: 4,
            rating: 4.8,
            pricePerHour: 30000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Techada', 'Climatizada', 'Superficie Sintética'],
            available: true
        }
    ],
    'Pádel': [
        {
            id: 'CAN-07',
            name: 'Pista Pádel #1',
            description: 'Cancha de pádel techada con cristales panorámicos',
            capacity: 4,
            rating: 4.7,
            pricePerHour: 28000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Techada', 'Cristales Panorámicos', 'Aire Acondicionado'],
            available: true
        },
        {
            id: 'CAN-08',
            name: 'Pista Pádel #2',
            description: 'Cancha de pádel al aire libre con césped sintético',
            capacity: 4,
            rating: 4.4,
            pricePerHour: 22000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Al Aire Libre', 'Césped Sintético'],
            available: true
        },
        {
            id: 'CAN-09',
            name: 'Pista Pádel #3',
            description: 'Cancha de pádel premium con sistema de sonido',
            capacity: 4,
            rating: 4.9,
            pricePerHour: 35000,
            features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Premium', 'Sistema de Sonido', 'Gradas VIP'],
            available: false
        }
    ]
};

// Main API Functions
async function loadCanchas() {
    try {
        // En una aplicación real, esto sería una llamada a API
        // Por ahora retornamos los datos que ya tenemos
        return Object.values(courtsData).flat();
    } catch (error) {
        console.error('Error cargando canchas:', error);
        return [];
    }
}

function renderCanchas(deporte = '') {
    const courtContainer = document.getElementById('courts-grid');
    if (!courtContainer) {
        console.error('No se encontró el contenedor courts-grid');
        return;
    }
    
    let courts = [];
    if (deporte && courtsData[deporte]) {
        courts = courtsData[deporte];
        console.log(`Renderizando ${courts.length} canchas de ${deporte}`);
    } else {
        courts = Object.values(courtsData).flat();
        console.log(`Renderizando todas las canchas: ${courts.length}`);
    }
    
    courtContainer.innerHTML = courts.map(court => {
        // Determinar el deporte de la cancha
        const sport = Object.keys(courtsData).find(key => 
            courtsData[key].some(c => c.id === court.id)
        );
        
        // Colores y configuración por deporte
        const sportConfig = {
            'Fútbol': { color: '#22c55e', emoji: '⚽', bg: '#22c55e' },
            'Tenis': { color: '#f97316', emoji: '🎾', bg: '#f97316' },
            'Pádel': { color: '#8b5cf6', emoji: '🏓', bg: '#8b5cf6' }
        };
        
        const config = sportConfig[sport] || { color: '#6b7280', emoji: '🏟️', bg: '#6b7280' };
        
        return `
            <div class="card h-100" style="width: 18rem; cursor: pointer;" onclick="selectCourt(${JSON.stringify(court).replace(/"/g, '&quot;')})">
                <div class="position-relative">
                    <div class="card-img-top d-flex align-items-center justify-content-center" 
                         style="height: 140px; background: linear-gradient(135deg, ${config.bg}20, ${config.bg}40); border-bottom: 1px solid #dee2e6;">
                        <div class="text-center">
                            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${config.emoji}</div>
                            <h6 class="mb-0 fw-semibold" style="color: ${config.color};">${sport}</h6>
                        </div>
                    </div>
                    ${!court.available ? '<div class="position-absolute top-0 end-0 m-2"><span class="badge bg-secondary">No Disponible</span></div>' : ''}
                </div>
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold mb-2">${court.name}</h5>
                    <p class="card-text text-muted small mb-3">${court.description}</p>
                    
                    <div class="court-details mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <i data-lucide="users" style="width: 16px; height: 16px;" class="me-2 text-muted"></i>
                            <span class="small text-muted">Hasta ${court.capacity} personas</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i data-lucide="star" style="width: 16px; height: 16px; color: #fbbf24; fill: currentColor;" class="me-2"></i>
                            <span class="small text-muted">${court.rating} estrellas</span>
                        </div>
                    </div>
                    
                    <div class="features mb-3">
                        <div class="d-flex flex-wrap gap-1">
                            ${court.features.slice(0, 2).map(feature => 
                                `<span class="badge bg-light text-dark small">${feature}</span>`
                            ).join('')}
                            ${court.features.length > 2 ? `<span class="badge bg-light text-muted small">+${court.features.length - 2}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="mt-auto">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="availability-status">
                                <div class="d-flex align-items-center">
                                    <div class="availability-dot me-2" 
                                         style="width: 8px; height: 8px; border-radius: 50%; background-color: ${court.available ? '#22c55e' : '#ef4444'};"></div>
                                    <span class="small ${court.available ? 'text-success' : 'text-danger'}">${court.available ? 'Disponible' : 'No disponible'}</span>
                                </div>
                            </div>
                            <div class="price-display text-end">
                                <div class="fw-bold" style="color: ${config.color};">${formatPrice(court.pricePerHour)}</div>
                                <div class="small text-muted">por hora</div>
                            </div>
                        </div>
                        
                        <a href="#" 
                           class="btn ${court.available ? 'btn-dark' : 'btn-outline-secondary'} w-100" 
                           ${!court.available ? 'disabled' : ''}
                           onclick="event.preventDefault(); event.stopPropagation(); selectCourt(${JSON.stringify(court).replace(/"/g, '&quot;')})">
                            ${court.available ? 'Reservar' : 'No Disponible'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function reservarCancha(canchaId, fecha, hora, usuario) {
    console.log('🎯 CREANDO RESERVA REAL (no validación):', { canchaId, fecha, hora, usuario });
    
    // VERIFICAR que no exista ya una reserva idéntica (prevenir duplicados)
    const existingReservation = appState.reservations.find(r => 
        r.canchaId === canchaId && 
        r.fecha === fecha && 
        r.hora === hora &&
        r.usuario === usuario &&
        r.estado === 'Reservada'
    );
    
    if (existingReservation) {
        console.log('⚠️ Reserva idéntica ya existe, retornando la existente:', existingReservation);
        return { success: true, reservation: existingReservation };
    }
    
    const reservationId = generateReservationId();
    const reservation = {
        id: reservationId,
        usuario: usuario || appState.user?.name || 'Usuario',
        canchaId: canchaId,
        fecha: fecha,
        hora: hora,
        estado: 'Reservada',
        fechaCreacion: new Date().toISOString()
    };
    
    console.log('✅ Agregando nueva reserva al estado:', reservation);
    appState.reservations.push(reservation);
    console.log('📋 Total reservas después de agregar:', appState.reservations.length);
    
    return { success: true, reservation: reservation };
}

function validarDisponibilidad(canchaId, fecha, hora) {
    console.log('🔍 Validando disponibilidad para:', { canchaId, fecha, hora });
    
    // 1. Verificar si la fecha es válida (no pasada y disponible)
    const selectedDate = createLocalDate(fecha); // Usar función segura para fechas
    const dateAvailable = isDateAvailable(selectedDate);
    
    if (!dateAvailable) {
        console.log('❌ Fecha no disponible');
        return false;
    }
    
    // 2. Verificar si la cancha existe y está disponible
    const allCourts = Object.values(courtsData).flat();
    const court = allCourts.find(c => c.id === canchaId);
    
    if (!court || !court.available) {
        console.log('❌ Cancha no encontrada o no disponible');
        return false;
    }
    
    // 3. Verificar si el horario no está ocupado por otra reserva ACTIVA
    // IMPORTANTE: Solo considerar reservas de LA MISMA CANCHA
    console.log('🔍 Buscando conflictos para cancha específica:', canchaId);
    console.log('📋 Total reservas en sistema:', appState.reservations.length);
    
    // Filtrar reservas para análisis
    const todasLasReservas = appState.reservations.filter(r => r.fecha === fecha && r.hora === hora);
    console.log(`📋 Reservas para fecha ${fecha} hora ${hora} (todas las canchas):`, todasLasReservas);
    
    const reservasEstaCancha = appState.reservations.filter(r => r.canchaId === canchaId);
    console.log(`📋 Reservas para cancha ${canchaId} (todas las fechas):`, reservasEstaCancha);
    
    const existingReservation = appState.reservations.find(r => 
        r.canchaId === canchaId && 
        r.fecha === fecha && 
        r.hora === hora &&
        (r.estado === 'Reservada' || r.estado === 'Confirmada') // Solo reservas activas
    );
    
    if (existingReservation) {
        console.log('❌ Horario ya ocupado por reserva activa EN ESTA CANCHA:', existingReservation.id);
        return false;
    }
    
    console.log('✅ Horario disponible para cancha', canchaId);
    return true;
}

function listarReservas(filtros = {}) {
    let reservas = [...appState.reservations];
    
    // Por defecto, excluir reservas canceladas a menos que se solicite específicamente
    if (!filtros.incluirCanceladas) {
        reservas = reservas.filter(r => r.estado !== 'Cancelada');
    }
    
    // Aplicar filtros adicionales
    if (filtros.usuario) {
        reservas = reservas.filter(r => r.usuario.toLowerCase().includes(filtros.usuario.toLowerCase()));
    }
    
    if (filtros.estado) {
        reservas = reservas.filter(r => r.estado === filtros.estado);
    }
    
    if (filtros.deporte) {
        const cortesDeporte = Object.values(courtsData).flat()
            .filter(c => c.id.includes(filtros.deporte) || 
                        Object.keys(courtsData).find(key => 
                            key === filtros.deporte && courtsData[key].some(court => court.id === c.id)
                        ));
        const courtIds = cortesDeporte.map(c => c.id);
        reservas = reservas.filter(r => courtIds.includes(r.canchaId));
    }
    
    if (filtros.fecha) {
        reservas = reservas.filter(r => r.fecha === filtros.fecha);
    }
    
    // Ordenar por fecha y hora
    reservas.sort((a, b) => {
        const dateCompare = createLocalDate(a.fecha).getTime() - createLocalDate(b.fecha).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.hora.localeCompare(b.hora);
    });
    
    return reservas;
}

function cancelarReserva(id) {
    console.log('🗑️ Cancelando reserva:', id);
    const reservationIndex = appState.reservations.findIndex(r => r.id === id);
    
    if (reservationIndex === -1) {
        console.log('❌ Reserva no encontrada:', id);
        return { success: false, message: 'Reserva no encontrada' };
    }
    
    const reservation = appState.reservations[reservationIndex];
    console.log('📋 Reserva antes de cancelar:', reservation);
    
    // Marcar como cancelada
    appState.reservations[reservationIndex].estado = 'Cancelada';
    appState.reservations[reservationIndex].fechaCancelacion = new Date().toISOString();
    
    console.log('✅ Reserva cancelada:', appState.reservations[reservationIndex]);
    console.log('📋 Total de reservas:', appState.reservations.length);
    console.log('📋 Reservas activas:', appState.reservations.filter(r => r.estado !== 'Cancelada').length);
    
    return { success: true, message: 'Reserva cancelada exitosamente' };
}

function filtrarPorDeporte(deporte) {
    appState.selectedSport = deporte;
    renderCanchas(deporte);
    renderReservations();
}

function filtrarPorFecha(fecha) {
    const reservasFiltradas = listarReservas({ fecha: fecha });
    
    // Actualizar la vista de reservas con el filtro aplicado
    const reservationsContainer = document.getElementById('reservations-content');
    if (!reservationsContainer) return;
    
    if (reservasFiltradas.length === 0) {
        reservationsContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar-x"></i>
                <h3>No hay reservas para ${formatDateSafe(fecha)}</h3>
                <p>No se encontraron reservas para la fecha seleccionada.</p>
                <button class="btn btn-outline" onclick="renderReservations()">
                    Ver todas las reservas
                </button>
            </div>
        `;
    } else {
        reservationsContainer.innerHTML = `
            <div class="reservations-list">
                ${reservasFiltradas.map(reservation => {
                    const court = Object.values(courtsData).flat().find(c => c.id === reservation.canchaId);
                    const sport = Object.keys(courtsData).find(key => 
                        courtsData[key].some(c => c.id === reservation.canchaId)
                    );
                    
                    return `
                        <div class="reservation-card">
                            <div class="reservation-content">
                                <div class="reservation-left">
                                    <div class="reservation-emoji">${getSportIcon(sport)}</div>
                                    <div class="reservation-details">
                                        <h3>${court ? court.name : 'Cancha no encontrada'}</h3>
                                        <p class="sport">${sport}</p>
                                        <div class="reservation-meta">
                                            <div class="meta-item">
                                                <i data-lucide="calendar"></i>
                                                <span>${formatDateSafe(reservation.fecha)}</span>
                                            </div>
                                            <div class="meta-item">
                                                <i data-lucide="clock"></i>
                                                <span>${reservation.hora}</span>
                                            </div>
                                            <div class="meta-item">
                                                <i data-lucide="hash"></i>
                                                <span>ID: ${reservation.canchaId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="reservation-right">
                                    <span class="badge ${reservation.estado === 'Reservada' ? 'badge-default' : 'badge-secondary'}">
                                        ${reservation.estado}
                                    </span>
                                    ${reservation.estado !== 'Cancelada' ? `
                                        <div class="reservation-actions">
                                            <button class="btn btn-outline btn-sm" onclick="editReservation('${reservation.id}')">
                                                Cambiar
                                            </button>
                                            <button class="btn btn-destructive btn-sm" onclick="showCancelDialog('${reservation.id}')">
                                                Cancelar
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Additional utility functions for filtering
function filtrarReservasPorEstado(estado) {
    return listarReservas({ estado: estado });
}

function obtenerCanchasPorDeporte(deporte) {
    return courtsData[deporte] || [];
}

function obtenerReservasDeHoy() {
    const hoy = dateToString(new Date()); // Usar función segura para fechas
    return listarReservas({ fecha: hoy });
}

function obtenerProximasReservas() {
    const hoy = new Date();
    return listarReservas().filter(reserva => {
        const fechaReserva = createLocalDate(reserva.fecha); // Usar función segura para fechas
        return fechaReserva >= hoy;
    });
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(price);
}

function formatDate(date) {
    return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función utilitaria para crear fechas sin problemas de zona horaria
function createLocalDate(dateString) {
    // Si ya es un objeto Date, devolverlo
    if (dateString instanceof Date) {
        return dateString;
    }
    
    // Si es un string en formato YYYY-MM-DD, crear fecha local
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month - 1 porque JavaScript usa meses 0-indexados
    }
    
    // Fallback para otros formatos
    return new Date(dateString);
}

// Función para convertir Date a string YYYY-MM-DD sin problemas de zona horaria
function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función mejorada para formatear fechas evitando problemas de zona horaria
function formatDateSafe(dateInput) {
    let date;
    
    if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === 'string') {
        // Para strings en formato YYYY-MM-DD, crear fecha local sin zona horaria
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
            const [year, month, day] = dateInput.split('-').map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(dateInput);
        }
    } else {
        date = new Date(dateInput);
    }
    
    return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatRut(value) {
    const cleanRut = value.replace(/[^0-9kK]/g, '');
    if (cleanRut.length <= 1) return cleanRut;
    
    const rutBody = cleanRut.slice(0, -1);
    const rutDv = cleanRut.slice(-1);
    
    let formattedRut = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (rutDv) {
        formattedRut += `-${rutDv}`;
    }
    
    return formattedRut;
}

function getSportIcon(sport) {
    switch (sport) {
        case 'Fútbol': return '⚽';
        case 'Tenis': return '🎾';
        case 'Pádel': return '🏓';
        default: return '🏃';
    }
}

function isDateAvailable(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // No permitir fechas pasadas
    if (date < today) {
        return false;
    }
    
    // No permitir fechas muy lejanas (más de 30 días)
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    
    if (date > maxDate) {
        return false;
    }
    
    const dayOfMonth = date.getDate();
    
    // Bloquear días de mantenimiento (día 25 de cada mes)
    if (dayOfMonth === 25) {
        return false;
    }
    
    return true;
}

// Generate unique reservation ID
function generateReservationId() {
    const existingIds = appState.reservations.map(r => r.id);
    let counter = 1;
    let newId;
    
    do {
        newId = `R${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingIds.includes(newId));
    
    return newId;
}

// Utility function to clean duplicate reservations
function cleanDuplicateReservations() {
    const seen = new Set();
    const uniqueReservations = [];
    
    appState.reservations.forEach(reservation => {
        const key = `${reservation.canchaId}-${reservation.fecha}-${reservation.hora}-${reservation.usuario}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueReservations.push(reservation);
        } else {
            console.log('🧹 Eliminando reserva duplicada:', reservation);
        }
    });
    
    const originalLength = appState.reservations.length;
    appState.reservations = uniqueReservations;
    
    if (originalLength !== uniqueReservations.length) {
        console.log(`🧹 Limpieza completada: ${originalLength - uniqueReservations.length} duplicados eliminados`);
    }
}

// DOM manipulation functions
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    appState.currentView = sectionId.replace('-section', '');
}

function showTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('#dashboard-section .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function showAuthTab(tabName) {
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('#auth-section .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Auth functions
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rut = formData.get('rut') || document.getElementById('login-rut').value;
    
    appState.user = {
        rut: rut,
        nombre: 'Usuario',
        apellido: 'Demo',
        email: 'usuario@example.com'
    };
    
    document.getElementById('user-name').textContent = `${appState.user.nombre} ${appState.user.apellido}`;
    showSection('dashboard-section');
    renderSports();
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    appState.user = {
        rut: document.getElementById('register-rut').value,
        nombre: document.getElementById('register-nombre').value,
        apellido: document.getElementById('register-apellido').value,
        email: document.getElementById('register-email').value
    };
    
    document.getElementById('user-name').textContent = `${appState.user.nombre} ${appState.user.apellido}`;
    showSection('dashboard-section');
    renderSports();
}

function handleLogout() {
    appState.user = null;
    appState.selectedSport = '';
    appState.selectedCourt = null;
    appState.selectedDate = null;
    appState.selectedTime = '';
    appState.reservations = [];
    appState.editingReservation = null;
    
    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    
    showSection('auth-section');
}

// Sports rendering
function renderSports() {
    const grid = document.getElementById('sports-grid');
    grid.innerHTML = '';
    
    sportsData.forEach(sport => {
        const sportCard = document.createElement('div');
        sportCard.className = 'card h-100';
        sportCard.style.width = '18rem';
        sportCard.style.cursor = 'pointer';
        
        // Colores específicos para cada deporte basados en la imagen
        const sportColors = {
            'Fútbol': '#22c55e',
            'Tenis': '#f97316', 
            'Pádel': '#8b5cf6'
        };
        
        sportCard.innerHTML = `
            <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center mb-3">
                    <div class="sport-icon me-3" style="font-size: 2rem; color: ${sportColors[sport.name]};">
                        ${sport.icon}
                    </div>
                    <div class="sport-info">
                        <h5 class="card-title mb-1 fw-bold">${sport.name}</h5>
                        <p class="card-text text-muted small mb-0">${sport.description}</p>
                    </div>
                </div>
                
                <div class="mt-auto">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center">
                            <div class="availability-dot me-2" 
                                 style="width: 8px; height: 8px; border-radius: 50%; background-color: ${sportColors[sport.name]};"></div>
                            <span class="text-muted small">${sport.available} canchas disponibles</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-dark w-100" onclick="selectSport('${sport.name}')">
                        Ver Canchas
                    </button>
                </div>
            </div>
        `;
        
        sportCard.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                selectSport(sport.name);
            }
        };
        
        grid.appendChild(sportCard);
    });
}

function selectSport(sportName) {
    appState.selectedSport = sportName;
    // Clear previous court and date selection when changing sports
    appState.selectedCourt = null;
    appState.selectedDate = null;
    appState.selectedTime = null;
    
    document.getElementById('sport-icon').textContent = getSportIcon(sportName);
    document.getElementById('sport-title').textContent = `Canchas de ${sportName}`;
    showSection('court-selection-section');
    renderCourts();
}

// Courts rendering
function renderCourts() {
    renderCanchas(appState.selectedSport);
}

function selectCourt(court) {
    appState.selectedCourt = court;
    // Clear previous date and time selection when changing courts
    appState.selectedDate = null;
    appState.selectedTime = null;
    
    document.getElementById('calendar-sport-icon').textContent = getSportIcon(appState.selectedSport);
    document.getElementById('calendar-court-title').textContent = 
        (appState.editingReservation ? 'Editar Reserva - ' : '') + court.name;
    
    showSection('calendar-section');
    renderCalendar();
    renderCourtInfo();
}

// Calendar rendering
function renderCalendar() {
    const calendar = document.getElementById('calendar-widget');
    const today = new Date();
    const firstDay = new Date(appState.currentYear, appState.currentMonth, 1);
    const lastDay = new Date(appState.currentYear, appState.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    calendar.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-nav prev">
                <button class="calendar-nav-btn" onclick="changeMonth(-1)">
                    <i data-lucide="chevron-left"></i>
                </button>
            </div>
            <div class="calendar-title">
                ${monthNames[appState.currentMonth]} ${appState.currentYear}
            </div>
            <div class="calendar-nav next">
                <button class="calendar-nav-btn" onclick="changeMonth(1)">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        </div>
        <table class="calendar-table">
            <thead>
                <tr>
                    <th class="calendar-header-cell">Dom</th>
                    <th class="calendar-header-cell">Lun</th>
                    <th class="calendar-header-cell">Mar</th>
                    <th class="calendar-header-cell">Mié</th>
                    <th class="calendar-header-cell">Jue</th>
                    <th class="calendar-header-cell">Vie</th>
                    <th class="calendar-header-cell">Sáb</th>
                </tr>
            </thead>
            <tbody id="calendar-body"></tbody>
        </table>
    `;
    
    const calendarBody = document.getElementById('calendar-body');
    let currentDate = new Date(startDate.getTime()); // Usar getTime() para evitar problemas de referencia
    
    for (let week = 0; week < 6; week++) {
        const row = document.createElement('tr');
        
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement('td');
            cell.className = 'calendar-cell';
            
            const isCurrentMonth = currentDate.getMonth() === appState.currentMonth;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isSelected = appState.selectedDate && 
                currentDate.toDateString() === appState.selectedDate.toDateString();
            const isAvailable = isDateAvailable(currentDate);
            
            let classes = ['calendar-day'];
            if (!isCurrentMonth) classes.push('outside');
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            if (!isAvailable) classes.push('disabled');
            
            // Crear una nueva fecha para evitar problemas de referencia
            const cellDate = new Date(currentDate.getTime());
            const dateStr = dateToString(cellDate); // Usar función segura para fechas
            
            cell.innerHTML = `
                <button 
                    class="${classes.join(' ')}" 
                    onclick="selectDate('${dateStr}')"
                    ${!isAvailable ? 'disabled' : ''}
                    data-date="${dateStr}"
                >
                    ${currentDate.getDate()}
                </button>
            `;
            
            row.appendChild(cell);
            
            // Avanzar al siguiente día de forma segura
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }
        
        calendarBody.appendChild(row);
    }
    
    lucide.createIcons();
    updateSelectedDateInfo();
}

function changeMonth(direction) {
    appState.currentMonth += direction;
    
    if (appState.currentMonth > 11) {
        appState.currentMonth = 0;
        appState.currentYear++;
    } else if (appState.currentMonth < 0) {
        appState.currentMonth = 11;
        appState.currentYear--;
    }
    
    renderCalendar();
}

function selectDate(dateStr) {
    console.log('📅 Fecha seleccionada:', dateStr);
    appState.selectedDate = createLocalDate(dateStr); // Usar función sin problemas de zona horaria
    console.log('📅 Fecha parseada:', appState.selectedDate);
    console.log('📅 Fecha como string para almacenar:', appState.selectedDate.toISOString().split('T')[0]);
    renderCalendar();
    renderTimeSlots();
    updateSelectedDateInfo();
}

function updateSelectedDateInfo() {
    const info = document.getElementById('selected-date-info');
    const description = document.getElementById('time-slots-description');
    
    if (appState.selectedDate) {
        info.style.display = 'block';
        info.innerHTML = `
            <div class="label">Fecha seleccionada:</div>
            <div class="date">${formatDate(appState.selectedDate)}</div>
        `;
        description.textContent = `Horarios para ${formatDate(appState.selectedDate)}`;
    } else {
        info.style.display = 'none';
        description.textContent = 'Selecciona una fecha para ver los horarios';
    }
}

function renderTimeSlots() {
    const grid = document.getElementById('time-slots-grid');
    const noDateSelected = document.getElementById('no-date-selected');
    
    if (!appState.selectedDate) {
        grid.style.display = 'none';
        noDateSelected.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noDateSelected.style.display = 'none';
    grid.innerHTML = '';
    
    const fechaSeleccionada = dateToString(appState.selectedDate); // Usar función segura para fechas
    console.log('🔧 RENDERIZANDO TIME SLOTS para fecha:', fechaSeleccionada, 'cancha:', appState.selectedCourt.id);
    
    // Generar horarios dinámicamente en lugar de usar timeSlots mock
    const horariosDisponibles = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
    ];
    
    horariosDisponibles.forEach(hora => {
        // Usar la nueva función validarDisponibilidad para cada horario
        const disponible = validarDisponibilidad(appState.selectedCourt.id, fechaSeleccionada, hora);
        console.log(`🕐 Hora ${hora} - Disponible: ${disponible}`);
        
        const timeSlot = document.createElement('button');
        timeSlot.className = `time-slot ${!disponible ? 'disabled' : ''}`;
        timeSlot.disabled = !disponible;
        
        // Importante: SOLO configurar onclick para horarios disponibles
        if (disponible) {
            timeSlot.onclick = () => selectTime(hora);
        }
        // NO configurar onclick para horarios no disponibles para evitar confusión
        
        timeSlot.innerHTML = `
            <span class="time">${hora}</span>
            <span class="price">
                ${disponible ? formatPrice(appState.selectedCourt.pricePerHour) : 'Ocupado'}
            </span>
        `;
        
        grid.appendChild(timeSlot);
    });
}

function selectTime(time) {
    console.log('⏰ Hora seleccionada (ya validada como disponible):', time);
    
    // La hora ya fue validada como disponible en renderTimeSlots, no necesitamos re-validar
    appState.selectedTime = time;
    console.log('✅ Tiempo seleccionado exitosamente, mostrando confirmación:', time);
    
    // Update button states
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Find and select the clicked button
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        if (slot.textContent.includes(time) && !slot.disabled) {
            slot.classList.add('selected');
        }
    });
    
    // Show reserve button if exists
    const reserveBtn = document.querySelector('.reserve-btn');
    if (reserveBtn) {
        reserveBtn.style.display = 'block';
        reserveBtn.disabled = false;
    }
    
    // Mostrar diálogo de confirmación directamente (la hora ya fue validada)
    showConfirmDialog();
    return true;
}

function showUnavailableMessage() {
    // Crear un modal de error temporal
    const errorModal = document.createElement('div');
    errorModal.className = 'modal active';
    errorModal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title text-danger">
                    <i data-lucide="alert-triangle"></i>
                    Horario No Disponible
                </h3>
                <p class="modal-description">Este horario ya está ocupado o la cancha no está disponible. Por favor selecciona una fecha u horario diferente.</p>
            </div>
            <div class="modal-footer justify-content-center">
                <button class="btn btn-primary border" onclick="closeUnavailableMessage()">
                    <i data-lucide="calendar"></i>
                    Seleccionar Otra Fecha
                </button>
            </div>
        </div>
    `;
    errorModal.id = 'unavailable-modal';
    document.body.appendChild(errorModal);
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeUnavailableMessage() {
    const modal = document.getElementById('unavailable-modal');
    if (modal) {
        modal.remove();
    }
    // Limpiar selección de tiempo para forzar nueva selección
    appState.selectedTime = '';
    // Mantener la fecha seleccionada para que el usuario pueda elegir otro horario
    // o puede cambiar de fecha si lo desea
}

function renderCourtInfo() {
    const content = document.getElementById('court-info-content');
    const court = appState.selectedCourt;
    
    content.innerHTML = `
        <div class="court-info">
            <div>
                <h4 class="card-title">${court.name}</h4>
                <p class="court-description">${court.description}</p>
                <div class="court-stats-list">
                    <div class="court-stat">
                        <span class="label">Capacidad:</span>
                        <span class="value">${court.capacity} personas máx.</span>
                    </div>
                    <div class="court-stat">
                        <span class="label">Precio por hora:</span>
                        <span class="value price">${formatPrice(court.pricePerHour)}</span>
                    </div>
                </div>
            </div>
            <div class="features-section">
                <h5>Características:</h5>
                <div class="features-list">
                    ${court.features.map(feature => 
                        `<span class="badge badge-secondary">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

// Modal functions
function showConfirmDialog() {
    const modal = document.getElementById('confirm-dialog');
    const details = document.getElementById('confirm-details');
    
    // Para ediciones de reserva, no necesitamos validar disponibilidad nuevamente
    // Para nuevas reservas, la validación ya se hizo en renderTimeSlots y selectTime
    console.log('📋 Mostrando diálogo de confirmación para:', {
        sport: appState.selectedSport,
        court: appState.selectedCourt.name,
        date: appState.selectedDate,
        time: appState.selectedTime,
        editing: !!appState.editingReservation
    });
    
    details.innerHTML = `
        <div class="confirmation-details">
            <div class="detail-row">
                <span class="label">Deporte:</span>
                <span class="value">${appState.selectedSport}</span>
            </div>
            <div class="detail-row">
                <span class="label">Cancha:</span>
                <span class="value">${appState.selectedCourt.name}</span>
            </div>
            <div class="detail-row">
                <span class="label">Fecha:</span>
                <span class="value">${formatDate(appState.selectedDate)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Hora:</span>
                <span class="value">${appState.selectedTime}</span>
            </div>
            <div class="detail-row total">
                <span class="label">Total:</span>
                <span class="value">${formatPrice(appState.selectedCourt.pricePerHour)}</span>
            </div>
        </div>
    `;
    
    // Update confirm button text
    const confirmBtn = document.getElementById('confirm-reservation');
    confirmBtn.innerHTML = `
        <i data-lucide="check"></i>
        ${appState.editingReservation ? 'Actualizar Reserva' : 'Confirmar Reserva'}
    `;
    
    modal.classList.add('active');
    return true;
}

function hideConfirmDialog() {
    document.getElementById('confirm-dialog').classList.remove('active');
}

function confirmReservation() {
    const usuario = `${appState.user.nombre} ${appState.user.apellido}`;
    const fecha = dateToString(appState.selectedDate); // Usar función segura para fechas
    let reservationToShow;
    
    if (appState.editingReservation) {
        // Editar reserva existente
        console.log('✏️ Editando reserva existente:', appState.editingReservation.id);
        const index = appState.reservations.findIndex(r => r.id === appState.editingReservation.id);
        if (index !== -1) {
            appState.reservations[index] = {
                ...appState.reservations[index],
                usuario: usuario,
                canchaId: appState.selectedCourt.id,
                fecha: fecha,
                hora: appState.selectedTime,
                // Datos adicionales para la interfaz
                sport: appState.selectedSport,
                court: appState.selectedCourt.name,
                price: appState.selectedCourt.pricePerHour,
                status: 'confirmed'
            };
            reservationToShow = appState.reservations[index];
            console.log('✅ Reserva editada exitosamente');
        }
        appState.editingReservation = null;
    } else {
        // Nueva reserva - crear con todos los datos necesarios
        console.log('🆕 Creando nueva reserva (ya validada como disponible)...');
        const result = reservarCancha(appState.selectedCourt.id, fecha, appState.selectedTime, usuario);
        
        if (!result.success) {
            console.error('❌ Error inesperado al crear reserva');
            hideConfirmDialog();
            showUnavailableMessage();
            return false;
        }
        
        console.log('🎉 Reserva creada exitosamente:', result.reservation);
        
        // Agregar datos adicionales a la reserva recién creada
        const reservaIndex = appState.reservations.length - 1;
        appState.reservations[reservaIndex] = {
            ...appState.reservations[reservaIndex],
            sport: appState.selectedSport,
            court: appState.selectedCourt.name,
            price: appState.selectedCourt.pricePerHour,
            status: 'confirmed'
        };
        
        reservationToShow = appState.reservations[reservaIndex];
    }
    
    hideConfirmDialog();
    showSection('success-section');
    
    // Limpiar duplicados después de la operación
    cleanDuplicateReservations();
    
    // Actualizar los time slots para reflejar los cambios
    renderTimeSlots();
    console.log('🔄 Time slots actualizados después de la operación');
    
    // Mostrar la reserva en la página de éxito
    renderReservationSuccess(reservationToShow);
}

function showCancelDialog(reservationId) {
    const modal = document.getElementById('cancel-dialog');
    const details = document.getElementById('cancel-details');
    const reservation = appState.reservations.find(r => r.id === reservationId);
    
    if (reservation) {
        details.innerHTML = `
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="label">ID Cancha:</span>
                    <span class="value">${reservation.canchaId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Cancha:</span>
                    <span class="value">${reservation.court}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Fecha:</span>
                    <span class="value">${formatDateSafe(reservation.fecha || reservation.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Hora:</span>
                    <span class="value">${reservation.hora || reservation.time}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Estado:</span>
                    <span class="value">${reservation.estado || reservation.status}</span>
                </div>
            </div>
        `;
        
        document.getElementById('confirm-cancel').onclick = () => {
            const result = cancelarReserva(reservationId);
            if (result.success) {
                document.getElementById('cancel-dialog').classList.remove('active');
                renderReservations();
                
                // Si estamos en la vista de calendario, actualizar horarios disponibles
                if (appState.currentView === 'calendar') {
                    renderTimeSlots();
                    console.log('🔄 Time slots actualizados después de cancelación');
                }
            } else {
                alert(result.message);
            }
        };
        
        modal.classList.add('active');
    }
}

function hideCancelDialog() {
    document.getElementById('cancel-dialog').classList.remove('active');
}

// Reservations rendering
function renderReservations(filtros = {}) {
    const content = document.getElementById('reservations-content');
    const actions = document.getElementById('reservation-actions');
    
    const reservas = listarReservas(filtros);
    
    if (reservas.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar"></i>
                <h3>No tienes reservas</h3>
                <p>Comienza reservando una cancha para tu deporte favorito</p>
                <button class="btn btn-primary" onclick="showTab('sports')">
                    Hacer una Reserva
                </button>
            </div>
        `;
        actions.style.display = 'none';
    } else {
        actions.style.display = 'flex';
        content.innerHTML = `
            <div class="reservations-list">
                ${reservas.map(reservation => {
                    const court = Object.values(courtsData).flat().find(c => c.id === reservation.canchaId);
                    const sport = Object.keys(courtsData).find(key => 
                        courtsData[key].some(c => c.id === reservation.canchaId)
                    );
                    
                    return `
                        <div class="reservation-card">
                            <div class="reservation-content">
                                <div class="reservation-left">
                                    <div class="reservation-emoji">${getSportIcon(sport)}</div>
                                    <div class="reservation-details">
                                        <h3>${court ? court.name : reservation.court || 'Cancha no encontrada'}</h3>
                                        <p class="sport">${sport || reservation.sport}</p>
                                        <div class="reservation-meta">
                                            <div class="meta-item">
                                                <i data-lucide="calendar"></i>
                                                <span>${formatDateSafe(reservation.fecha || reservation.date)}</span>
                                            </div>
                                            <div class="meta-item">
                                                <i data-lucide="clock"></i>
                                                <span>${reservation.hora || reservation.time}</span>
                                            </div>
                                            <div class="meta-item">
                                                <i data-lucide="hash"></i>
                                                <span>ID: ${reservation.canchaId || reservation.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="reservation-right">
                                    <span class="badge ${reservation.estado === 'Reservada' || reservation.status === 'confirmed' ? 'badge-default' : 'badge-secondary'}">
                                        ${reservation.estado || (reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente')}
                                    </span>
                                    ${reservation.estado !== 'Cancelada' && reservation.status !== 'cancelled' ? `
                                        <div class="reservation-actions">
                                            <button class="btn btn-outline btn-sm" onclick="editReservation('${reservation.id}')">
                                                Cambiar
                                            </button>
                                            <button class="btn btn-destructive btn-sm" onclick="showCancelDialog('${reservation.id}')">
                                                Cancelar
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Update action buttons
        document.getElementById('change-time-btn').onclick = () => {
            if (reservas.length > 0) {
                editReservation(reservas[0].id);
            }
        };
        
        document.getElementById('cancel-reservation-btn').onclick = () => {
            if (reservas.length > 0) {
                showCancelDialog(reservas[0].id);
            }
        };
    }
    
    lucide.createIcons();
}

function editReservation(reservationId) {
    const reservation = appState.reservations.find(r => r.id === reservationId);
    if (reservation) {
        appState.editingReservation = reservation;
        appState.selectedSport = reservation.sport;
        
        // Buscar la cancha usando el canchaId
        let foundCourt = null;
        for (const sport in courtsData) {
            foundCourt = courtsData[sport].find(court => court.id === reservation.canchaId);
            if (foundCourt) break;
        }
        
        // Si no se encuentra la cancha, crear una básica para edición
        if (!foundCourt) {
            foundCourt = {
                id: reservation.canchaId || 'edit-' + reservation.id,
                name: reservation.court,
                description: `Cancha de ${reservation.sport.toLowerCase()}`,
                capacity: reservation.sport === 'Fútbol' ? 22 : 4,
                rating: 4.5,
                pricePerHour: reservation.price,
                features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED'],
                available: true
            };
        }
        
        appState.selectedCourt = foundCourt;
        appState.selectedDate = createLocalDate(reservation.fecha || reservation.date); // Usar función segura para fechas
        appState.currentMonth = appState.selectedDate.getMonth();
        appState.currentYear = appState.selectedDate.getFullYear();
        
        selectCourt(foundCourt);
    }
}

function renderReservationSuccess(reservation) {
    const details = document.getElementById('reservation-details');
    const code = document.getElementById('reservation-code');
    
    details.innerHTML = `
        <div class="reservation-header">
            <h3>Detalles de la Reserva</h3>
            <span class="badge badge-default" style="background-color: var(--color-green-600);">
                ${reservation.estado || 'Confirmada'}
            </span>
        </div>
        
        <div class="reservation-sport">
            <span class="emoji">${getSportIcon(reservation.sport)}</span>
            <div>
                <p class="name">${reservation.court}</p>
                <p class="type">${reservation.sport} (ID: ${reservation.canchaId})</p>
            </div>
        </div>
        
        <div class="reservation-info">
            <div class="info-item">
                <i data-lucide="calendar"></i>
                <div>
                    <p class="label">Fecha</p>
                    <p class="value">${formatDateSafe(reservation.fecha || reservation.date)}</p>
                </div>
            </div>
            
            <div class="info-item">
                <i data-lucide="clock"></i>
                <div>
                    <p class="label">Hora</p>
                    <p class="value">${reservation.hora || reservation.time}</p>
                </div>
            </div>
        </div>
        
        <div class="reservation-total">
            <span class="label">Total a Pagar</span>
            <span class="amount">${formatPrice(reservation.price)}</span>
            <p class="note">Recuerde pagar antes de utilizar la cancha</p>
        </div>
    `;
    
    code.innerHTML = `
        <p class="label">Código de Reserva</p>
        <p class="code">${reservation.id}</p>
        <p class="note">Presenta este código al llegar a la cancha</p>
    `;
    
    lucide.createIcons();
}

// Navigation functions
function goToReservations() {
    showSection('dashboard-section');
    showTab('reservations');
    renderReservations();
}

function makeNewReservation() {
    appState.selectedSport = '';
    appState.selectedCourt = null;
    appState.selectedDate = null;
    appState.selectedTime = '';
    appState.editingReservation = null;
    
    showSection('dashboard-section');
    showTab('sports');
}

// JSON Export functions
function exportCanchasData() {
    const canchas = [];
    for (const sport in courtsData) {
        courtsData[sport].forEach(court => {
            canchas.push({
                id: court.id,
                deporte: sport,
                nombre: court.name
            });
        });
    }
    return canchas;
}

function exportReservasData() {
    return appState.reservations.map(reservation => ({
        id: reservation.id,
        usuario: reservation.usuario,
        canchaId: reservation.canchaId,
        fecha: reservation.fecha,
        hora: reservation.hora,
        estado: reservation.estado
    }));
}

function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicación iniciada');
    
    // FORZAR limpieza completa al inicio
    appState.reservations = [];
    
    // Limpiar duplicados si existen
    cleanDuplicateReservations();
    
    console.log('🧹 Reservas inicializadas y verificadas');
    console.log('📋 Estado inicial:', appState);
    console.log('📋 Reservas existentes (DEBE estar vacío):', appState.reservations);
    console.log('🏟️ Datos de canchas:', courtsData);
    
    // Verificar que las canchas CAN-01 y CAN-02 estén disponibles
    const cancha01 = Object.values(courtsData).flat().find(c => c.id === 'CAN-01');
    const cancha02 = Object.values(courtsData).flat().find(c => c.id === 'CAN-02');
    console.log('🏟️ CAN-01 disponible:', cancha01?.available);
    console.log('🏟️ CAN-02 disponible:', cancha02?.available);
    
    // Probar validación con fecha de hoy
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];
    console.log('🧪 Prueba de validación para CAN-02, fecha hoy, 15:00:');
    const pruebaValidacion = validarDisponibilidad('CAN-02', fechaHoy, '15:00');
    console.log('🧪 Resultado:', pruebaValidacion);
    
    // Initialize lucide icons
    lucide.createIcons();
    
    // Auth tab switching
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showAuthTab(tabName);
        });
    });
    
    // Dashboard navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showTab(tabName);
            if (tabName === 'reservations') {
                renderReservations();
            } else {
                renderSports();
            }
        });
    });
    
    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // RUT formatting
    document.getElementById('login-rut').addEventListener('input', function(e) {
        e.target.value = formatRut(e.target.value);
    });
    
    document.getElementById('register-rut').addEventListener('input', function(e) {
        e.target.value = formatRut(e.target.value);
    });
    
    // Navigation buttons
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('back-to-dashboard').addEventListener('click', () => {
        showSection('dashboard-section');
        renderSports();
    });
    document.getElementById('back-to-courts').addEventListener('click', () => {
        showSection('court-selection-section');
        renderCourts();
    });
    
    // Modal controls
    document.getElementById('cancel-confirm').addEventListener('click', hideConfirmDialog);
    document.getElementById('confirm-reservation').addEventListener('click', confirmReservation);
    document.getElementById('keep-reservation').addEventListener('click', hideCancelDialog);
    
    // Success page actions
    document.getElementById('view-reservations-btn').addEventListener('click', goToReservations);
    document.getElementById('new-reservation-btn').addEventListener('click', makeNewReservation);
    
    // Download and share buttons
    document.getElementById('download-btn').addEventListener('click', () => {
        // Descargar datos de reservas en formato JSON
        const reservasData = exportReservasData();
        if (reservasData.length > 0) {
            downloadJSON(reservasData, 'mis-reservas.json');
        } else {
            alert('No tienes reservas para descargar');
        }
    });
    
    document.getElementById('share-btn').addEventListener('click', () => {
        if (navigator.share && appState.reservations.length > 0) {
            const lastReservation = appState.reservations[appState.reservations.length - 1];
            navigator.share({
                title: 'Mi Reserva de Cancha',
                text: `He reservado la ${lastReservation.court} para el ${lastReservation.fecha || lastReservation.date} a las ${lastReservation.hora || lastReservation.time}`,
                url: window.location.href
            });
        } else {
            alert('Funcionalidad de compartir no disponible o no hay reservas');
        }
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Initialize with sports rendered
    renderSports();
});

// Make functions global for onclick handlers
window.selectSport = selectSport;
window.selectCourt = selectCourt;
window.selectDate = selectDate;
window.selectTime = selectTime;
window.changeMonth = changeMonth;
window.editReservation = editReservation;
window.showCancelDialog = showCancelDialog;
window.closeUnavailableMessage = closeUnavailableMessage;

// Make main API functions globally accessible
window.loadCanchas = loadCanchas;
window.renderCanchas = renderCanchas;
window.reservarCancha = reservarCancha;
window.validarDisponibilidad = validarDisponibilidad;
window.listarReservas = listarReservas;
window.cancelarReserva = cancelarReserva;
window.filtrarPorDeporte = filtrarPorDeporte;
window.filtrarPorFecha = filtrarPorFecha;

// Additional utility functions  
window.filtrarReservasPorEstado = filtrarReservasPorEstado;

// Debug function for court independence issue
function testCourtIndependence() {
    console.log('🔍 === TESTING COURT INDEPENDENCE ===');
    
    // Test scenario: CAN-01 (football) reservation affecting CAN-07 (padel)
    const testDate = '2024-09-17';
    const testTime = '11:00';
    
    console.log(`\n📅 Testing date: ${testDate}`);
    console.log(`⏰ Testing time: ${testTime}`);
    
    // Get court info
    const cancha01 = appState.courtsData.find(c => c.id === 'CAN-01');
    const cancha07 = appState.courtsData.find(c => c.id === 'CAN-07');
    
    console.log('\n🏟️ COURT INFO:');
    console.log('CAN-01 (Football):', cancha01);
    console.log('CAN-07 (Padel):', cancha07);
    
    // Check initial availability for both courts
    console.log('\n✅ INITIAL AVAILABILITY CHECK:');
    console.log('CAN-01 available?', validarDisponibilidad('CAN-01', testDate, testTime));
    console.log('CAN-07 available?', validarDisponibilidad('CAN-07', testDate, testTime));
    
    // Check existing reservations that might conflict
    console.log('\n📋 EXISTING RESERVATIONS CHECK:');
    const reservasConflicto = appState.reservas.filter(r => 
        r.fecha === testDate && r.hora === testTime && r.estado === 'confirmada'
    );
    console.log('Conflicting reservations:', reservasConflicto);
    
    // Simulate making a reservation for CAN-01
    console.log('\n🎯 SIMULATING CAN-01 RESERVATION...');
    const mockReservation = {
        id: 'TEST-' + Date.now(),
        usuario: 'TEST_USER',
        canchaId: 'CAN-01',
        fecha: testDate,
        hora: testTime,
        estado: 'confirmada'
    };
    
    // Temporarily add the reservation
    appState.reservas.push(mockReservation);
    console.log('Mock reservation added:', mockReservation);
    
    // Check availability after CAN-01 reservation
    console.log('\n🔄 AVAILABILITY AFTER CAN-01 RESERVATION:');
    console.log('CAN-01 available?', validarDisponibilidad('CAN-01', testDate, testTime));
    console.log('CAN-07 available?', validarDisponibilidad('CAN-07', testDate, testTime));
    
    // Remove the mock reservation
    appState.reservas = appState.reservas.filter(r => r.id !== mockReservation.id);
    console.log('\n🧹 Mock reservation removed');
    
    // Final availability check
    console.log('\n✅ FINAL AVAILABILITY CHECK:');
    console.log('CAN-01 available?', validarDisponibilidad('CAN-01', testDate, testTime));
    console.log('CAN-07 available?', validarDisponibilidad('CAN-07', testDate, testTime));
    
    console.log('\n🔍 === TEST COMPLETE ===');
}

window.testCourtIndependence = testCourtIndependence;

// Debug function for detailed validation check
function debugValidarDisponibilidad(canchaId, fecha, hora) {
    console.log(`🔍 === DEBUG VALIDAR DISPONIBILIDAD ===`);
    console.log(`🏟️ Cancha: ${canchaId}`);
    console.log(`📅 Fecha: ${fecha}`);
    console.log(`⏰ Hora: ${hora}`);
    
    // Check if court exists
    const court = appState.courtsData.find(c => c.id === canchaId);
    console.log(`\n🏟️ Court found:`, court);
    
    if (!court) {
        console.log('❌ Court not found - UNAVAILABLE');
        return false;
    }
    
    if (!court.available) {
        console.log('❌ Court marked as not available - UNAVAILABLE');
        return false;
    }
    
    // Check existing reservations
    console.log(`\n📋 Checking existing reservations...`);
    const reservasExistentes = appState.reservas.filter(reserva => {
        const matches = reserva.canchaId === canchaId && 
                       reserva.fecha === fecha && 
                       reserva.hora === hora && 
                       reserva.estado === 'confirmada';
        
        if (matches) {
            console.log('🔒 Found conflicting reservation:', reserva);
        }
        
        return matches;
    });
    
    console.log(`\n📊 Total conflicting reservations: ${reservasExistentes.length}`);
    
    const isAvailable = reservasExistentes.length === 0;
    console.log(`\n${isAvailable ? '✅' : '❌'} Final result: ${isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    console.log(`🔍 === END DEBUG ===\n`);
    
    return isAvailable;
}

window.debugValidarDisponibilidad = debugValidarDisponibilidad;
window.obtenerCanchasPorDeporte = obtenerCanchasPorDeporte;
window.obtenerReservasDeHoy = obtenerReservasDeHoy;
window.obtenerProximasReservas = obtenerProximasReservas;

// Debug functions for exporting data (accessible from console)
window.exportCanchas = () => {
    const canchas = exportCanchasData();
    console.log('Datos de Canchas:', canchas);
    downloadJSON(canchas, 'canchas.json');
    return canchas;
};

window.exportReservas = () => {
    const reservas = exportReservasData();
    console.log('Datos de Reservas:', reservas);
    downloadJSON(reservas, 'reservas.json');
    return reservas;
};

window.showCurrentState = () => {
    console.log('Estado actual de la aplicación:', appState);
    return appState;
};

// Debug function to check for duplicates
window.checkDuplicates = () => {
    const duplicates = [];
    const seen = new Set();
    
    appState.reservations.forEach((reservation, index) => {
        const key = `${reservation.canchaId}-${reservation.fecha}-${reservation.hora}-${reservation.usuario}`;
        if (seen.has(key)) {
            duplicates.push({ index, reservation, key });
        } else {
            seen.add(key);
        }
    });
    
    console.log('🔍 Verificación de duplicados:');
    console.log('📋 Total reservas:', appState.reservations.length);
    console.log('🔄 Duplicados encontrados:', duplicates.length);
    if (duplicates.length > 0) {
        console.log('🚨 Duplicados:', duplicates);
    }
    return duplicates;
};

// Debug function to check reservation status
window.checkReservationStatus = (canchaId, fecha, hora) => {
    const reservations = appState.reservations.filter(r => 
        r.canchaId === canchaId && r.fecha === fecha && r.hora === hora
    );
    console.log(`🔍 Reservas para ${canchaId} el ${fecha} a las ${hora}:`, reservations);
    return reservations;
};

// Debug function to test date handling
window.testDateHandling = () => {
    console.log('🧪 Prueba de manejo de fechas:');
    
    const today = new Date();
    console.log('📅 Fecha actual:', today);
    console.log('📅 dateToString(today):', dateToString(today));
    
    const testDateStr = '2025-09-10';
    console.log('📅 String de prueba:', testDateStr);
    const testDate = createLocalDate(testDateStr);
    console.log('📅 createLocalDate(testDateStr):', testDate);
    console.log('📅 formatDateSafe(testDateStr):', formatDateSafe(testDateStr));
    console.log('📅 dateToString(testDate):', dateToString(testDate));
    
    // Probar que la ida y vuelta sea consistente
    const roundTrip = dateToString(createLocalDate(testDateStr));
    console.log('📅 Ida y vuelta (debe ser igual):', testDateStr, '→', roundTrip, testDateStr === roundTrip ? '✅' : '❌');
};

// Debug function to test the specific scenario described by the user
window.testScenarioProblema = () => {
    console.log('🧪 === PRUEBA DEL ESCENARIO PROBLEMÁTICO ===');
    
    const fecha = '2025-09-17';
    const hora = '11:00';
    
    console.log(`📅 Fecha de prueba: ${fecha}`);
    console.log(`� Hora de prueba: ${hora}`);
    console.log(`� Reservas actuales:`, appState.reservations);
    
    // Probar disponibilidad para cada cancha antes de cualquier reserva
    console.log('\n🔍 PASO 1: Verificar disponibilidad ANTES de reservar');
    const canchasFutbol = ['CAN-01', 'CAN-02', 'CAN-03'];
    const canchasTenis = ['CAN-04', 'CAN-05', 'CAN-06'];
    const canchasPadel = ['CAN-07', 'CAN-08', 'CAN-09'];
    
    canchasFutbol.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`⚽ ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
    });
    
    canchasTenis.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`🎾 ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
    });
    
    canchasPadel.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`� ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
    });
    
    console.log('\n🎯 PASO 2: Simular reserva en cancha de fútbol CAN-01');
    
    // Crear reserva mock para fútbol
    const reservaFutbol = {
        id: 'TEST-001',
        usuario: 'Usuario Prueba',
        canchaId: 'CAN-01',
        fecha: fecha,
        hora: hora,
        estado: 'Reservada',
        fechaCreacion: new Date().toISOString()
    };
    
    appState.reservations.push(reservaFutbol);
    console.log('✅ Reserva de fútbol creada:', reservaFutbol);
    
    console.log('\n🔍 PASO 3: Verificar disponibilidad DESPUÉS de reservar fútbol');
    
    canchasFutbol.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`⚽ ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
    });
    
    console.log('\n� VERIFICACIÓN CRÍTICA: ¿Canchas de tenis siguen disponibles?');
    canchasTenis.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`🎾 ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
        
        if (!disponible) {
            console.error(`🚨 ERROR: Cancha de tenis ${id} marcada como ocupada cuando NO debería estarlo!`);
        }
    });
    
    console.log('\n🚨 VERIFICACIÓN CRÍTICA: ¿Canchas de pádel siguen disponibles?');
    canchasPadel.forEach(id => {
        const disponible = validarDisponibilidad(id, fecha, hora);
        console.log(`🏓 ${id}: ${disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
        
        if (!disponible) {
            console.error(`🚨 ERROR: Cancha de pádel ${id} marcada como ocupada cuando NO debería estarlo!`);
        }
    });
    
    // Limpiar la reserva de prueba
    const index = appState.reservations.findIndex(r => r.id === 'TEST-001');
    if (index !== -1) {
        appState.reservations.splice(index, 1);
        console.log('\n🧹 Reserva de prueba eliminada');
    }
    
    console.log('🧪 === FIN DE LA PRUEBA ===');
};


