export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}
