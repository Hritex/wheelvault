import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CarDataService } from '../../core/services/car-data.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { EmiCalculatorComponent } from '../../shared/components/emi-calculator/emi-calculator.component';
import { FaqAccordionComponent } from '../../shared/components/faq-accordion/faq-accordion.component';
import { TitlecaseSlugPipe } from '../../shared/pipes/titlecase-slug.pipe';

@Component({
  selector: 'wv-car-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    InrPipe,
    RatingStarsComponent,
    EmiCalculatorComponent,
    FaqAccordionComponent,
    TitlecaseSlugPipe,
  ],
  template: `
    @if (car$ | async; as car) {
      <!-- 01 Hero -->
      <section class="wv-car-hero" [style.background]="car.heroColor">
        <div class="wv-shell wv-car-hero__inner">
          <a [routerLink]="['/brands', car.brandSlug]" class="wv-back-link">← Back to {{ car.brandSlug | titlecaseSlug }}</a>
          <div class="wv-car-hero__row">
            <div>
              <span class="wv-eyebrow" style="color:#c8c8c6;">{{ car.bodyType }} · SINCE {{ car.launchYear }}</span>
              <h1 class="wv-car-hero__name">{{ car.name }}</h1>
              <wv-rating-stars [rating]="car.rating" [count]="car.reviewCount"></wv-rating-stars>
            </div>
            <div class="wv-car-hero__badge">{{ car.launchYear }}</div>
          </div>
        </div>
      </section>

      <!-- 02 Pricing -->
      <section class="wv-section wv-shell">
        <span class="wv-eyebrow">02 — PRICING</span>
        <h2 class="wv-h2" style="margin-top:8px;">Ex-showroom by variant</h2>
        <p class="wv-muted" style="max-width:60ch; margin-top:10px;">
          On-road price (approx., Delhi NCR) starts at <strong>{{ car.onRoadApproxDelhi | inr }}</strong> —
          includes RTO registration, insurance and standard accessories. Actual on-road price varies by state.
        </p>

        <table class="wv-price-table">
          <thead>
            <tr><th>Variant</th><th>Ex-showroom price</th></tr>
          </thead>
          <tbody>
            @for (v of car.variants; track v.name) {
              <tr>
                <td>{{ v.name }}</td>
                <td>{{ v.exShowroomPrice | inr }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="wv-colors">
          <span class="wv-eyebrow">Available colours</span>
          <div class="wv-colors__list">
            @for (c of car.colors; track c) {
              <span class="wv-tag">{{ c }}</span>
            }
          </div>
        </div>
      </section>

      <!-- 03 EMI Calculator -->
      <section class="wv-section wv-shell">
        <span class="wv-eyebrow">03 — DOWN PAYMENT &amp; EMI</span>
        <h2 class="wv-h2" style="margin-top:8px; margin-bottom:28px;">Plan your monthly outgo</h2>
        <wv-emi-calculator
          [onRoadPrice]="car.onRoadApproxDelhi"
          [suggestedDownPaymentPct]="downPaymentPct(car)"
        ></wv-emi-calculator>
      </section>

      <!-- 04 Specs -->
      <section class="wv-section wv-shell">
        <span class="wv-eyebrow">04 — SPECIFICATIONS</span>
        <h2 class="wv-h2" style="margin-top:8px; margin-bottom:28px;">What's under it</h2>
        <div class="wv-specs-grid">
          <div><span>Engine</span><strong>{{ car.specs.engine }}</strong></div>
          <div><span>Power</span><strong>{{ car.specs.power }}</strong></div>
          <div><span>Torque</span><strong>{{ car.specs.torque }}</strong></div>
          <div><span>Mileage</span><strong>{{ car.specs.mileage }}</strong></div>
          <div><span>Transmission</span><strong>{{ car.specs.transmission }}</strong></div>
          <div><span>Fuel type</span><strong>{{ car.specs.fuelType }}</strong></div>
          <div><span>Seating</span><strong>{{ car.specs.seating }}</strong></div>
          <div><span>Boot space</span><strong>{{ car.specs.bootSpace }}</strong></div>
          <div><span>Safety</span><strong>{{ car.specs.safety }}</strong></div>
        </div>
      </section>

      <!-- 05 Reviews -->
      <section class="wv-section wv-shell">
        <span class="wv-eyebrow">05 — OWNER REVIEWS</span>
        <h2 class="wv-h2" style="margin-top:8px; margin-bottom:28px;">What owners actually say</h2>
        <div class="wv-reviews">
          @for (r of car.reviews; track r.author) {
            <article class="wv-review">
              <div class="wv-review__head">
                <div>
                  <strong>{{ r.author }}</strong>
                  <span class="wv-muted" style="font-size:0.82rem; display:block;">{{ r.location }}</span>
                </div>
                <wv-rating-stars [rating]="r.rating"></wv-rating-stars>
              </div>
              <h3 class="wv-h3" style="font-size:1.1rem; margin:14px 0 6px;">{{ r.title }}</h3>
              <p class="wv-muted">{{ r.text }}</p>
            </article>
          }
        </div>
      </section>

      <!-- 06 Spare parts -->
      <section class="wv-section wv-shell">
        <span class="wv-eyebrow">06 — SPARE PARTS &amp; SERVICE</span>
        <h2 class="wv-h2" style="margin-top:8px;">Where to find parts, and what they cost</h2>
        <p class="wv-muted" style="max-width:64ch; margin-top:10px;">{{ car.spareParts.authorizedServiceNote }}</p>

        <table class="wv-price-table" style="margin-top:24px;">
          <thead>
            <tr><th>Common part</th><th>Typical price range</th></tr>
          </thead>
          <tbody>
            @for (p of car.spareParts.commonParts; track p.name) {
              <tr>
                <td>{{ p.name }}</td>
                <td>{{ p.priceRange }}</td>
              </tr>
            }
          </tbody>
        </table>

        <p class="wv-spare-tip"><strong>Tip:</strong> {{ car.spareParts.tip }}</p>
      </section>

      <!-- 07 FAQ -->
      <section class="wv-section wv-shell" style="border-bottom:none;">
        <span class="wv-eyebrow">07 — FAQ</span>
        <h2 class="wv-h2" style="margin-top:8px; margin-bottom:8px;">Common questions about the {{ car.name }}</h2>
        <wv-faq-accordion [faqs]="car.faqs"></wv-faq-accordion>
      </section>
    }
  `,
  styles: [
    `
      .wv-car-hero {
        color: var(--wv-white);
        padding-top: 32px;
        padding-bottom: clamp(48px, 8vw, 88px);
      }
      .wv-back-link {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
        display: inline-block;
        margin-bottom: 40px;
      }
      .wv-back-link:hover {
        color: #fff;
      }
      .wv-car-hero__row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .wv-car-hero__name {
        font-size: clamp(3rem, 9vw, 7rem);
        line-height: 0.94;
        margin-top: 10px;
      }
      .wv-car-hero__badge {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--wv-font-display);
        flex-shrink: 0;
      }
      @media (max-width: 640px) {
        .wv-car-hero__row {
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
        }
      }
      .wv-price-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 24px;
      }
      .wv-price-table th {
        text-align: left;
        font-size: 0.78rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--wv-grey-700);
        padding-bottom: 10px;
        border-bottom: 1px solid var(--wv-line-strong);
      }
      .wv-price-table td {
        padding: 14px 0;
        border-bottom: 1px solid var(--wv-line);
        font-family: var(--wv-font-display);
      }
      .wv-price-table td:first-child {
        font-family: var(--wv-font-body);
        font-weight: 500;
      }
      .wv-colors {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .wv-colors__list {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .wv-specs-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: var(--wv-line);
        border: 1px solid var(--wv-line);
      }
      .wv-specs-grid > div {
        background: var(--wv-white);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wv-specs-grid span {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--wv-grey-700);
      }
      .wv-specs-grid strong {
        font-family: var(--wv-font-display);
        font-size: 1rem;
      }
      @media (max-width: 780px) {
        .wv-specs-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .wv-reviews {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .wv-review {
        border: 1px solid var(--wv-line);
        padding: 24px;
      }
      .wv-review__head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      @media (max-width: 780px) {
        .wv-reviews {
          grid-template-columns: 1fr;
        }
      }
      .wv-spare-tip {
        margin-top: 20px;
        padding: 16px 20px;
        background: var(--wv-grey-100);
        border-left: 3px solid var(--wv-accent);
        font-size: 0.92rem;
      }
    `,
  ],
})
export class CarDetailComponent {
  private route = inject(ActivatedRoute);
  private carData = inject(CarDataService);

  car$ = this.route.paramMap.pipe(
    switchMap((params) =>
      this.carData.getModel(params.get('brandSlug')!, params.get('modelSlug')!)
    )
  );

  downPaymentPct(car: { onRoadApproxDelhi: number; downPaymentSuggested: number }): number {
    return Math.round((car.downPaymentSuggested / car.onRoadApproxDelhi) * 100);
  }
}
