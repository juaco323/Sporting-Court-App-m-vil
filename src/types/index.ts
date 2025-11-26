// Types for the UNAB Sporting Court Mobile App

export interface User {
  id: number;
  rut: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Court {
  id: number;
  court_id: string;
  name: string;
  sport: string;
  description: string;
  capacity: number;
  rating: number;
  price_per_hour: number;
  features: string[] | string; // Puede venir como array o string JSON del backend
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Reservation {
  id: number;
  user_id: number;
  court_id: number;
  date: string;
  time: string; // Campo que viene del backend (HH:MM:SS)
  duration?: number; // Duración en minutos
  start_time?: string; // Mantenemos para compatibilidad
  end_time?: string; // Mantenemos para compatibilidad
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string; // Notas opcionales
  created_at: string;
  updated_at?: string;
  court?: Court;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  rut: string;
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CreateReservationData {
  user_id?: number;
  court_id: number;
  date: string;
  start_time: string;
  end_time: string;
}
