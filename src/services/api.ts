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
    await AsyncStorage.setItem('user_data', JSON.stringify(userResponse.data));

    return {
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      user: userResponse.data,
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

    await AsyncStorage.setItem('auth_token', response.data.access_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // ============ Canchas ============

  async getCourts(): Promise<Court[]> {
    const response = await this.api.get<Court[]>('/courts');
    // Parsear features si vienen como string
    return response.data.map(court => ({
      ...court,
      features: typeof court.features === 'string' 
        ? JSON.parse(court.features) 
        : court.features
    }));
  }

  async getCourtById(id: number): Promise<Court> {
    const response = await this.api.get<Court>(`/courts/${id}`);
    // Parsear features si vienen como string
    return {
      ...response.data,
      features: typeof response.data.features === 'string'
        ? JSON.parse(response.data.features)
        : response.data.features
    };
  }

  async getCourtsBySport(sport: string): Promise<Court[]> {
    const response = await this.api.get<Court[]>(`/courts/sport/${sport}`);
    // Parsear features si vienen como string
    return response.data.map(court => ({
      ...court,
      features: typeof court.features === 'string'
        ? JSON.parse(court.features)
        : court.features
    }));
  }

  // ============ Reservas ============

  async getMyReservations(): Promise<Reservation[]> {
    const response = await this.api.get<Reservation[]>('/reservations/me');
    return response.data;
  }

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    const response = await this.api.post<Reservation>('/reservations', data);
    return response.data;
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
}

export default new ApiService();
