import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  // Ajustable a lo que retorne el backend
  token?: string;           // Si retorna "token" directamente
  access?: string;          // Si retorna JWT access token
  access_token?: string;    // Si retorna estándar OAuth
  user?: any;               // Si retorna la data del usuario
  [key: string]: any;       // Permitir otros campos
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Definimos el endpoint y que no requiere auth para logugearse
    const response = await api.post<LoginResponse>('/auth/login/', credentials, { 
      requiresAuth: false 
    });
    return response;
  }
};
