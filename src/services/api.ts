import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Court,
  Reservation,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreateReservationData,
} from '../types';
import { config } from '../config';

const API_BASE_URL = config.API_BASE_URL;
const API_VERSION = config.API_VERSION;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL + API_VERSION,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Interceptor para agregar token a las peticiones
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar respuestas de error
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  // ============ Autenticación ============

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await this.api.post<{ access_token: string; token_type: string }>(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Guardar token primero
    await AsyncStorage.setItem('auth_token', response.data.access_token);

    // Obtener datos del usuario
    const userResponse = await this.api.get<User>('/users/me');
    const normalizedUser = this.normalizeUser(userResponse.data);
    await AsyncStorage.setItem('user_data', JSON.stringify(normalizedUser));

    return {
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      user: normalizedUser,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<User>('/auth/register', data);

    // El registro retorna el usuario, ahora necesitamos hacer login para obtener el token
    const loginResponse = await this.login({
      email: data.email,
      password: data.password,
    });

    return loginResponse;
  }

  async loginWithFirebase(firebaseToken: string, email: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/firebase/login', {
      firebase_token: firebaseToken,
      email: email,
    });

    const normalizedUser = this.normalizeUser(response.data.user);
    await AsyncStorage.setItem('auth_token', response.data.access_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(normalizedUser));

    return {
      ...response.data,
      user: normalizedUser,
    };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('user_data');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return this.normalizeUser(user);
  }

  // ============ Canchas ============

  async getCourts(): Promise<Court[]> {
    const response = await this.api.get<Court[]>('/courts');
    return response.data.map(court => this.normalizeCourt(court));
  }

  async getCourtById(id: number): Promise<Court> {
    const response = await this.api.get<Court>(`/courts/${id}`);
    return this.normalizeCourt(response.data);
  }

  async getCourtsBySport(sport: string): Promise<Court[]> {
    const response = await this.api.get<Court[]>(`/courts/sport/${sport}`);
    return response.data.map(court => this.normalizeCourt(court));
  }

  // ============ Reservas ============

  async getMyReservations(): Promise<Reservation[]> {
    try {
      // Primero intentar con /reservations/me
      const response = await this.api.get<Reservation[]>('/reservations/me');
      return response.data;
    } catch (error: any) {
      // Si falla, obtener el user_id y usar /reservations?user_id=X
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Debe iniciar sesión para ver sus reservas');
      }
      const response = await this.api.get<Reservation[]>(`/reservations?user_id=${currentUser.id}`);
      return response.data;
    }
  }

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    try {
      // Obtener user_id del usuario actual
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Debe iniciar sesión para hacer una reserva');
      }

      // El backend espera "time" en lugar de "start_time"
      const reservationData = {
        user_id: currentUser.id,
        court_id: data.court_id,
        date: data.date,
        time: data.start_time, // El backend usa "time" en lugar de "start_time"
        status: 'pending',
      };
      
      console.log('Enviando reserva:', JSON.stringify(reservationData, null, 2));
      
      const response = await this.api.post<Reservation>('/reservations', reservationData);
      return response.data;
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  }

  async cancelReservation(id: number): Promise<void> {
    await this.api.delete(`/reservations/${id}`);
  }

  async getReservationById(id: number): Promise<Reservation> {
    const response = await this.api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  }

  // ============ Disponibilidad ============

  async checkAvailability(courtId: number, date: string): Promise<string[]> {
    const response = await this.api.get<string[]>(
      `/courts/${courtId}/availability?date=${date}`
    );
    return response.data;
  }

  // ============ Utilidades de normalización ============

  private normalizeUser(user: any): User {
    return {
      ...user,
      is_admin: user.is_admin === true || user.is_admin === 'true' || user.is_admin === 1,
      is_active: user.is_active === true || user.is_active === 'true' || user.is_active === 1,
    };
  }

  private normalizeCourt(court: any): Court {
    return {
      ...court,
      features: typeof court.features === 'string' 
        ? JSON.parse(court.features) 
        : court.features,
      is_active: court.is_active === true || court.is_active === 'true' || court.is_active === 1,
    };
  }
}

export default new ApiService();
