import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wv-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="wv-footer">
      <div class="wv-shell wv-footer__grid">
        <div class="wv-footer__brand">
          <img src="assets/img/wheelvault-logo.svg" alt="WheelVault" height="26" style="filter: invert(1);" />
          <p class="wv-muted" style="color:#9a9a96; max-width: 320px; margin-top: 14px;">
            Ex-showroom &amp; on-road prices, EMI guidance, owner reviews and spare parts info —
            for every major car brand on Indian roads.
          </p>
        </div>

        <div>
          <h4 class="wv-footer__heading">Navigation</h4>
          <a routerLink="/">Home</a>
          <a routerLink="/brands">All brands</a>
        </div>

        <div>
          <h4 class="wv-footer__heading">Popular brands</h4>
          <a routerLink="/brands/maruti-suzuki">Maruti Suzuki</a>
          <a routerLink="/brands/hyundai">Hyundai</a>
          <a routerLink="/brands/tata-motors">Tata Motors</a>
          <a routerLink="/brands/mahindra">Mahindra</a>
        </div>

        <div>
          <h4 class="wv-footer__heading">About this data</h4>
          <p class="wv-muted" style="color:#9a9a96; font-size: 0.85rem;">
            Prices shown are indicative on-road estimates for reference only. Always confirm
            current ex-showroom price, RTO charges and insurance with an authorised dealer
            before booking.
          </p>
        </div>
      </div>

      <div class="wv-shell wv-footer__bottom">
        <span>© {{ year }} WheelVault. Built for the Indian car buyer.</span>
        <span>Open-source on GitHub</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .wv-footer {
        background: var(--wv-panel-bg);
        color: var(--wv-panel-text);
        padding-top: 56px;
      }
      .wv-footer__grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.4fr;
        gap: 32px;
        padding-bottom: 40px;
      }
      .wv-footer__grid a {
        display: block;
        color: rgba(250, 250, 249, 0.7);
        padding: 6px 0;
        font-size: 0.92rem;
      }
      .wv-footer__grid a:hover {
        color: var(--wv-panel-text);
      }
      .wv-footer__heading {
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--wv-panel-muted);
        margin-bottom: 12px;
        font-family: var(--wv-font-body);
        font-weight: 600;
      }
      .wv-footer__bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        font-size: 0.78rem;
        color: var(--wv-panel-muted);
      }
      @media (max-width: 780px) {
        .wv-footer__grid {
          grid-template-columns: 1fr 1fr;
        }
        .wv-footer__bottom {
          flex-direction: column;
          gap: 6px;
        }
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
