export interface Profile {
  id: number;
  user_id: number;
  type: 'zombie' | 'survivor';
  nickname: string;
  bio: string | null;
  avatar: string | null;
  age: number | null;
  status: 'undead' | 'alive' | 'dead';
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  profile?: Profile | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
