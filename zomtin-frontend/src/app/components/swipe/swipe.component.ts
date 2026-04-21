import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/user.model';

@Component({
  selector: 'app-swipe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="swipe-page">
      <h2 class="page-title">Ki legyen a párod? 💀</h2>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Friss húst keresünk...</p>
        </div>
      } @else if (candidates().length === 0) {
        <div class="empty-state">
          <span class="big-emoji">🪦</span>
          <h3>Nincs több jelölt</h3>
          <p>Mindenkit megnéztél... vagy megettél.</p>
        </div>
      } @else if (currentCandidate(); as c) {
        <div class="card-stack">
          <div class="swipe-card" [class.swiping-left]="swipeDir === 'left'" [class.swiping-right]="swipeDir === 'right'">
            <div class="card-image">
              <img [src]="c.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + c.nickname"
                   [alt]="c.nickname">
              <div class="card-badge" [class.zombie]="c.type === 'zombie'">
                {{ c.type === 'zombie' ? '🧟 Zombi' : '🏃 Túlélő' }}
              </div>
            </div>
            <div class="card-info">
              <h3>{{ c.nickname }}{{ c.age ? ', ' + c.age : '' }}</h3>
              <p class="bio">{{ c.bio || 'Nincs bemutatkozás...' }}</p>
              <span class="status-badge">{{ c.status === 'undead' ? '💀 Élőhalott' : '✨ Életben' }}</span>
            </div>

            <div class="card-actions">
              <button class="action-btn dislike" (click)="onSwipe('dislike')">
                👎<span>Nem kell</span>
              </button>
              <button class="action-btn like" (click)="onSwipe('like')">
                ❤️<span>Tetszik</span>
              </button>
            </div>
          </div>
        </div>

        @if (matchPopup()) {
          <div class="match-overlay" (click)="matchPopup.set(false)">
            <div class="match-popup">
              <span class="match-emoji">💕</span>
              <h2>Match!</h2>
              <p>Összejöttetek! (Vagy csak vacsorameghívás?)</p>
              <button class="btn-primary" (click)="matchPopup.set(false)">Tovább</button>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .swipe-page {
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
      min-height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-title {
      color: #3fb950;
      margin: 1rem 0;
      font-size: 1.4rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 4rem;
      color: #888;
    }

    .spinner {
      width: 48px; height: 48px;
      border: 4px solid #2d333b;
      border-top-color: #3fb950;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      margin-top: 4rem;
      color: #888;
    }

    .big-emoji { font-size: 4rem; }
    .empty-state h3 { color: #ccc; margin: 1rem 0 0.5rem; }

    .card-stack { width: 100%; }

    .swipe-card {
      background: #161b22;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      transition: transform 0.3s, opacity 0.3s;
    }

    .swipe-card.swiping-left {
      transform: translateX(-120%) rotate(-15deg);
      opacity: 0;
    }

    .swipe-card.swiping-right {
      transform: translateX(120%) rotate(15deg);
      opacity: 0;
    }

    .card-image {
      position: relative;
      width: 100%;
      height: 320px;
      overflow: hidden;
      background: #0d1117;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.35rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(123, 47, 242, 0.9);
      color: #fff;
    }

    .card-badge.zombie {
      background: rgba(63, 185, 80, 0.9);
    }

    .card-info {
      padding: 1.25rem;
    }

    .card-info h3 {
      color: #fff;
      margin: 0 0 0.3rem;
      font-size: 1.4rem;
    }

    .location { color: #888; font-size: 0.9rem; margin: 0 0 0.5rem; }
    .bio { color: #ccc; font-size: 0.95rem; margin: 0 0 0.75rem; line-height: 1.4; }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: #ccc;
      font-size: 0.85rem;
    }

    .level-bar {
      flex: 1;
      height: 8px;
      background: #2d333b;
      border-radius: 4px;
      overflow: hidden;
    }

    .level-fill {
      height: 100%;
      background: linear-gradient(90deg, #3fb950, #56d364);
      border-radius: 4px;
      transition: width 0.3s;
    }

    .interests {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .tag {
      background: rgba(63, 185, 80, 0.15);
      color: #3fb950;
      padding: 0.25rem 0.6rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }

    .card-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 1rem 1.25rem 1.5rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.75rem 1.5rem;
      border: 2px solid #2d333b;
      border-radius: 1rem;
      background: transparent;
      color: #ccc;
      font-size: 1.8rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      min-width: 80px;
    }

    .action-btn span { font-size: 0.75rem; }

    .action-btn.dislike:hover { border-color: #888; background: rgba(136,136,136,0.1); }
    .action-btn.like:hover { border-color: #3fb950; background: rgba(63,185,80,0.1); }
    .action-btn.eat:hover { border-color: #d29922; background: rgba(255,152,0,0.1); }

    .match-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }

    .match-popup {
      background: #161b22;
      padding: 2.5rem;
      border-radius: 1.5rem;
      text-align: center;
      animation: popIn 0.4s ease;
    }

    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .match-emoji { font-size: 4rem; }
    .match-popup h2 { color: #3fb950; font-size: 2rem; margin: 0.5rem 0; }
    .match-popup p { color: #ccc; margin-bottom: 1.5rem; }

    .btn-primary {
      padding: 0.75rem 2rem;
      background: #3fb950;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    @media (max-width: 600px) {
      .card-image { height: 250px; }
      .action-btn {
        padding: 1rem 1.25rem;
        font-size: 2rem;
        min-width: 70px;
      }
    }
  `]
})
export class SwipeComponent implements OnInit {
  candidates = signal<Profile[]>([]);
  currentIndex = signal(0);
  loading = signal(true);
  matchPopup = signal(false);
  swipeDir: 'left' | 'right' | null = null;

  constructor(
    private matchService: MatchService,
    public auth: AuthService
  ) {}

  currentCandidate = () => this.candidates()[this.currentIndex()] as Profile | undefined;

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.loading.set(true);
    this.matchService.getCandidates().subscribe({
      next: (profiles) => {
        this.candidates.set(profiles);
        this.currentIndex.set(0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSwipe(direction: 'like' | 'dislike'): void {
    const candidate = this.currentCandidate();
    if (!candidate) return;

    this.swipeDir = direction === 'like' ? 'right' : 'left';

    this.matchService.swipe({ swiped_id: candidate.user_id, direction }).subscribe({
      next: (res) => {
        if (res.match) {
          this.matchPopup.set(true);
        }
      }
    });

    setTimeout(() => {
      this.swipeDir = null;
      if (this.currentIndex() < this.candidates().length - 1) {
        this.currentIndex.update(i => i + 1);
      } else {
        this.candidates.set([]);
      }
    }, 300);
  }
}
