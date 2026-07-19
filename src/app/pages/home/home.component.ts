import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarDataService } from '../../core/services/car-data.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { map } from 'rxjs';

@Component({
  selector: 'wv-home',
  standalone: true,
  imports: [AsyncPipe, RouterLink, InrPipe, RatingStarsComponent],
  template: `
    <!-- 1.0 Hero -->
    <section class="wv-hero wv-shell">
      <div class="wv-hero__eyebrow-row">
        <span class="wv-eyebrow">01 — INDIA'S CAR INDEX</span>
        <span class="wv-eyebrow">EX-SHOWROOM · EMI · REVIEWS · SPARE PARTS</span>
      </div>
      <h1 class="wv-hero__title">
        Every car on<br />
        <span class="wv-hero__outline">Indian roads</span>,<br />
        decoded.
      </h1>
      <p class="wv-hero__sub wv-muted">
        Real ex-showroom &amp; on-road prices, down payment guidance, owner reviews and where
        to source spare parts — for Maruti Suzuki, Hyundai, Tata Motors, Mahindra and more.
      </p>
      <div class="wv-hero__actions">
        <a routerLink="/brands" class="wv-btn wv-btn-primary">Browse all brands</a>
        <a href="#emi-calculator-anchor" class="wv-btn wv-btn-outline">Try the EMI calculator</a>
      </div>
    </section>

    <!-- 2.0 Brands strip -->
    <section class="wv-section wv-shell">
      <div class="wv-section__head">
        <span class="wv-eyebrow">02 — BRANDS</span>
        <h2 class="wv-h2">Shop by manufacturer</h2>
      </div>
      <div class="wv-brand-strip">
        @for (brand of brands$ | async; track brand.slug) {
          <a [routerLink]="['/brands', brand.slug]" class="wv-brand-card">
            <div class="wv-brand-card__logo-wrap">
              <span class="wv-brand-card__mono">{{ brand.monogram }}</span>
              @if (brand.logoPath) {
                <img
                  [src]="'assets/img/' + brand.logoPath"
                  [alt]="brand.name + ' logo'"
                  class="wv-brand-card__logo-img"
                  (error)="$any($event.target).style.display = 'none'"
                />
              }
            </div>
            <span class="wv-brand-card__name">{{ brand.name }}</span>
            <span class="wv-brand-card__tag wv-muted">{{ brand.tagline }}</span>
          </a>
        }
      </div>
    </section>

    <!-- 3.0 Featured models -->
    <section class="wv-section wv-shell">
      <div class="wv-section__head">
        <span class="wv-eyebrow">03 — FEATURED</span>
        <h2 class="wv-h2">Popular right now</h2>
      </div>
      <div class="wv-grid8 wv-featured">
        @for (car of featured$ | async; track car.slug) {
          <a [routerLink]="['/brands', car.brandSlug, car.slug]" class="wv-car-card">
            <div class="wv-car-card__swatch" [style.background]="car.heroColor">
              @if (car.images?.[0]) {
                <img
                  [src]="'assets/img/' + car.images![0]"
                  [alt]="car.name"
                  (error)="$any($event.target).style.display = 'none'"
                />
              }
            </div>
            <div class="wv-car-card__body">
              <span class="wv-eyebrow">{{ car.bodyType }}</span>
              <h3 class="wv-h3">{{ car.name }}</h3>
              <wv-rating-stars [rating]="car.rating" [count]="car.reviewCount"></wv-rating-stars>
              <p class="wv-car-card__price">From {{ car.exShowroomMin | inr }}</p>
              <span class="wv-muted" style="font-size:0.82rem;">Ex-showroom</span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- 4.0 EMI calculator teaser -->
    <section class="wv-section wv-shell" id="emi-calculator-anchor">
      <div class="wv-section__head">
        <span class="wv-eyebrow">04 — PLAN THE PURCHASE</span>
        <h2 class="wv-h2">Work out your down payment &amp; EMI first</h2>
        <p class="wv-muted" style="max-width:60ch;">
          Every model page on WheelVault includes a live calculator so you can see the real
          monthly number before you visit a showroom — not just the ex-showroom price.
        </p>
      </div>
      <a routerLink="/brands" class="wv-btn wv-btn-accent">Pick a car to calculate</a>
    </section>

    <!-- 5.0 Why WheelVault -->
    <section class="wv-section wv-shell" style="border-bottom:none;">
      <div class="wv-section__head">
        <span class="wv-eyebrow">05 — WHY WHEELVAULT</span>
      </div>
      <div class="wv-grid8 wv-why">
        <div class="wv-why__item">
          <span class="wv-number-huge" style="font-size:2.4rem;">01</span>
          <h3 class="wv-h3">Real on-road math</h3>
          <p class="wv-muted">RTO, insurance and accessories folded into one honest number, not just the ex-showroom headline.</p>
        </div>
        <div class="wv-why__item">
          <span class="wv-number-huge" style="font-size:2.4rem;">02</span>
          <h3 class="wv-h3">Owner-written reviews</h3>
          <p class="wv-muted">Long-term ownership notes from real Indian cities and road conditions — not press-release praise.</p>
        </div>
        <div class="wv-why__item">
          <span class="wv-number-huge" style="font-size:2.4rem;">03</span>
          <h3 class="wv-h3">Spare parts, sorted</h3>
          <p class="wv-muted">Common part price ranges and where to source them genuine, per model.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .wv-hero {
        padding-top: clamp(40px, 8vw, 88px);
        padding-bottom: clamp(40px, 6vw, 72px);
        border-bottom: 1px solid var(--wv-line);
      }
      .wv-hero__eyebrow-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .wv-hero__title {
        font-size: clamp(2.6rem, 8vw, 6.4rem);
        line-height: 0.96;
        max-width: 14ch;
      }
      .wv-hero__outline {
        -webkit-text-stroke: 1.5px var(--wv-black);
        color: transparent;
      }
      .wv-hero__sub {
        max-width: 52ch;
        margin-top: 28px;
        font-size: 1.05rem;
      }
      .wv-hero__actions {
        display: flex;
        gap: 16px;
        margin-top: 32px;
        flex-wrap: wrap;
      }
      .wv-section__head {
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wv-brand-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .wv-brand-card {
        border: 1px solid var(--wv-line);
        padding: 28px 22px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: border-color 0.15s ease, transform 0.15s ease;
      }
      .wv-brand-card:hover {
        border-color: var(--wv-black);
        transform: translateY(-2px);
      }
      .wv-brand-card__mono {
        font-family: var(--wv-font-display);
        font-size: 1.6rem;
      }
      .wv-brand-card__logo-wrap {
        position: relative;
        height: 40px;
        display: flex;
        align-items: center;
      }
      .wv-brand-card__logo-img {
        position: absolute;
        inset: 0;
        height: 100%;
        width: auto;
        max-width: 140px;
        object-fit: contain;
        object-position: left center;
        background: var(--wv-white);
      }
      .wv-brand-card__name {
        font-weight: 700;
      }
      .wv-brand-card__tag {
        font-size: 0.82rem;
      }
      .wv-featured {
        grid-template-columns: repeat(4, 1fr);
      }
      .wv-car-card {
        grid-column: span 2;
        border: 1px solid var(--wv-line);
        overflow: hidden;
      }
      .wv-car-card__swatch {
        height: 120px;
        position: relative;
        overflow: hidden;
      }
      .wv-car-card__swatch img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .wv-car-card__body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .wv-car-card__price {
        font-family: var(--wv-font-display);
        font-size: 1.3rem;
        margin-top: 6px;
      }
      .wv-why {
        grid-template-columns: repeat(3, 1fr);
      }
      .wv-why__item {
        grid-column: span 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      @media (max-width: 900px) {
        .wv-brand-strip {
          grid-template-columns: repeat(2, 1fr);
        }
        .wv-featured,
        .wv-why {
          grid-template-columns: repeat(4, 1fr);
        }
        .wv-car-card {
          grid-column: span 4;
        }
        .wv-why__item {
          grid-column: span 4;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private carData = inject(CarDataService);
  brands$ = this.carData.getBrands();
  featured$ = this.carData.getAllModels().pipe(map((cars) => cars.slice(0, 4)));
}
