import { Component, computed, input, signal } from '@angular/core';

/**
 * Numbered image gallery with prev/next arrows — mirrors the reference
 * Behance concept's "01/05" gallery pattern. Renders nothing if no
 * images are supplied, so it degrades gracefully until real photos
 * are added (see README §8).
 */
@Component({
  selector: 'wv-image-gallery',
  standalone: true,
  template: `
    @if (images().length) {
      <div class="wv-gallery">
        <div class="wv-gallery__frame">
          <img
            [src]="'assets/img/' + images()[index()]"
            [alt]="alt() + ' — photo ' + (index() + 1)"
            (error)="onError($event)"
          />
        </div>
        <div class="wv-gallery__controls">
          <span class="wv-gallery__counter">
            {{ (index() + 1).toString().padStart(2, '0') }}/{{ images().length.toString().padStart(2, '0') }}
          </span>
          <div class="wv-gallery__arrows">
            <button type="button" (click)="prev()" aria-label="Previous photo">←</button>
            <button type="button" (click)="next()" aria-label="Next photo">→</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .wv-gallery {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .wv-gallery__frame {
        aspect-ratio: 16 / 9;
        background: var(--wv-grey-100);
        overflow: hidden;
      }
      .wv-gallery__frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .wv-gallery__controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .wv-gallery__counter {
        font-family: var(--wv-font-display);
        color: var(--wv-grey-500);
      }
      .wv-gallery__arrows {
        display: flex;
        gap: 10px;
      }
      .wv-gallery__arrows button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid var(--wv-line-strong);
        background: transparent;
        cursor: pointer;
      }
      .wv-gallery__arrows button:hover {
        border-color: var(--wv-black);
      }
    `,
  ],
})
export class ImageGalleryComponent {
  images = input.required<string[]>();
  alt = input<string>('Car photo');

  index = signal(0);
  failedIndexes = signal<Set<number>>(new Set());

  visibleImages = computed(() => this.images().filter((_, i) => !this.failedIndexes().has(i)));

  next() {
    this.index.set((this.index() + 1) % this.images().length);
  }

  prev() {
    this.index.set((this.index() - 1 + this.images().length) % this.images().length);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).style.opacity = '0';
    const failed = new Set(this.failedIndexes());
    failed.add(this.index());
    this.failedIndexes.set(failed);
  }
}
