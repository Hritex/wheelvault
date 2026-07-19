import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wv-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="wv-shell wv-404">
      <span class="wv-eyebrow">404</span>
      <h1 class="wv-h1">This road doesn't go anywhere.</h1>
      <p class="wv-muted">The page you're looking for doesn't exist, or the model hasn't been added yet.</p>
      <a routerLink="/" class="wv-btn wv-btn-primary">Back to WheelVault</a>
    </section>
  `,
  styles: [
    `
      .wv-404 {
        padding: clamp(60px, 12vw, 140px) var(--wv-margin);
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    `,
  ],
})
export class NotFoundComponent {}
