import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CarDataService } from '../../core/services/car-data.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'wv-brand-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, InrPipe, RatingStarsComponent],
  template: `
    @if (brand$ | async; as brand) {
      <section class="wv-shell wv-brand-head">
        <div class="wv-brand-head__logo-wrap">
          @if (brand.logoPath) {
            <img
              [src]="'assets/img/' + brand.logoPath"
              [alt]="brand.name + ' logo'"
              class="wv-brand-head__logo-img"
              (error)="$any($event.target).style.display = 'none'"
            />
          }
          <span class="wv-brand-head__mono">{{ brand.monogram }}</span>
        </div>
        <span class="wv-eyebrow">{{ brand.headquarters }} · SINCE {{ brand.founded }}</span>
        <h1 class="wv-h1">{{ brand.name }}</h1>
        <p class="wv-muted" style="max-width:64ch; font-size:1.05rem;">{{ brand.description }}</p>
      </section>
    }

    <section class="wv-shell wv-model-grid">
      @for (car of models$ | async; track car.slug) {
        <a [routerLink]="[car.slug]" class="wv-model-card">
          <div class="wv-model-card__swatch" [style.background]="car.heroColor">
            @if (car.images?.[0]) {
              <img
                [src]="'assets/img/' + car.images![0]"
                [alt]="car.name"
                (error)="$any($event.target).style.display = 'none'"
              />
            }
            <span class="wv-model-card__body-type">{{ car.bodyType }}</span>
          </div>
          <div class="wv-model-card__body">
            <h2 class="wv-h3">{{ car.name }}</h2>
            <wv-rating-stars [rating]="car.rating" [count]="car.reviewCount"></wv-rating-stars>
            <div class="wv-model-card__price-row">
              <div>
                <span class="wv-muted" style="font-size:0.78rem;">Ex-showroom</span>
                <p class="wv-model-card__price">{{ car.exShowroomMin | inr }} – {{ car.exShowroomMax | inr }}</p>
              </div>
            </div>
          </div>
        </a>
      }
    </section>
  `,
  styles: [
    `
      .wv-brand-head {
        padding-top: clamp(40px, 6vw, 72px);
        padding-bottom: 40px;
        border-bottom: 1px solid var(--wv-line);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .wv-brand-head__logo-wrap {
        position: relative;
        height: 56px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
      .wv-brand-head__mono {
        font-family: var(--wv-font-display);
        font-size: 2.6rem;
        color: var(--wv-grey-300);
      }
      .wv-brand-head__logo-img {
        position: absolute;
        inset: 0;
        height: 100%;
        width: auto;
        max-width: 220px;
        object-fit: contain;
        object-position: left center;
        background: var(--wv-white);
      }
      .wv-model-grid {
        padding-top: 48px;
        padding-bottom: 72px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .wv-model-card {
        border: 1px solid var(--wv-line);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: border-color 0.15s ease, transform 0.15s ease;
      }
      .wv-model-card:hover {
        border-color: var(--wv-black);
        transform: translateY(-2px);
      }
      .wv-model-card__swatch {
        height: 160px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        padding: 14px;
      }
      .wv-model-card__swatch img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
      }
      .wv-model-card__body-type {
        position: relative;
        z-index: 1;
        color: rgba(255, 255, 255, 0.75);
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .wv-model-card__body {
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .wv-model-card__price {
        font-family: var(--wv-font-display);
        font-size: 1.15rem;
        margin: 2px 0 0;
      }
      @media (max-width: 900px) {
        .wv-model-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 600px) {
        .wv-model-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BrandDetailComponent {
  private route = inject(ActivatedRoute);
  private carData = inject(CarDataService);

  private brandSlug$ = this.route.paramMap.pipe(
    switchMap((params) => [params.get('brandSlug')!])
  );

  brand$ = this.route.paramMap.pipe(
    switchMap((params) => this.carData.getBrand(params.get('brandSlug')!))
  );

  models$ = this.route.paramMap.pipe(
    switchMap((params) => this.carData.getModelsForBrand(params.get('brandSlug')!))
  );
}
