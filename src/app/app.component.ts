import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'wv-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <wv-header></wv-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <wv-footer></wv-footer>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
      main {
        min-height: 60vh;
      }
    `,
  ],
})
export class AppComponent {}
