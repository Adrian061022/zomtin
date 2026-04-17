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
            <img [src]="user()?.profile_image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name"
                 [alt]="user()?.name" class="avatar">
            <div>
              <h3>{{ user()?.name }}</h3>
              <span class="user-type" [class.zombie]="user()?.type === 'zombie'">
                {{ user()?.type === 'zombie' ? '🧟 Zombi' : '🏃 Túlélő' }}
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
              <span>{{ user()?.age }}</span>
            </div>
            <div class="detail">
              <span class="label">Hely:</span>
              <span>{{ user()?.location }}</span>
            </div>
            <div class="detail">
              <span class="label">Bemutatkozás:</span>
              <span>{{ user()?.bio || 'Nincs megadva' }}</span>
            </div>

            @if (user()?.interests?.length) {
              <div class="detail">
                <span class="label">Érdeklődés:</span>
                <div class="tags">
                  @for (interest of user()?.interests; track interest) {
                    <span class="tag">{{ interest }}</span>
                  }
                </div>
              </div>
            }
          </div>

          <button class="btn-primary" (click)="startEdit()">✏️ Szerkesztés</button>
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
              <label>Név</label>
              <input formControlName="name">
            </div>
            <div class="form-group">
              <label>Kor</label>
              <input type="number" formControlName="age">
            </div>
            <div class="form-group">
              <label>Helyszín</label>
              <input formControlName="location">
            </div>
            <div class="form-group">
              <label>Bemutatkozás</label>
              <textarea formControlName="bio" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Profilkép URL</label>
              <input formControlName="profile_image">
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
      color: #e94560;
      margin: 1rem 0;
      font-size: 1.4rem;
    }

    .profile-card {
      background: #16213e;
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
      border: 3px solid #e94560;
    }

    .profile-header h3 { color: #fff; margin: 0 0 0.3rem; font-size: 1.3rem; }

    .user-type {
      color: #2ec4b6;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .user-type.zombie { color: #e94560; }

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
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }

    .form-group { margin-bottom: 1rem; }

    label {
      display: block;
      color: #ccc;
      margin-bottom: 0.35rem;
      font-size: 0.9rem;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #2a2a4a;
      border-radius: 0.5rem;
      background: #0f3460;
      color: #fff;
      font-size: 1rem;
      box-sizing: border-box;
      font-family: inherit;
    }

    input:focus, textarea:focus { outline: none; border-color: #e94560; }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      flex: 1;
      padding: 0.75rem;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover:not(:disabled) { background: #c73550; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      background: transparent;
      color: #ccc;
      border: 2px solid #2a2a4a;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .btn-secondary:hover { border-color: #888; }

    .error-banner {
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .success-banner {
      background: rgba(46, 196, 182, 0.15);
      color: #2ec4b6;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user = () => this.auth.currentUser();
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
    const u = this.user();
    this.form = this.fb.group({
      name: [u?.name || '', Validators.required],
      age: [u?.age || '', Validators.required],
      location: [u?.location || ''],
      bio: [u?.bio || ''],
      profile_image: [u?.profile_image || '']
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
