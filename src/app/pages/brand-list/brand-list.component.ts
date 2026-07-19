import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarDataService } from '../../core/services/car-data.service';

@Component({
  selector: 'wv-brand-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <section class="wv-shell wv-page-head">
      <span class="wv-eyebrow">ALL BRANDS</span>
      <h1 class="wv-h1">Pick a manufacturer</h1>
      <p class="wv-muted" style="max-width:56ch;">
        Every brand page lists its full model line-up with pricing, reviews and spare parts —
        currently covering Maruti Suzuki, Hyundai, Tata Motors and Mahindra.
      </p>
    </section>

    <section class="wv-shell wv-brand-grid">
      @for (brand of brands$ | async; track brand.slug) {
        <a [routerLink]="['/brands', brand.slug]" class="wv-brand-tile">
          <div class="wv-brand-tile__logo-wrap">
            <span class="wv-brand-tile__mono">{{ brand.monogram }}</span>
            @if (brand.logoPath) {
              <img
                [src]="'assets/img/' + brand.logoPath"
                [alt]="brand.name + ' logo'"
                class="wv-brand-tile__logo-img"
                (error)="$any($event.target).style.display = 'none'"
              />
            }
          </div>
          <div>
            <h2 class="wv-h3">{{ brand.name }}</h2>
            <p class="wv-muted" style="margin:6px 0 0;">{{ brand.tagline }}</p>
          </div>
          <span class="wv-brand-tile__meta wv-muted">
            Since {{ brand.founded }} · {{ brand.headquarters }}
          </span>
        </a>
      }
    </section>
  `,
  styles: [
    `
      .wv-page-head {
        padding-top: clamp(40px, 6vw, 72px);
        padding-bottom: 40px;
        border-bottom: 1px solid var(--wv-line);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .wv-brand-grid {
        padding-top: 40px;
        padding-bottom: 64px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .wv-brand-tile {
        border: 1px solid var(--wv-line);
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: space-between;
        min-height: 220px;
        transition: border-color 0.15s ease, transform 0.15s ease;
      }
      .wv-brand-tile:hover {
        border-color: var(--wv-black);
        transform: translateY(-2px);
      }
      .wv-brand-tile__mono {
        font-family: var(--wv-font-display);
        font-size: 2.2rem;
        color: var(--wv-grey-300);
      }
      .wv-brand-tile__logo-wrap {
        position: relative;
        height: 44px;
        display: flex;
        align-items: center;
      }
      .wv-brand-tile__logo-img {
        position: absolute;
        inset: 0;
        height: 100%;
        width: auto;
        max-width: 180px;
        object-fit: contain;
        object-position: left center;
        background: var(--wv-white);
      }
      .wv-brand-tile__meta {
        font-size: 0.8rem;
      }
      @media (max-width: 720px) {
        .wv-brand-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BrandListComponent {
  private carData = inject(CarDataService);
  brands$ = this.carData.getBrands();
}
