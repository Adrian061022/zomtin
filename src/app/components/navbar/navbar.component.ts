import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/swipe" class="logo">🧟 ZombiTinder</a>

      @if (auth.isLoggedIn()) {
        <div class="nav-links">
          <a routerLink="/swipe" routerLinkActive="active" class="nav-link" title="Swipe">
            <span class="icon">💀</span>
            <span class="label">Swipe</span>
          </a>
          <a routerLink="/matches" routerLinkActive="active" class="nav-link" title="Matchek">
            <span class="icon">❤️</span>
            <span class="label">Matchek</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-link" title="Profil">
            <span class="icon">👤</span>
            <span class="label">Profil</span>
          </a>
          <button (click)="auth.logout()" class="nav-link logout-btn" title="Kijelentkezés">
            <span class="icon">🚪</span>
            <span class="label">Kilépés</span>
          </button>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: #1a1a2e;
      border-bottom: 2px solid #e94560;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 800;
      color: #e94560;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      color: #ccc;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }

    .nav-link:hover, .nav-link.active {
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
    }

    .icon { font-size: 1.2rem; }

    @media (max-width: 600px) {
      .navbar {
        padding: 0.5rem 0.75rem;
      }
      .label { display: none; }
      .nav-link { padding: 0.5rem; }
      .icon { font-size: 1.4rem; }
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
