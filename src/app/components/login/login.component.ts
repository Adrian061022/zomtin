import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>🧟 Bejelentkezés</h1>
        <p class="subtitle">Üdv újra az apokalipszisben!</p>

        @if (errorMsg) {
          <div class="error-banner">{{ errorMsg }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="zombi@undead.hu">
            @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
              <span class="error">Email megadása kötelező</span>
            }
            @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
              <span class="error">Érvénytelen email cím</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Jelszó</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••">
            @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
              <span class="error">Jelszó megadása kötelező</span>
            }
          </div>

          <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Betöltés...' : 'Bejelentkezés' }}
          </button>
        </form>

        <p class="switch-link">
          Még nincs fiókod? <a routerLink="/register">Regisztrálj!</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .auth-card {
      background: #16213e;
      border-radius: 1rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }

    h1 { color: #e94560; margin: 0 0 0.25rem; font-size: 1.8rem; }
    .subtitle { color: #888; margin: 0 0 1.5rem; }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      color: #ccc;
      margin-bottom: 0.35rem;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #2a2a4a;
      border-radius: 0.5rem;
      background: #0f3460;
      color: #fff;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #e94560;
    }

    .error {
      color: #e94560;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      display: block;
    }

    .error-banner {
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .btn-primary {
      width: 100%;
      padding: 0.85rem;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) { background: #c73550; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .switch-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #888;
    }

    .switch-link a {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/swipe']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Bejelentkezés sikertelen. Próbáld újra!';
      }
    });
  }
}
