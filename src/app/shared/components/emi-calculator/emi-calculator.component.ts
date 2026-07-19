import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InrPipe } from '../../pipes/inr.pipe';

/**
 * Self-contained on-road price -> down payment -> EMI calculator.
 * Pass the car's on-road price in; everything else is user-adjustable.
 */
@Component({
  selector: 'wv-emi-calculator',
  standalone: true,
  imports: [FormsModule, InrPipe],
  template: `
    <div class="wv-emi">
      <div class="wv-emi__inputs">
        <label>
          <span>On-road price</span>
          <strong>{{ onRoadPrice() | inr }}</strong>
        </label>

        <label>
          <span>Down payment — {{ downPaymentPct() }}%</span>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            [ngModel]="downPaymentPct()"
            (ngModelChange)="downPaymentPct.set($event)"
          />
          <strong>{{ downPaymentAmount() | inr }}</strong>
        </label>

        <label>
          <span>Loan tenure</span>
          <select [ngModel]="tenureMonths()" (ngModelChange)="tenureMonths.set($event)">
            <option [ngValue]="12">1 year</option>
            <option [ngValue]="24">2 years</option>
            <option [ngValue]="36">3 years</option>
            <option [ngValue]="48">4 years</option>
            <option [ngValue]="60">5 years</option>
            <option [ngValue]="84">7 years</option>
          </select>
        </label>

        <label>
          <span>Interest rate (p.a.) — {{ interestRate() }}%</span>
          <input
            type="range"
            min="7"
            max="14"
            step="0.25"
            [ngModel]="interestRate()"
            (ngModelChange)="interestRate.set($event)"
          />
        </label>
      </div>

      <div class="wv-emi__result">
        <span class="wv-eyebrow">Estimated monthly EMI</span>
        <div class="wv-number-huge" style="color: var(--wv-black); font-size: clamp(2.4rem, 5vw, 3.6rem);">
          {{ emi() | inr }}
        </div>
        <div class="wv-emi__breakdown">
          <div><span>Loan amount</span><strong>{{ loanAmount() | inr }}</strong></div>
          <div><span>Total interest payable</span><strong>{{ totalInterest() | inr }}</strong></div>
          <div><span>Total payment</span><strong>{{ totalPayment() | inr }}</strong></div>
        </div>
        <p class="wv-emi__disclaimer">
          Indicative only — actual EMI depends on your lender's rate, processing fee and credit profile.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .wv-emi {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 40px;
        border: 1px solid var(--wv-line);
        padding: clamp(20px, 4vw, 40px);
      }
      .wv-emi__inputs {
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .wv-emi__inputs label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.88rem;
      }
      .wv-emi__inputs span {
        color: var(--wv-grey-700);
        font-weight: 500;
      }
      .wv-emi__inputs strong {
        font-family: var(--wv-font-display);
        font-size: 1.1rem;
      }
      input[type='range'] {
        width: 100%;
        accent-color: var(--wv-accent);
      }
      select {
        padding: 10px;
        border: 1px solid var(--wv-line-strong);
        background: var(--wv-white);
      }
      .wv-emi__result {
        border-left: 1px solid var(--wv-line);
        padding-left: 40px;
        display: flex;
        flex-direction: column;
      }
      .wv-emi__breakdown {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .wv-emi__breakdown div {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--wv-line);
        padding-top: 8px;
        font-size: 0.9rem;
      }
      .wv-emi__disclaimer {
        margin-top: 20px;
        font-size: 0.76rem;
        color: var(--wv-grey-500);
      }
      @media (max-width: 720px) {
        .wv-emi {
          grid-template-columns: 1fr;
        }
        .wv-emi__result {
          border-left: none;
          border-top: 1px solid var(--wv-line);
          padding-left: 0;
          padding-top: 28px;
        }
      }
    `,
  ],
})
export class EmiCalculatorComponent {
  onRoadPrice = input.required<number>();
  suggestedDownPaymentPct = input<number>(20);

  downPaymentPct = signal(20);
  tenureMonths = signal(60);
  interestRate = signal(9.5);

  downPaymentAmount = computed(() =>
    Math.round((this.onRoadPrice() * this.downPaymentPct()) / 100)
  );

  loanAmount = computed(() => this.onRoadPrice() - this.downPaymentAmount());

  emi = computed(() => {
    const principal = this.loanAmount();
    const monthlyRate = this.interestRate() / 12 / 100;
    const n = this.tenureMonths();
    if (monthlyRate === 0) return Math.round(principal / n);
    const factor = Math.pow(1 + monthlyRate, n);
    return Math.round((principal * monthlyRate * factor) / (factor - 1));
  });

  totalPayment = computed(() => this.emi() * this.tenureMonths());
  totalInterest = computed(() => this.totalPayment() - this.loanAmount());

  constructor() {
    // Seed the slider with the model's suggested down payment once available.
    queueMicrotask(() => {
      if (this.suggestedDownPaymentPct()) {
        this.downPaymentPct.set(this.suggestedDownPaymentPct());
      }
    });
  }
}
