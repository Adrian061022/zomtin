export interface User {
  id: number;
  name: string;
  email: string;
  type: 'zombie' | 'survivor';
  bio: string;
  profile_image: string;
  age: number;
  location: string;
  interests: string[];
  zombie_level?: number; // 1-10, only for zombies
  survival_skills?: string[]; // only for survivors
  created_at: string;
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
  type: 'zombie' | 'survivor';
}
