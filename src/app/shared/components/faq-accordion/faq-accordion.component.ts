import { Component, input, signal } from '@angular/core';
import { Faq } from '../../../core/models/car.model';

@Component({
  selector: 'wv-faq-accordion',
  standalone: true,
  template: `
    <div class="wv-faq">
      @for (item of faqs(); track $index) {
        <div class="wv-faq__row" [class.is-open]="openIndex() === $index">
          <button
            type="button"
            class="wv-faq__question"
            (click)="toggle($index)"
            [attr.aria-expanded]="openIndex() === $index"
          >
            <span class="wv-faq__num">{{ ($index + 1).toString().padStart(2, '0') }}</span>
            <span class="wv-faq__q-text">{{ item.q }}</span>
            <span class="wv-faq__icon">{{ openIndex() === $index ? '−' : '+' }}</span>
          </button>
          @if (openIndex() === $index) {
            <p class="wv-faq__answer">{{ item.a }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .wv-faq__row {
        border-top: 1px solid var(--wv-line);
      }
      .wv-faq__row:last-child {
        border-bottom: 1px solid var(--wv-line);
      }
      .wv-faq__question {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
        background: none;
        border: none;
        padding: 20px 0;
        text-align: left;
        cursor: pointer;
        font-size: 1rem;
      }
      .wv-faq__num {
        font-family: var(--wv-font-display);
        color: var(--wv-grey-300);
        font-size: 1.3rem;
        width: 32px;
        flex-shrink: 0;
      }
      .wv-faq__q-text {
        flex: 1;
        font-weight: 500;
      }
      .wv-faq__icon {
        font-size: 1.3rem;
        color: var(--wv-grey-700);
        width: 20px;
        text-align: center;
      }
      .wv-faq__answer {
        margin: 0 0 24px 52px;
        color: var(--wv-grey-700);
        max-width: 60ch;
      }
    `,
  ],
})
export class FaqAccordionComponent {
  faqs = input.required<Faq[]>();
  openIndex = signal<number | null>(0);

  toggle(i: number) {
    this.openIndex.set(this.openIndex() === i ? null : i);
  }
}
