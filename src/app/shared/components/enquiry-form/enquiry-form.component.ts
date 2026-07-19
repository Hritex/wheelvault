import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Static "book a test drive" enquiry form — mirrors the reference site's
 * dark contact panel. Client-side only: there is no backend on GitHub
 * Pages, so submitting shows a confirmation message rather than sending
 * anywhere. Wire up `onSubmit()` to a real form endpoint (e.g. Formspree,
 * Getform, or a serverless function) when one is available — see README §9.
 */
@Component({
  selector: 'wv-enquiry-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="wv-enquiry">
      <div class="wv-enquiry__copy">
        <span class="wv-eyebrow" style="color:var(--wv-panel-muted);">TEST DRIVE</span>
        <h2 class="wv-h2" style="color:var(--wv-panel-text); margin-top:8px;">
          Start your test drive experience
        </h2>
        <p style="color:var(--wv-panel-muted); max-width:44ch; margin-top:14px;">
          Book a test drive for the {{ carName() }} and get a call back from your nearest
          dealer to confirm timing and availability.
        </p>
      </div>

      <form class="wv-enquiry__form" (submit)="onSubmit($event)">
        @if (submitted()) {
          <p class="wv-enquiry__success">
            Thanks — your test drive request for the {{ carName() }} has been noted.
            A dealer representative will reach out shortly.
          </p>
        } @else {
          <label class="wv-visually-hidden" for="wv-name">Name</label>
          <input id="wv-name" name="name" type="text" placeholder="Name" [(ngModel)]="name" required />

          <label class="wv-visually-hidden" for="wv-email">E-mail</label>
          <input id="wv-email" name="email" type="email" placeholder="E-mail" [(ngModel)]="email" required />

          <label class="wv-visually-hidden" for="wv-city">City</label>
          <input id="wv-city" name="city" type="text" placeholder="City" [(ngModel)]="city" />

          <label class="wv-visually-hidden" for="wv-message">Message</label>
          <textarea id="wv-message" name="message" rows="3" placeholder="Message (optional)" [(ngModel)]="message"></textarea>

          <button type="submit" class="wv-btn wv-btn-accent">Request test drive</button>
        }
      </form>
    </div>
  `,
  styles: [
    `
      .wv-enquiry {
        background: var(--wv-panel-bg);
        padding: clamp(28px, 5vw, 56px);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 48px;
      }
      .wv-enquiry__form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .wv-enquiry__form input,
      .wv-enquiry__form textarea {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--wv-panel-line);
        color: var(--wv-panel-text);
        padding: 14px 16px;
        font-family: inherit;
        font-size: 0.95rem;
        resize: vertical;
      }
      .wv-enquiry__form input::placeholder,
      .wv-enquiry__form textarea::placeholder {
        color: var(--wv-panel-muted);
      }
      .wv-enquiry__form button {
        align-self: flex-start;
        margin-top: 6px;
      }
      .wv-enquiry__success {
        color: var(--wv-panel-text);
        max-width: 40ch;
      }
      @media (max-width: 780px) {
        .wv-enquiry {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class EnquiryFormComponent {
  carName = input<string>('this car');

  name = '';
  email = '';
  city = '';
  message = '';
  submitted = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.name || !this.email) return;
    // No backend on GitHub Pages — this just confirms locally.
    // See README §9 to wire this up to a real form endpoint.
    this.submitted.set(true);
  }
}
