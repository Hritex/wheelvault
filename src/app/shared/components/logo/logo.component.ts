import { Component, input } from '@angular/core';

/**
 * WheelVault wordmark, rendered as inline SVG (not <img src="...svg">).
 *
 * Why inline and not an <img> tag: when an SVG is loaded via <img src>,
 * it renders in its own opaque document context, so `currentColor` inside
 * it resolves to the SVG's own default (black) — it does NOT pick up the
 * surrounding page's color, no matter what CSS you apply to the <img>.
 * That's exactly why the logo went invisible in dark mode. Inlining the
 * markup here lets the wheel + "Wheel" text use `currentColor`, which we
 * then set via ordinary CSS — so it follows the theme like everything else.
 *
 * `variant="inverse"` is for permanently-dark panels (footer, mobile nav)
 * that should always show the light-colored mark, regardless of site theme.
 */
@Component({
  selector: 'wv-logo',
  standalone: true,
  template: `
    <svg
      [attr.height]="height()"
      viewBox="0 0 220 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WheelVault"
      class="wv-logo-svg"
      [class.wv-logo-svg--inverse]="variant() === 'inverse'"
    >
      <g>
        <circle cx="22" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="2" />
        <circle cx="22" cy="24" r="13" fill="none" stroke="currentColor" stroke-width="1.4" />
        <circle cx="22" cy="24" r="3.2" fill="currentColor" />
        <line x1="22" y1="11" x2="22" y2="16.5" stroke="currentColor" stroke-width="1.4" />
        <line x1="22" y1="31.5" x2="22" y2="37" stroke="currentColor" stroke-width="1.4" />
        <line x1="9" y1="24" x2="14.5" y2="24" stroke="currentColor" stroke-width="1.4" />
        <line x1="29.5" y1="24" x2="35" y2="24" stroke="currentColor" stroke-width="1.4" />
        <line x1="13.2" y1="15.2" x2="16.8" y2="18.8" stroke="currentColor" stroke-width="1.4" />
        <line x1="27.2" y1="29.2" x2="30.8" y2="32.8" stroke="currentColor" stroke-width="1.4" />
        <line x1="30.8" y1="15.2" x2="27.2" y2="18.8" stroke="currentColor" stroke-width="1.4" />
        <line x1="16.8" y1="29.2" x2="13.2" y2="32.8" stroke="currentColor" stroke-width="1.4" />
      </g>
      <text
        x="52"
        y="31"
        font-family="Archivo Expanded, Arial, sans-serif"
        font-weight="700"
        font-size="22"
        letter-spacing="-0.5"
        fill="currentColor"
      >Wheel<tspan class="wv-logo-accent">Vault</tspan></text>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
      }
      .wv-logo-svg {
        color: var(--wv-black);
      }
      .wv-logo-svg--inverse {
        color: var(--wv-panel-text);
      }
      .wv-logo-accent {
        fill: var(--wv-accent);
      }
    `,
  ],
})
export class LogoComponent {
  height = input<number>(28);
  variant = input<'auto' | 'inverse'>('auto');
}
