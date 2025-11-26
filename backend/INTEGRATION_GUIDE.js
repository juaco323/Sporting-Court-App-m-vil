// INSTRUCCIONES DE INTEGRACIÓN PARA vue-app.js
// Este archivo contiene los cambios necesarios para integrar el frontend con el backend

/*
CAMBIOS PRINCIPALES A REALIZAR:

1. AUTENTICACIÓN - Modificar handleLogin():
   - Reemplazar lógica de localStorage por ApiService.login()
   - Guardar usuario desde ApiService.getCurrentUser()

2. AUTENTICACIÓN - Modificar handleRegister():
   - Usar ApiService.register() en lugar de localStorage

3. LOGOUT - Modificar logout():
   - Llamar a ApiService.logout()

4. CANCHAS - Modificar getAvailableCourts():
   - Usar ApiService.getCourts(sport) en lugar de courtsData local

5. RESERVAS - Modificar confirmReservation():
   - Usar ApiService.createReservation() en lugar de localStorage

6. RESERVAS - Modificar loadReservations():
   - Usar ApiService.getMyReservations() en lugar de localStorage

7. CANCELAR RESERVA - Modificar confirmCancelReservation():
   - Usar ApiService.cancelReservation()

8. MODIFICAR RESERVA - Modificar changeReservationTime():
   - Usar ApiService.updateReservation()

9. INICIALIZACIÓN - Modificar mounted():
   - Verificar autenticación con ApiService.isAuthenticated()
   - Cargar usuario con ApiService.getCurrentUser()

10. CARGAR CANCHAS - Agregar método loadCourts():
    - Cargar canchas desde API al iniciar

EJEMPLO DE CAMBIOS:
*/

// ===== ANTES =====
/*
async handleLogin() {
    if (!this.loginForm.rut || !this.loginForm.password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Simulación de login
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.rut === this.loginForm.rut);
    
    if (user && user.password === this.loginForm.password) {
        this.user = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentView = 'dashboard';
        this.loginForm = { rut: '', password: '' };
    } else {
        alert('Credenciales incorrectas');
    }
},
*/

// ===== DESPUÉS =====
/*
async handleLogin() {
    if (!this.loginForm.rut || !this.loginForm.password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        // Login con el backend
        const loginData = await ApiService.login(this.loginForm.rut, this.loginForm.password);
        
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
        await this.loadReservations();
        
        alert('¡Bienvenido!');
    } catch (error) {
        console.error('Error en login:', error);
        alert('Credenciales incorrectas: ' + error.message);
    }
},
*/

// ===== CÓDIGO COMPLETO DE INTEGRACIÓN =====
// Copiar y pegar estos métodos en vue-app.js reemplazando los existentes:

const integratedMethods = {
    // AUTENTICACIÓN
    async handleLogin() {
        if (!this.loginForm.rut || !this.loginForm.password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        try {
            // Usar email en lugar de RUT (ajustar según tu lógica)
            const email = this.loginForm.rut.includes('@') ? this.loginForm.rut : `${this.loginForm.rut}@unab.cl`;
            
            await ApiService.login(email, this.loginForm.password);
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
            
            await this.loadReservations();
            await this.loadCourts();
            
            alert('¡Bienvenido!');
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
            await ApiService.register({
                email: form.email,
                password: form.password,
                full_name: `${form.nombre} ${form.apellido}`
            });
            
            alert('¡Registro exitoso! Ahora puedes iniciar sesión');
            this.activeAuthTab = 'login';
            this.registerForm = {
                nombre: '',
                apellido: '',
                rut: '',
                email: '',
                password: ''
            };
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
    },

    // CARGAR CANCHAS DESDE API
    async loadCourts() {
        try {
            const allCourts = await ApiService.getCourts();
            
            // Transformar datos de la API al formato del frontend
            this.courtsData = {
                'Fútbol': [],
                'Tenis': [],
                'Pádel': []
            };
            
            allCourts.forEach(court => {
                const courtData = {
                    id: court.court_id,
                    dbId: court.id, // Guardar el ID de la base de datos
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
                
                if (this.courtsData[court.sport]) {
                    this.courtsData[court.sport].push(courtData);
                }
            });
            
            // Actualizar contador de canchas disponibles
            this.sportsData.forEach(sport => {
                sport.available = this.courtsData[sport.name]?.length || 0;
            });
        } catch (error) {
            console.error('Error cargando canchas:', error);
            // Mantener datos locales como fallback
        }
    },

    // CARGAR RESERVAS DESDE API
    async loadReservations() {
        if (!ApiService.isAuthenticated()) {
            this.userReservations = [];
            return;
        }
        
        this.isLoadingReservations = true;
        try {
            const reservations = await ApiService.getMyReservations();
            
            // Transformar datos de la API al formato del frontend
            this.userReservations = reservations.map(res => ({
                id: res.id,
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
        } catch (error) {
            console.error('Error cargando reservas:', error);
            this.userReservations = [];
        } finally {
            this.isLoadingReservations = false;
        }
    },

    // CREAR RESERVA
    async confirmReservation() {
        if (!this.selectedDate || !this.selectedTime || !this.selectedCourt) {
            alert('Por favor selecciona fecha y hora');
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
            
            if (this.modifyingReservation && this.selectedReservation) {
                // Actualizar reserva existente
                await ApiService.updateReservation(this.selectedReservation.id, {
                    date: this.selectedDate,
                    time: this.selectedTime
                });
                
                alert('Reserva modificada exitosamente');
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
            }
            
            this.hideConfirmDialog();
            
            // Recargar reservas
            await this.loadReservations();
            
            if (!this.modifyingReservation) {
                this.currentView = 'success';
            } else {
                this.modifyingReservation = false;
                this.selectedReservation = null;
                this.backToDashboard();
                this.activeDashboardTab = 'reservations';
            }
        } catch (error) {
            console.error('Error creando/modificando reserva:', error);
            alert('Error al procesar la reserva: ' + error.message);
        }
    },

    // CANCELAR RESERVA
    async confirmCancelReservation() {
        if (!this.selectedReservation) return;
        
        try {
            await ApiService.cancelReservation(this.selectedReservation.id);
            
            alert('Reserva cancelada exitosamente');
            this.hideCancelDialog();
            this.selectedReservation = null;
            
            // Recargar reservas
            await this.loadReservations();
        } catch (error) {
            console.error('Error cancelando reserva:', error);
            alert('Error al cancelar la reserva: ' + error.message);
        }
    }
};

// INSTRUCCIONES FINALES:
// 1. Abre vue-app.js
// 2. Busca cada método mencionado arriba
// 3. Reemplázalo con la versión integrada
// 4. Agrega el método loadCourts() en el mounted()
// 5. Prueba la integración

console.log('Archivo de integración cargado. Ver instrucciones arriba.');
