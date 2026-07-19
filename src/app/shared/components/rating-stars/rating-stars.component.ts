import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'wv-rating-stars',
  standalone: true,
  template: `
    <span class="wv-stars" [attr.aria-label]="rating() + ' out of 5'">
      @for (i of [0, 1, 2, 3, 4]; track i) {
        <span class="wv-star" [class.is-filled]="i < roundedRating()">★</span>
      }
      <span class="wv-stars__value">{{ rating().toFixed(1) }}</span>
      @if (count() !== undefined) {
        <span class="wv-stars__count">({{ count() }} reviews)</span>
      }
    </span>
  `,
  styles: [
    `
      .wv-stars {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .wv-star {
        color: var(--wv-grey-300);
        font-size: 1rem;
      }
      .wv-star.is-filled {
        color: var(--wv-accent);
      }
      .wv-stars__value {
        margin-left: 8px;
        font-weight: 600;
      }
      .wv-stars__count {
        margin-left: 6px;
        color: var(--wv-grey-700);
        font-size: 0.85rem;
      }
    `,
  ],
})
export class RatingStarsComponent {
  rating = input.required<number>();
  count = input<number>();
  roundedRating = computed(() => Math.round(this.rating()));
}
