import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api';
  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('zt_token');
    const user = localStorage.getItem('zt_user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isLoggedIn.set(true);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('zt_token');
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: () => {},
    });
    // Kis késleltetéssel töröljük, hogy az interceptor még megtalálja a tokent
    setTimeout(() => {
      localStorage.removeItem('zt_token');
      localStorage.removeItem('zt_user');
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
      this.router.navigate(['/login']);
    }, 100);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profile`, data).pipe(
      tap(profile => {
        const user = this.currentUser();
        if (user) {
          user.profile = profile;
          this.currentUser.set({ ...user });
          localStorage.setItem('zt_user', JSON.stringify(user));
        }
      })
    );
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem('zt_token', res.token);
    localStorage.setItem('zt_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.isLoggedIn.set(true);
  }
}
