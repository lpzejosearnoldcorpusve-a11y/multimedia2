export interface Usuario {
  id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
  last_login: string | null;
  role: string | null;
  profile_image: string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
