// Vue.js Application for Court Reservations
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            // Current view state
            currentView: 'auth',
            
            // Authentication state
            activeAuthTab: 'login',
            user: null,
            loginForm: {
                rut: '',
                password: ''
            },
            registerForm: {
                nombre: '',
                apellido: '',
                rut: '',
                email: '',
                password: ''
            },
            
            // Dashboard state
            activeDashboardTab: 'sports',
            
            // Sports and courts data
            sportsData: [
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
            ],
            
            courtsData: {
                'Fútbol': [
                    {
                        id: 'CAN-01',
                        name: 'Cancha Central #1',
                        description: 'Cancha de fútbol 11 con césped sintético de última generación',
                        capacity: 22,
                        rating: 4.8,
                        pricePerHour: 45000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Sintético', 'Marcador Electrónico'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Libertad 1348, Viña del Mar',
                            lat: -33.0244,
                            lon: -71.5519
                        }
                    },
                    {
                        id: 'CAN-02',
                        name: 'Cancha Norte #2',
                        description: 'Cancha de fútbol 7 ideal para partidos más íntimos',
                        capacity: 14,
                        rating: 4.6,
                        pricePerHour: 35000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Natural', 'Gradas Cubiertas'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Marina 37, Viña del Mar',
                            lat: -33.0153,
                            lon: -71.5500
                        }
                    },
                    {
                        id: 'CAN-03',
                        name: 'Cancha Sur #3',
                        description: 'Cancha multiuso con césped híbrido',
                        capacity: 22,
                        rating: 4.7,
                        pricePerHour: 40000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Híbrido', 'Sistema de Riego'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Los Castaños 155, Viña del Mar',
                            lat: -33.0365,
                            lon: -71.5320
                        }
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
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Sporting 2950, Viña del Mar',
                            lat: -33.0287,
                            lon: -71.5210
                        }
                    },
                    {
                        id: 'CAN-05',
                        name: 'Pista Tenis #2',
                        description: 'Cancha de tenis con superficie dura, ideal para principiantes',
                        capacity: 4,
                        rating: 4.5,
                        pricePerHour: 20000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Superficie Dura', 'Gradas'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. San Martín 180, Viña del Mar',
                            lat: -33.0325,
                            lon: -71.5538
                        }
                    },
                    {
                        id: 'CAN-06',
                        name: 'Pista Tenis #3',
                        description: 'Cancha de tenis cubierta para jugar en cualquier clima',
                        capacity: 4,
                        rating: 4.8,
                        pricePerHour: 30000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Superficie Dura', 'Techo Retráctil'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Valparaíso 567, Viña del Mar',
                            lat: -33.0198,
                            lon: -71.5485
                        }
                    }
                ],
                'Pádel': [
                    {
                        id: 'CAN-07',
                        name: 'Cancha Pádel #1',
                        description: 'Cancha de pádel indoor con cristal panorámico',
                        capacity: 4,
                        rating: 4.9,
                        pricePerHour: 28000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Cristal Panorámico', 'Climatizada'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Libertad 1348, Viña del Mar',
                            lat: -33.0245,
                            lon: -71.5518
                        }
                    },
                    {
                        id: 'CAN-08',
                        name: 'Cancha Pádel #2',
                        description: 'Cancha de pádel outdoor con césped sintético premium',
                        capacity: 4,
                        rating: 4.6,
                        pricePerHour: 22000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Césped Sintético', 'Gradas'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Los Castaños 1455, Viña del Mar',
                            lat: -33.0156,
                            lon: -71.5425
                        }
                    },
                    {
                        id: 'CAN-09',
                        name: 'Cancha Pádel #3',
                        description: 'Cancha de pádel techada con las mejores instalaciones',
                        capacity: 4,
                        rating: 4.8,
                        pricePerHour: 26000,
                        features: ['Vestuarios', 'Estacionamiento', 'Iluminación LED', 'Techo Retráctil', 'Bar'],
                        available: true,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. 15 Norte 961, Viña del Mar',
                            lat: -33.0178,
                            lon: -71.5512
                        }
                    }
                ]
            },
            
            // Selection state
            selectedSport: '',
            selectedCourt: null,
            selectedDate: null,
            selectedTime: '',
            
            // Reservations
            reservations: [],
            userReservations: [], // Reservas del usuario desde la API
            allReservations: [], // Todas las reservas del sistema (para verificar disponibilidad)
            selectedReservation: null,
            lastReservation: null,
            modifyingReservation: null,
            isLoadingReservations: false,
            
            // Calendar state
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            monthNames: [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ],
            weekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            
            // Weather API
            weatherApiKey: (window.ENV && window.ENV.OPENWEATHER_API_KEY) || '61f6915417ca53ccd95fb615cc7fb019',
            weatherData: null,
            weatherByDate: {},
            weatherByHour: {},
            weatherByLocation: {}, // Clima por ubicación de cancha
            
            // Modal state
            showConfirm: false,
            showCancel: false
        }
    },
    
    computed: {
        // Get user reservations - from API if authenticated, otherwise filter local reservations
        filteredUserReservations() {
            // Si hay reservas de la API (usuario autenticado), usarlas
            if (ApiService.isAuthenticated() && this.userReservations.length > 0) {
                console.log(`✅ Usando reservas de la API: ${this.userReservations.length} reservas`);
                return this.userReservations;
            }
            
            // Fallback: filtrar reservas locales por nombre de usuario
            if (!this.user) {
                console.log('⚠️ No hay usuario logueado');
                return [];
            }
            const userFullName = `${this.user.nombre} ${this.user.apellido}`;
            const filtered = this.reservations.filter(reservation => {
                return reservation.usuario === userFullName;
            });
            console.log(`✅ Usando reservas locales: ${filtered.length} reservas para "${userFullName}"`);
            return filtered;
        },
        calendarDays() {
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
            const today = new Date();
            
            const days = [];
            
            // Previous month days
            const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
            const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
            const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
            
            for (let i = firstDayOfMonth - 1; i >= 0; i--) {
                const date = daysInPrevMonth - i;
                days.push({
                    date,
                    isCurrentMonth: false,
                    isPast: true,
                    isToday: false,
                    fullDate: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                });
            }
            
            // Current month days
            for (let date = 1; date <= daysInMonth; date++) {
                const dayDate = new Date(this.currentYear, this.currentMonth, date);
                const isPast = dayDate < today.setHours(0, 0, 0, 0);
                const isToday = dayDate.toDateString() === today.toDateString();
                
                days.push({
                    date,
                    isCurrentMonth: true,
                    isPast,
                    isToday,
                    fullDate: `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                });
            }
            
            // Next month days to fill the grid
            const remainingDays = 42 - days.length;
            const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
            const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
            
            for (let date = 1; date <= remainingDays; date++) {
                days.push({
                    date,
                    isCurrentMonth: false,
                    isPast: false,
                    isToday: false,
                    fullDate: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                });
            }
            
            return days;
        },
        
        availableTimeSlots() {
            if (!this.selectedDate || !this.selectedCourt) return [];
            
            const slots = [
                '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
                '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
                '20:00', '21:00', '22:00'
            ];
            
            // ID de la cancha seleccionada
            const currentCourtId = this.selectedCourt?.dbId || this.selectedCourt?.id;
            
            // Check for occupied slots based on existing reservations
            return slots.map(time => {
                // Verificar en reservas locales (fallback)
                const occupiedLocal = this.reservations.some(reservation => 
                    reservation.fecha === this.selectedDate && 
                    reservation.hora === time &&
                    (reservation.canchaId === currentCourtId || reservation.canchaId === this.selectedCourt?.id) &&
                    reservation.estado !== 'Cancelada'
                );
                
                // Verificar en TODAS las reservas del usuario (no solo las propias)
                // Esto incluye reservas que puedan estar en memoria de otras sesiones
                const occupiedAPI = this.userReservations.some(reservation => 
                    reservation.fecha === this.selectedDate && 
                    reservation.hora === time &&
                    reservation.court_id === currentCourtId &&
                    reservation.estado !== 'Cancelada'
                );
                
                // Verificar en todas las reservas del sistema si están cargadas
                const occupiedAll = this.allReservations.some(reservation => 
                    reservation.fecha === this.selectedDate && 
                    reservation.hora === time &&
                    reservation.court_id === currentCourtId &&
                    reservation.estado !== 'Cancelada'
                );
                
                const occupied = occupiedLocal || occupiedAPI || occupiedAll;
                
                return { time, occupied };
            });
        }
    },
    
    methods: {
        // Load reservations from localStorage or JSON file
        async loadReservations() {
            // Mantener como backup/fallback
            const savedReservations = localStorage.getItem('courtReservations');
            if (savedReservations) {
                try {
                    this.reservations = JSON.parse(savedReservations);
                    console.log('Reservas cargadas desde localStorage (backup):', this.reservations.length);
                    return;
                } catch (error) {
                    console.error('Error al parsear reservas de localStorage:', error);
                    localStorage.removeItem('courtReservations');
                }
            }
            
            // Cargar desde JSON como fallback
            try {
                const response = await fetch('./reservas.json');
                if (response.ok) {
                    const reservationsData = await response.json();
                    this.reservations = reservationsData.map(reservation => ({
                        id: reservation.id,
                        usuario: reservation.usuario,
                        cancha: this.getCourtNameById(reservation.canchaId),
                        deporte: this.getSportByCourtId(reservation.canchaId),
                        fecha: reservation.fecha,
                        hora: reservation.hora,
                        estado: reservation.estado,
                        codigo: reservation.id
                    }));
                    localStorage.setItem('courtReservations', JSON.stringify(this.reservations));
                    console.log('Reservas cargadas desde archivo JSON:', this.reservations.length);
                }
            } catch (error) {
                console.log('No se pudieron cargar las reservas del archivo JSON:', error);
                this.reservations = [];
            }
        },

        // NUEVO: Cargar reservas del usuario desde la API
        async loadUserReservations() {
            if (!ApiService.isAuthenticated()) {
                console.log('⚠️ loadUserReservations: Usuario no autenticado');
                this.userReservations = [];
                return;
            }
            
            this.isLoadingReservations = true;
            console.log('🔄 Cargando reservas del usuario desde la API...');
            try {
                const reservations = await ApiService.getMyReservations();
                console.log('📥 Reservas recibidas de la API:', reservations);
                
                // Transformar datos de la API al formato del frontend
                this.userReservations = reservations.map(res => ({
                    id: res.id,
                    court_id: res.court.id, // Agregar el ID de la cancha
                    cancha: res.court.name,
                    deporte: res.court.sport,
                    fecha: res.date,
                    hora: res.time,
                    precio: res.total_price,
                    estado: res.status === 'confirmed' ? 'Reservada' : 
                            res.status === 'cancelled' ? 'Cancelada' : 'Completada',
                    codigo: `RES-${String(res.id).padStart(5, '0')}`,
                    ubicacion: {
                        city: 'Viña del Mar',
                        address: 'Av. Libertad 1348'
                    }
                }));
                
                console.log('✅ Reservas del usuario cargadas desde API:', this.userReservations.length);
                console.log('📋 Reservas transformadas:', this.userReservations);
                
                // Re-inicializar iconos de Lucide después de cargar reservas
                this.$nextTick(() => {
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                        console.log('🎨 Iconos Lucide re-inicializados después de cargar reservas');
                    }
                });
            } catch (error) {
                console.error('❌ Error cargando reservas desde API:', error);
                this.userReservations = [];
            } finally {
                this.isLoadingReservations = false;
            }
        },

        // NUEVO: Cargar canchas desde la API
        async loadCourtsFromAPI() {
            try {
                const allCourts = await ApiService.getCourts();
                
                // Transformar datos de la API al formato del frontend
                const newCourtsData = {
                    'Fútbol': [],
                    'Tenis': [],
                    'Pádel': []
                };
                
                allCourts.forEach(court => {
                    const courtData = {
                        id: court.court_id,
                        dbId: court.id, // ID de la base de datos para las reservas
                        name: court.name,
                        description: court.description,
                        capacity: court.capacity,
                        rating: court.rating,
                        pricePerHour: court.price_per_hour,
                        features: court.features ? JSON.parse(court.features) : [],
                        available: court.is_active,
                        location: {
                            city: 'Viña del Mar',
                            address: 'Av. Libertad 1348, Viña del Mar',
                            lat: -33.0244,
                            lon: -71.5519
                        }
                    };
                    
                    if (newCourtsData[court.sport]) {
                        newCourtsData[court.sport].push(courtData);
                    }
                });
                
                // Actualizar datos de canchas
                this.courtsData = newCourtsData;
                
                // Actualizar contador de canchas disponibles
                this.sportsData.forEach(sport => {
                    sport.available = this.courtsData[sport.name]?.length || 0;
                });
                
                console.log('Canchas cargadas desde API');
            } catch (error) {
                console.error('Error cargando canchas desde API:', error);
                // Mantener datos locales como fallback
            }
        },

        // Helper method to get court name by ID
        getCourtNameById(courtId) {
            for (const sport in this.courtsData) {
                const court = this.courtsData[sport].find(c => c.id === courtId);
                if (court) return court.name;
            }
            return 'Cancha Desconocida';
        },

        // Helper method to get sport by court ID
        getSportByCourtId(courtId) {
            for (const sport in this.courtsData) {
                const court = this.courtsData[sport].find(c => c.id === courtId);
                if (court) return sport;
            }
            return 'Deporte Desconocido';
        },

        // Authentication methods
        async handleLogin() {
            if (!this.loginForm.rut || !this.loginForm.password) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            try {
                // Usar email directamente si contiene @, sino convertir RUT a email
                const email = this.loginForm.rut.includes('@') ? this.loginForm.rut : `${this.loginForm.rut}@unab.cl`;
                
                // Login con el backend
                await ApiService.login(email, this.loginForm.password);
                
                // Obtener información del usuario
                const userData = await ApiService.getCurrentUser();
                
                this.user = {
                    email: userData.email,
                    nombre: userData.full_name?.split(' ')[0] || 'Usuario',
                    apellido: userData.full_name?.split(' ').slice(1).join(' ') || '',
                    rut: this.loginForm.rut,
                    isAdmin: userData.is_admin
                };
                
                localStorage.setItem('currentUser', JSON.stringify(this.user));
                this.currentView = 'dashboard';
                this.loginForm = { rut: '', password: '' };
                
                // Cargar datos del usuario
                await this.loadUserReservations();
                await this.loadCourtsFromAPI();
                
                console.log('Login exitoso:', `${this.user.nombre} ${this.user.apellido}`);
            } catch (error) {
                console.error('Error en login:', error);
                alert('Credenciales incorrectas. Intenta con:\n\nAdmin: admin@unab.cl / admin123\nUsuario: usuario@unab.cl / usuario123');
            }
        },
        
        async handleRegister() {
            const form = this.registerForm;
            
            if (!form.nombre || !form.apellido || !form.rut || !form.email || !form.password) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            if (form.password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            try {
                // Registrar en el backend
                await ApiService.register({
                    email: form.email,
                    password: form.password,
                    full_name: `${form.nombre} ${form.apellido}`
                });
                
                alert('¡Registro exitoso! Ahora puedes iniciar sesión');
                this.activeAuthTab = 'login';
                this.loginForm.rut = form.email; // Pre-llenar el email en el login
                this.registerForm = {
                    nombre: '',
                    apellido: '',
                    rut: '',
                    email: '',
                    password: ''
                };
                
                console.log('Registro exitoso para:', form.email);
            } catch (error) {
                console.error('Error en registro:', error);
                alert('Error al registrar: ' + error.message);
            }
        },
        
        logout() {
            ApiService.logout();
            this.user = null;
            this.currentView = 'auth';
            this.activeAuthTab = 'login';
            this.userReservations = [];
            localStorage.removeItem('currentUser');
            this.resetSelection();
            console.log('Sesión cerrada');
        },
        
        // Navigation methods
        selectSport(sportName) {
            this.selectedSport = sportName;
            this.currentView = 'court-selection';
        },
        
        async selectCourt(court) {
            if (!court.available) return;
            this.selectedCourt = court;
            
            // Cargar clima específico de la ubicación de la cancha
            await this.fetchWeatherForCourt(court);
            
            // Cargar reservas de esta cancha para verificar disponibilidad
            await this.loadCourtReservations(court);
            
            this.currentView = 'calendar';
        },
        
        // Cargar reservas de una cancha específica
        async loadCourtReservations(court) {
            try {
                const courtId = court.dbId || court.id;
                console.log(`🔍 Cargando reservas de la cancha ID: ${courtId}`);
                
                // Obtener reservas de esta cancha
                const reservations = await ApiService.getCourtAvailability(courtId);
                
                // Transformar y almacenar en allReservations
                this.allReservations = reservations.map(res => ({
                    id: res.id,
                    court_id: res.court_id,
                    fecha: res.date,
                    hora: res.time,
                    estado: res.status === 'confirmed' ? 'Reservada' : 
                            res.status === 'cancelled' ? 'Cancelada' : 'Completada'
                }));
                
                console.log(`✅ ${this.allReservations.length} reservas cargadas para esta cancha`);
            } catch (error) {
                console.error('Error cargando reservas de la cancha:', error);
                this.allReservations = [];
            }
        },
        
        backToDashboard() {
            this.currentView = 'dashboard';
            this.resetSelection();
        },
        
        backToCourts() {
            this.currentView = 'court-selection';
            this.selectedCourt = null;
            this.selectedDate = null;
            this.selectedTime = '';
        },
        
        resetSelection() {
            this.selectedSport = '';
            this.selectedCourt = null;
            this.selectedDate = null;
            this.selectedTime = '';
        },
        
        // Calendar methods
        previousMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
        },
        
        nextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
        },
        
        selectDate(day) {
            if (!day.isCurrentMonth || day.isPast) return;
            this.selectedDate = day.fullDate;
            this.selectedTime = '';
        },
        
        selectTimeSlot(time) {
            // Validar que no se pueda seleccionar un horario pasado
            if (this.isTimeSlotPast(time)) {
                alert('No puedes reservar un horario que ya pasó. Por favor, selecciona un horario futuro.');
                return;
            }
            this.selectedTime = time;
        },
        
        // Método auxiliar para verificar si un horario ya pasó
        isTimeSlotPast(time) {
            if (!this.selectedDate) return false;
            
            const now = new Date();
            const selectedDateTime = new Date(`${this.selectedDate}T${time}:00`);
            
            return selectedDateTime < now;
        },
        
        // Reservation methods
        showConfirmDialog() {
            this.showConfirm = true;
        },
        
        hideConfirmDialog() {
            this.showConfirm = false;
        },
        
        async confirmReservation() {
            if (!this.selectedDate || !this.selectedTime || !this.selectedCourt) {
                alert('Por favor selecciona fecha y hora');
                return;
            }
            
            // Validar que no sea un horario pasado
            if (this.isTimeSlotPast(this.selectedTime)) {
                alert('No puedes reservar un horario que ya pasó. Por favor, selecciona un horario futuro.');
                return;
            }
            
            try {
                const reservationData = {
                    court_id: this.selectedCourt.dbId || this.selectedCourt.id,
                    date: this.selectedDate,
                    time: this.selectedTime,
                    duration: 1,
                    notes: ''
                };
                
                if (this.modifyingReservation) {
                    // Actualizar reserva existente
                    await ApiService.updateReservation(this.modifyingReservation.id, {
                        date: this.selectedDate,
                        time: this.selectedTime
                    });
                    
                    console.log('🔄 Reserva modificada exitosamente');
                    alert('Reserva modificada exitosamente');
                    
                    this.modifyingReservation = null;
                    this.hideConfirmDialog();
                    this.backToDashboard();
                    this.activeDashboardTab = 'reservations';
                    
                    // Recargar reservas
                    await this.loadUserReservations();
                } else {
                    // Crear nueva reserva
                    const newReservation = await ApiService.createReservation(reservationData);
                    
                    this.lastReservation = {
                        id: newReservation.id,
                        cancha: this.selectedCourt.name,
                        deporte: this.selectedSport,
                        fecha: this.selectedDate,
                        hora: this.selectedTime,
                        precio: this.selectedCourt.pricePerHour,
                        codigo: `RES-${String(newReservation.id).padStart(5, '0')}`,
                        ubicacion: this.selectedCourt.location
                    };
                    
                    console.log('✅ Reserva creada exitosamente:', this.lastReservation.codigo);
                    
                    this.hideConfirmDialog();
                    this.currentView = 'success';
                    
                    // Recargar reservas
                    await this.loadUserReservations();
                }
            } catch (error) {
                console.error('Error creando/modificando reserva:', error);
                
                // Mejorar el mensaje de error para casos específicos
                let errorMessage = 'Error al procesar la reserva';
                
                if (error.message.includes('ya está reservada') || error.message.includes('already')) {
                    errorMessage = '⚠️ Esta cancha ya está reservada en ese horario. Por favor, selecciona otro horario.';
                } else if (error.message.includes('disponibilidad') || error.message.includes('available')) {
                    errorMessage = '⚠️ El horario seleccionado no está disponible. Por favor, elige otro.';
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
                
                alert(errorMessage);
                this.hideConfirmDialog();
            }
        },
        
        generateReservationCode() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let code = '';
            
            // 2 letters + 4 numbers
            for (let i = 0; i < 2; i++) {
                code += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            for (let i = 0; i < 4; i++) {
                code += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }
            
            return code;
        },
        
        selectReservation(reservation) {
            this.selectedReservation = this.selectedReservation?.id === reservation.id ? null : reservation;
        },
        
        showCancelDialog() {
            if (!this.selectedReservation) return;
            this.showCancel = true;
        },
        
        hideCancelDialog() {
            this.showCancel = false;
        },
        
        async confirmCancelReservation() {
            if (!this.selectedReservation) return;
            
            try {
                await ApiService.cancelReservation(this.selectedReservation.id);
                
                console.log('✅ Reserva cancelada:', this.selectedReservation.codigo);
                alert('Reserva cancelada exitosamente');
                
                this.selectedReservation = null;
                this.hideCancelDialog();
                
                // Recargar reservas
                await this.loadUserReservations();
            } catch (error) {
                console.error('Error cancelando reserva:', error);
                alert('Error al cancelar la reserva: ' + error.message);
            }
        },
        
        changeReservationTime() {
            if (!this.selectedReservation) return;
            
            // Guardar la reserva que se está modificando
            this.modifyingReservation = { ...this.selectedReservation };
            
            // Find the court and sport
            this.selectedSport = this.selectedReservation.deporte;
            
            // Buscar la cancha en courtsData usando el court_id
            const availableCourts = this.getAvailableCourts(this.selectedSport);
            this.selectedCourt = availableCourts.find(court => 
                court.dbId === this.selectedReservation.court_id || 
                court.id === this.selectedReservation.court_id
            );
            
            // Si no se encuentra, intentar buscar por nombre como fallback
            if (!this.selectedCourt) {
                this.selectedCourt = availableCourts.find(court => 
                    court.name === this.selectedReservation.cancha
                );
            }
            
            console.log('🔍 Cancha seleccionada:', this.selectedCourt);
            console.log('📋 Reserva a modificar:', this.modifyingReservation);
            
            // Pre-seleccionar la fecha actual
            this.selectedDate = this.selectedReservation.fecha;
            
            // Cambiar a la vista del calendario
            this.currentView = 'calendar';
            
            console.log('🔄 Modificando reserva:', this.modifyingReservation.codigo);
        },
        
        // Success page methods
        viewReservations() {
            console.log('🔍 Mostrando vista de reservas...');
            
            // Reload reservations from localStorage to ensure we have the latest data
            const savedReservations = localStorage.getItem('courtReservations');
            if (savedReservations) {
                try {
                    this.reservations = JSON.parse(savedReservations);
                    console.log('📦 Reservas totales cargadas desde localStorage:', this.reservations.length);
                    console.log('📋 Todas las reservas:', this.reservations);
                } catch (error) {
                    console.error('❌ Error al parsear reservas:', error);
                    this.reservations = [];
                }
            } else {
                console.warn('⚠️ No hay reservas en localStorage');
                this.reservations = [];
            }
            
            // Log user information
            if (this.user) {
                console.log('👤 Usuario actual:', `${this.user.nombre} ${this.user.apellido}`);
                console.log('🎯 Reservas filtradas del usuario:', this.userReservations.length);
                console.log('📝 Detalle reservas del usuario:', this.userReservations);
            } else {
                console.error('❌ No hay usuario logueado');
            }
            
            this.currentView = 'dashboard';
            this.activeDashboardTab = 'reservations';
            
            // Force update to ensure UI reflects changes
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },

        // Method to reload reservations from API
        async reloadReservations() {
            await this.loadUserReservations();
        },
        
        newReservation() {
            this.currentView = 'dashboard';
            this.activeDashboardTab = 'sports';
            this.resetSelection();
        },
        
        downloadReservation() {
            try {
                // Crear una instancia de jsPDF
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Configurar fuente y colores
                doc.setFont("helvetica");
                
                // Título principal
                doc.setFontSize(22);
                doc.setTextColor(3, 2, 19); // Color primario
                doc.text("COMPROBANTE DE RESERVA", 105, 20, { align: "center" });
                
                // Línea decorativa
                doc.setDrawColor(3, 2, 19);
                doc.setLineWidth(0.5);
                doc.line(20, 25, 190, 25);
                
                // Información de la reserva
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                
                let yPos = 40;
                const lineHeight = 10;
                
                // Código de reserva (destacado)
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Código de Reserva:", 20, yPos);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(34, 197, 94); // Verde
                doc.text(this.lastReservation.codigo, 80, yPos);
                
                yPos += lineHeight + 5;
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                
                // Detalles de la reserva
                const details = [
                    { label: "Deporte:", value: this.lastReservation.deporte },
                    { label: "Cancha:", value: this.lastReservation.cancha },
                    { label: "Fecha:", value: this.formatDate(this.lastReservation.fecha) },
                    { label: "Hora:", value: this.lastReservation.hora },
                    { label: "Duración:", value: "1 hora" },
                    { label: "Precio Total:", value: `$${this.formatPrice(this.lastReservation.precio)}` }
                ];
                
                details.forEach(detail => {
                    doc.setFont("helvetica", "bold");
                    doc.text(detail.label, 20, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text(detail.value, 80, yPos);
                    yPos += lineHeight;
                });
                
                // Línea divisoria
                yPos += 5;
                doc.setDrawColor(200, 200, 200);
                doc.line(20, yPos, 190, yPos);
                yPos += 10;
                
                // Instrucciones
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text("INSTRUCCIONES IMPORTANTES:", 20, yPos);
                yPos += lineHeight;
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const instructions = [
                    "• Llega 10 minutos antes de tu hora reservada",
                    "• Presenta este comprobante en la recepción",
                    "• Trae tu documento de identidad",
                    "• El retraso máximo permitido es de 15 minutos"
                ];
                
                instructions.forEach(instruction => {
                    doc.text(instruction, 25, yPos);
                    yPos += 7;
                });
                
                // Footer
                yPos = 270;
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.text("UNAB Sporting Court - Sistema de Reservas", 105, yPos, { align: "center" });
                doc.text(`Generado el ${new Date().toLocaleDateString('es-CL')} a las ${new Date().toLocaleTimeString('es-CL')}`, 105, yPos + 5, { align: "center" });
                
                // Guardar el PDF
                doc.save(`reserva-${this.lastReservation.codigo}.pdf`);
                
                console.log('✅ PDF generado exitosamente');
            } catch (error) {
                console.error('❌ Error generando PDF:', error);
                alert('Error al generar el PDF. Por favor, intenta nuevamente.');
            }
        },
        
        shareReservation() {
            const text = `¡He reservado una cancha! Código: ${this.lastReservation.codigo}, Fecha: ${this.formatDate(this.lastReservation.fecha)}, Hora: ${this.lastReservation.hora}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Mi Reserva de Cancha',
                    text: text
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(text);
                alert('Información de reserva copiada al portapapeles');
            }
        },
        
        // Utility methods
        getAvailableCourts(sport) {
            return this.courtsData[sport] || [];
        },
        
        getSportIcon(sport) {
            const sportData = this.sportsData.find(s => s.name === sport);
            return sportData ? sportData.icon : '🏟️';
        },
        
        formatPrice(price) {
            if (!price) return '0';
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
        
        formatDate(dateString) {
            if (!dateString) return '';
            // Parse the date string manually to avoid timezone issues
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        formatSelectedDate() {
            if (!this.selectedDate) return '';
            // Parse the date string manually to avoid timezone issues
            const [year, month, day] = this.selectedDate.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        // Weather API methods
        async fetchWeatherData(lat = -33.4489, lon = -70.6693, locationKey = 'default') {
            if (!this.weatherApiKey) {
                console.warn('⚠️ OPENWEATHER_API_KEY no configurada. No se cargará el clima.');
                return;
            }
            
            try {
                console.log(`🌤️ Solicitando clima para ${locationKey} (lat: ${lat}, lon: ${lon})...`);
                const data = await ApiService.fetchWeather(lat, lon, this.weatherApiKey);
                console.log(`📦 Datos del clima recibidos para ${locationKey}:`, data.list ? `${data.list.length} registros` : 'sin datos');
                
                // Si es la ubicación por defecto, usar las variables globales
                if (locationKey === 'default') {
                    this.weatherData = data;
                    this.processWeatherData(data);
                } else {
                    // Guardar clima específico por ubicación
                    this.weatherByLocation[locationKey] = data;
                    this.processWeatherDataForLocation(data, locationKey);
                }
                
                console.log(`✅ Datos del clima cargados correctamente para ${locationKey}`);
            } catch (error) {
                console.error(`❌ Error al cargar el clima para ${locationKey}:`, error);
            }
        },
        
        async fetchWeatherForCourt(court) {
            if (!court || !court.location) return;
            
            const locationKey = court.id;
            
            // Si ya tenemos datos del clima para esta ubicación, no volver a consultar
            if (this.weatherByLocation[locationKey]) {
                console.log(`📦 Usando clima cacheado para ${court.location.city}`);
                return;
            }
            
            await this.fetchWeatherData(
                court.location.lat,
                court.location.lon,
                locationKey
            );
        },
        
        processWeatherData(data) {
            // Procesar datos del clima por fecha y hora
            this.weatherByDate = {};
            this.weatherByHour = {};
            
            console.log('🔄 Procesando datos del clima (default location)...');
            
            data.list.forEach(item => {
                const dateTime = new Date(item.dt * 1000);
                const dateStr = dateTime.toISOString().split('T')[0];
                const hour = dateTime.getHours();
                const hourStr = `${String(hour).padStart(2, '0')}:00`;
                
                // Guardar clima por fecha (promedio del día)
                if (!this.weatherByDate[dateStr]) {
                    this.weatherByDate[dateStr] = {
                        temp: item.main.temp,
                        weather: item.weather[0].main,
                        description: item.weather[0].description,
                        icon: item.weather[0].icon,
                        count: 1
                    };
                } else {
                    this.weatherByDate[dateStr].temp += item.main.temp;
                    this.weatherByDate[dateStr].count += 1;
                }
                
                // Guardar clima por fecha y hora específica
                const key = `${dateStr}_${hourStr}`;
                this.weatherByHour[key] = {
                    temp: Math.round(item.main.temp),
                    weather: item.weather[0].main,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                };
            });
            
            // Calcular promedio de temperatura por día
            Object.keys(this.weatherByDate).forEach(date => {
                const data = this.weatherByDate[date];
                data.temp = Math.round(data.temp / data.count);
            });
            
            console.log(`📅 weatherByDate procesado con ${Object.keys(this.weatherByDate).length} fechas:`, Object.keys(this.weatherByDate));
            console.log(`⏰ weatherByHour procesado con ${Object.keys(this.weatherByHour).length} horas`);
        },
        
        processWeatherDataForLocation(data, locationKey) {
            console.log(`🔄 Procesando datos del clima para ubicación: ${locationKey}...`);
            
            const weatherByDate = {};
            const weatherByHour = {};
            
            data.list.forEach(item => {
                const dateTime = new Date(item.dt * 1000);
                const dateStr = dateTime.toISOString().split('T')[0];
                const hour = dateTime.getHours();
                const hourStr = `${String(hour).padStart(2, '0')}:00`;
                
                // Guardar clima por fecha
                if (!weatherByDate[dateStr]) {
                    weatherByDate[dateStr] = {
                        temp: item.main.temp,
                        weather: item.weather[0].main,
                        description: item.weather[0].description,
                        icon: item.weather[0].icon,
                        count: 1
                    };
                } else {
                    weatherByDate[dateStr].temp += item.main.temp;
                    weatherByDate[dateStr].count += 1;
                }
                
                // Guardar clima por hora
                const key = `${dateStr}_${hourStr}`;
                weatherByHour[key] = {
                    temp: Math.round(item.main.temp),
                    weather: item.weather[0].main,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                };
            });
            
            // Calcular promedio
            Object.keys(weatherByDate).forEach(date => {
                const data = weatherByDate[date];
                data.temp = Math.round(data.temp / data.count);
            });
            
            this.weatherByLocation[locationKey] = {
                byDate: weatherByDate,
                byHour: weatherByHour
            };
            
            console.log(`📅 weatherByLocation[${locationKey}].byDate con ${Object.keys(weatherByDate).length} fechas:`, Object.keys(weatherByDate));
            console.log(`⏰ weatherByLocation[${locationKey}].byHour con ${Object.keys(weatherByHour).length} horas`);
        },
        
        getWeatherIcon(weather) {
            const iconMap = {
                'Clear': '☀️',
                'Clouds': '☁️',
                'Rain': '🌧️',
                'Drizzle': '🌦️',
                'Thunderstorm': '⛈️',
                'Snow': '🌨️',
                'Mist': '🌫️',
                'Fog': '🌫️',
                'Haze': '🌫️'
            };
            return iconMap[weather] || '🌤️';
        },
        
        getWeatherForDate(dateStr) {
            // Usar clima de la cancha seleccionada si existe
            let weatherData = this.weatherByDate;
            
            if (this.selectedCourt && this.weatherByLocation[this.selectedCourt.id]) {
                weatherData = this.weatherByLocation[this.selectedCourt.id].byDate;
                console.log(`🔍 Buscando clima para ${dateStr} en cancha ${this.selectedCourt.id}`);
            } else {
                console.log(`🔍 Buscando clima para ${dateStr} en datos globales`);
            }
            
            if (!weatherData[dateStr]) {
                console.log(`⚠️ No hay clima para fecha: ${dateStr}`);
                return null;
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(dateStr + 'T00:00:00');
            const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            
            // Solo mostrar clima para los próximos 8 días
            if (diffDays < 0 || diffDays > 8) {
                console.log(`⚠️ Fecha ${dateStr} fuera de rango (${diffDays} días desde hoy)`);
                return null;
            }
            
            console.log(`✅ Clima encontrado para ${dateStr}:`, weatherData[dateStr]);
            return weatherData[dateStr];
        },
        
        getWeatherForHour(dateStr, hour) {
            // Usar clima de la cancha seleccionada si existe
            let weatherData = this.weatherByHour;
            
            if (this.selectedCourt && this.weatherByLocation[this.selectedCourt.id]) {
                weatherData = this.weatherByLocation[this.selectedCourt.id].byHour;
            }
            
            const key = `${dateStr}_${hour}`;
            if (!weatherData[key]) return null;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(dateStr + 'T00:00:00');
            const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            
            // Solo mostrar clima para los próximos 8 días
            if (diffDays < 0 || diffDays > 8) return null;
            
            return weatherData[key];
        },
        
        getStatusClass(status) {
            switch (status) {
                case 'Reservada':
                    return 'status-reserved';
                case 'Completada':
                    return 'status-completed';
                case 'Cancelada':
                    return 'status-cancelled';
                default:
                    return '';
            }
        }
    },
    
    async mounted() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            this.$nextTick(() => {
                lucide.createIcons();
            });
        }
        
        // Verificar si hay sesión activa
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && ApiService.isAuthenticated()) {
            try {
                this.user = JSON.parse(savedUser);
                this.currentView = 'dashboard';
                
                // Cargar datos del usuario
                await this.loadUserReservations();
                await this.loadCourtsFromAPI();
                
                console.log('Sesión restaurada:', `${this.user.nombre} ${this.user.apellido}`);
            } catch (error) {
                console.error('Error restaurando sesión:', error);
                // Si hay error, limpiar sesión
                ApiService.logout();
                localStorage.removeItem('currentUser');
                this.user = null;
                this.currentView = 'auth';
            }
        } else {
            // No hay sesión, mostrar login
            this.currentView = 'auth';
        }
        
        // Load existing reservations from localStorage as fallback
        this.loadReservations();
        
        // Load weather data
        this.fetchWeatherData();
        
        // Log initial state
        console.log('App montada. Modo:', ApiService.isAuthenticated() ? 'Autenticado' : 'No autenticado');
    },
    
    watch: {
        // Save reservations to localStorage whenever they change
        reservations: {
            handler(newReservations) {
                localStorage.setItem('courtReservations', JSON.stringify(newReservations));
                console.log('Reservas guardadas en localStorage:', newReservations.length);
            },
            deep: true
        },
        
        // Reload reservations when user changes (login/logout)
        user: {
            handler(newUser) {
                if (newUser) {
                    // User logged in, reload reservations
                    this.loadReservations();
                    console.log('Usuario logueado:', `${newUser.nombre} ${newUser.apellido}`);
                    console.log('Reservas del usuario:', this.userReservations.length);
                } else {
                    console.log('Usuario deslogueado');
                }
            },
            deep: true
        },
        
        // Re-initialize Lucide icons when view changes
        currentView() {
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        },
        
        // Re-initialize Lucide icons when dashboard tab changes
        activeDashboardTab() {
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        },
        
        // Re-initialize Lucide icons when reservations are loaded
        userReservations() {
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    }
});

// Mount the app and make it globally accessible
window.app = app.mount('#app');

console.log('✅ Aplicación Vue montada correctamente');
console.log('👤 Acceso global disponible mediante: window.app');
