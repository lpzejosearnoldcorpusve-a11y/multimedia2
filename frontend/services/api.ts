const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const api = {
  async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...customConfig } = options;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customConfig.headers as Record<string, string> || {}),
    };

    if (requiresAuth) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Asumiendo que se usa un Bearer token. Ajustar a 'Token' o como lo requiera el backend si varía.
          headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    const config: RequestInit = {
      ...customConfig,
      headers,
    };

    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Manejar errores retornados por la API
        const errorMessage = data?.detail || data?.message || data?.error || 'Ha ocurrido un error en la petición';
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body: any, options?: RequestOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: any, options?: RequestOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
