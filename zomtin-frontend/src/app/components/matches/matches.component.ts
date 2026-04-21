import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe],
  template: `
    <div class="matches-page">
      <h2 class="page-title">❤️ Matcheid</h2>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else if (matches().length === 0) {
        <div class="empty-state">
          <span class="big-emoji">💔</span>
          <h3>Még nincsenek matcheid</h3>
          <p>Swipe-olj, hátha valaki rád harap!</p>
        </div>
      } @else {
        <div class="match-list">
          @for (match of matches(); track match.match_id) {
            <a [routerLink]="['/chat', match.match_id]" class="match-item">
              <img [src]="match.partner.profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + match.partner.name"
                   [alt]="match.partner.name" class="match-avatar">
              <div class="match-info">
                <div class="match-header">
                  <h4>{{ match.partner.profile?.nickname || match.partner.name }}</h4>
                  <span class="match-type" [class.zombie]="match.partner.profile?.type === 'zombie'">
                    {{ match.partner.profile?.type === 'zombie' ? '🧟' : '🏃' }}
                  </span>
                </div>
                <span class="match-time">{{ match.created_at | timeAgo }}</span>
              </div>
              @if (!eatenIds().has(match.match_id)) {
              <button class="eat-btn" (click)="eatMatch($event, match.match_id)" title="Megettem!">🍽️</button>
              } @else {
              <span class="eaten-badge">🦴 Megéve</span>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .matches-page {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .page-title {
      color: #3fb950;
      margin: 1rem 0;
      font-size: 1.4rem;
    }

    .loading { display: flex; justify-content: center; margin-top: 3rem; }
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

    .match-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .match-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #161b22;
      border-radius: 0.75rem;
      text-decoration: none;
      transition: background 0.2s;
    }

    .match-item:hover { background: #1c2128; }

    .match-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #3fb950;
      flex-shrink: 0;
    }

    .match-info { flex: 1; min-width: 0; }

    .match-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .match-header h4 {
      color: #fff;
      margin: 0;
      font-size: 1.05rem;
    }

    .last-msg {
      color: #888;
      font-size: 0.85rem;
      margin: 0.2rem 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .match-time {
      color: #666;
      font-size: 0.75rem;
    }

    .eat-btn {
      background: none;
      border: 2px solid #d29922;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.3rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .eat-btn:hover { background: rgba(210,153,34,0.15); transform: scale(1.1); }

    .eaten-badge {
      color: #d29922;
      font-size: 0.85rem;
      font-weight: 600;
      flex-shrink: 0;
      padding: 0.3rem 0.6rem;
      border: 2px solid #d29922;
      border-radius: 1rem;
      opacity: 0.8;
    }
  `]
})
export class MatchesComponent implements OnInit {
  matches = signal<Match[]>([]);
  loading = signal(true);
  eatenIds = signal<Set<number>>(new Set());

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading.set(true);
    this.matchService.getMatches().subscribe({
      next: (m) => {
        this.matches.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  eatMatch(event: Event, matchId: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Biztosan meg akarod enni? 🧟‍♂️')) return;
    this.matchService.eatMatch(matchId).subscribe({
      next: () => this.eatenIds.update(s => new Set(s).add(matchId)),
      error: () => alert('Nem sikerült megenni... 😢')
    });
  }
}
