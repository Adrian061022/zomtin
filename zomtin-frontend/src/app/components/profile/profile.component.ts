import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <h2 class="page-title">👤 Profilom</h2>

      @if (!editing()) {
        <div class="profile-card">
          <div class="profile-header">
            <img [src]="profile()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name"
                 [alt]="profile()?.nickname || user()?.name" class="avatar">
            <div>
              <h3>{{ profile()?.nickname || user()?.name }}</h3>
              <span class="user-type" [class.zombie]="profile()?.type === 'zombie'">
                {{ profile()?.type === 'zombie' ? '🧟 Zombi' : '🏃 Túlélő' }}
              </span>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail">
              <span class="label">Email:</span>
              <span>{{ user()?.email }}</span>
            </div>
            <div class="detail">
              <span class="label">Kor:</span>
              <span>{{ profile()?.age || 'Nincs megadva' }}</span>
            </div>
            <div class="detail">
              <span class="label">Státusz:</span>
              <span>{{ profile()?.status === 'undead' ? '💀 Élőhalott' : profile()?.status === 'alive' ? '✨ Életben' : '☠️ Halott' }}</span>
            </div>
            <div class="detail">
              <span class="label">Bemutatkozás:</span>
              <span>{{ profile()?.bio || 'Nincs megadva' }}</span>
            </div>
          </div>

          <button class="btn-primary" (click)="startEdit()">✏️ Szerkesztés</button>

          @if (!profile()) {
            <p class="no-profile-hint">⚠️ Még nincs profilod! Kattints a szerkesztésre a létrehozáshoz.</p>
          }
        </div>
      } @else {
        <div class="profile-card">
          @if (errorMsg) {
            <div class="error-banner">{{ errorMsg }}</div>
          }
          @if (successMsg) {
            <div class="success-banner">{{ successMsg }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSave()">
            <div class="form-group">
              <label>Típus</label>
              <div class="type-selector">
                <button type="button" class="type-btn" [class.selected]="form.get('type')?.value === 'zombie'"
                        (click)="form.get('type')?.setValue('zombie')">🧟 Zombi</button>
                <button type="button" class="type-btn" [class.selected]="form.get('type')?.value === 'survivor'"
                        (click)="form.get('type')?.setValue('survivor')">🏃 Túlélő</button>
              </div>
            </div>
            <div class="form-group">
              <label>Becenév</label>
              <input formControlName="nickname">
            </div>
            <div class="form-group">
              <label>Kor</label>
              <input type="number" formControlName="age">
            </div>
            <div class="form-group">
              <label>Bemutatkozás</label>
              <textarea formControlName="bio" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Avatar URL</label>
              <input formControlName="avatar">
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="editing.set(false)">Mégse</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
                {{ saving() ? 'Mentés...' : 'Mentés' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .page-title {
      color: #3fb950;
      margin: 1rem 0;
      font-size: 1.4rem;
    }

    .profile-card {
      background: #161b22;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #3fb950;
    }

    .profile-header h3 { color: #fff; margin: 0 0 0.3rem; font-size: 1.3rem; }

    .user-type {
      color: #7b2ff2;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .user-type.zombie { color: #3fb950; }

    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .detail {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .detail .label {
      color: #888;
      min-width: 120px;
    }

    .detail span:not(.label):not(.tag) { color: #ddd; }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .tag {
      background: rgba(63, 185, 80, 0.15);
      color: #3fb950;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }

    .form-group { margin-bottom: 1rem; }

    .type-selector {
      display: flex;
      gap: 0.75rem;
    }

    .type-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #2d333b;
      border-radius: 0.5rem;
      background: #0d1117;
      color: #ccc;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .type-btn.selected {
      border-color: #3fb950;
      color: #3fb950;
      background: rgba(63, 185, 80, 0.1);
    }

    .no-profile-hint {
      color: #d29922;
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    label {
      display: block;
      color: #ccc;
      margin-bottom: 0.35rem;
      font-size: 0.9rem;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #2d333b;
      border-radius: 0.5rem;
      background: #0d1117;
      color: #fff;
      font-size: 1rem;
      box-sizing: border-box;
      font-family: inherit;
    }

    input:focus, textarea:focus { outline: none; border-color: #3fb950; }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      flex: 1;
      padding: 0.75rem;
      background: #3fb950;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover:not(:disabled) { background: #2ea043; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      background: transparent;
      color: #ccc;
      border: 2px solid #2d333b;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .btn-secondary:hover { border-color: #888; }

    .error-banner {
      background: rgba(63, 185, 80, 0.15);
      color: #3fb950;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .success-banner {
      background: rgba(123, 47, 242, 0.15);
      color: #7b2ff2;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user = () => this.auth.currentUser();
  profile = () => this.auth.currentUser()?.profile;
  editing = signal(false);
  saving = signal(false);
  form!: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const p = this.profile();
    this.form = this.fb.group({
      type: [p?.type || 'zombie', Validators.required],
      nickname: [p?.nickname || '', Validators.required],
      age: [p?.age || ''],
      bio: [p?.bio || ''],
      avatar: [p?.avatar || '']
    });
  }

  startEdit(): void {
    this.initForm();
    this.editing.set(true);
    this.errorMsg = '';
    this.successMsg = '';
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.errorMsg = '';
    this.successMsg = '';

    this.auth.updateProfile(this.form.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMsg = 'Profil sikeresen frissítve!';
        setTimeout(() => this.editing.set(false), 1000);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg = err.error?.message || 'Hiba történt a mentés során.';
      }
    });
  }
}
