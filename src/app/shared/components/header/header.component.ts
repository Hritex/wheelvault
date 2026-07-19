import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'wv-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="wv-header" [class.wv-header--scrolled]="scrolled()">
      <div class="wv-shell wv-header__inner">
        <a routerLink="/" class="wv-logo" aria-label="WheelVault home">
          <img src="assets/img/wheelvault-logo.svg" alt="WheelVault" height="28" />
        </a>

        <nav class="wv-nav-desktop" aria-label="Primary">
          <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/brands" routerLinkActive="is-active">Brands</a>
          <a href="#emi-calculator-anchor" (click)="menuOpen.set(false)">EMI Calculator</a>
        </nav>

        <div class="wv-header__right">
          <button
            class="wv-theme-toggle"
            type="button"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (theme.theme() === 'dark') {
              <span aria-hidden="true">☀</span>
            } @else {
              <span aria-hidden="true">☾</span>
            }
          </button>

          <button
            class="wv-menu-btn"
            type="button"
            (click)="menuOpen.set(!menuOpen())"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div class="wv-mobile-menu">
          <nav aria-label="Mobile">
            <a routerLink="/" (click)="menuOpen.set(false)">Home</a>
            <a routerLink="/brands" (click)="menuOpen.set(false)">Brands</a>
            <a href="#emi-calculator-anchor" (click)="menuOpen.set(false)">EMI Calculator</a>
          </nav>
          <p class="wv-mobile-menu__note">Prices &amp; specs are indicative — confirm with your nearest dealer.</p>
        </div>
      }
    </header>
  `,
  styles: [
    `
      .wv-header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: var(--wv-white);
        border-bottom: 1px solid var(--wv-line);
      }
      .wv-header__inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
      }
      .wv-logo {
        color: var(--wv-black);
        display: inline-flex;
        align-items: center;
      }
      .wv-nav-desktop {
        display: flex;
        gap: 32px;
        font-size: 0.92rem;
        font-weight: 500;
      }
      .wv-nav-desktop a {
        position: relative;
        padding: 6px 0;
      }
      .wv-nav-desktop a.is-active {
        color: var(--wv-black);
      }
      .wv-nav-desktop a.is-active::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 2px;
        background: var(--wv-accent);
      }
      .wv-header__right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .wv-theme-toggle {
        width: 40px;
        height: 40px;
        border: 1px solid var(--wv-line-strong);
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.05rem;
        color: var(--wv-black);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s ease, transform 0.15s ease;
      }
      .wv-theme-toggle:hover {
        border-color: var(--wv-black);
        transform: translateY(-1px);
      }
      .wv-menu-btn {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 40px;
        height: 40px;
        background: none;
        border: 1px solid var(--wv-line-strong);
        border-radius: var(--wv-radius);
      }
      .wv-menu-btn span {
        display: block;
        height: 1.5px;
        margin: 0 8px;
        background: var(--wv-black);
      }
      @media (max-width: 780px) {
        .wv-nav-desktop {
          display: none;
        }
        .wv-menu-btn {
          display: flex;
        }
      }
      .wv-mobile-menu {
        background: var(--wv-panel-bg);
        color: var(--wv-panel-text);
        padding: 24px var(--wv-margin) 40px;
      }
      .wv-mobile-menu nav {
        display: flex;
        flex-direction: column;
        gap: 18px;
        font-family: var(--wv-font-display);
        font-size: 1.6rem;
      }
      .wv-mobile-menu__note {
        margin-top: 28px;
        font-size: 0.8rem;
        color: var(--wv-panel-muted);
      }
    `,
  ],
})
export class HeaderComponent {
  theme = inject(ThemeService);
  menuOpen = signal(false);
  scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 8);
  }
}
