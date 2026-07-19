import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, switchMap, of } from 'rxjs';
import { Brand, CarModel } from '../models/car.model';

/**
 * Central data-access point for the whole app.
 *
 * All car data lives as static JSON under `src/assets/data/`.
 * To add a new brand or model, see the project README — this
 * service does not need to change for new content.
 */
@Injectable({ providedIn: 'root' })
export class CarDataService {
  private http = inject(HttpClient);

  private brands$?: Observable<Brand[]>;
  private modelCache = new Map<string, Observable<CarModel[]>>();

  getBrands(): Observable<Brand[]> {
    if (!this.brands$) {
      this.brands$ = this.http
        .get<Brand[]>('assets/data/brands.json')
        .pipe(shareReplay(1));
    }
    return this.brands$;
  }

  getBrand(slug: string): Observable<Brand | undefined> {
    return this.getBrands().pipe(map((brands) => brands.find((b) => b.slug === slug)));
  }

  getModelsForBrand(brandSlug: string): Observable<CarModel[]> {
    if (!this.modelCache.has(brandSlug)) {
      const obs = this.http
        .get<CarModel[]>(`assets/data/models/${brandSlug}.json`)
        .pipe(shareReplay(1));
      this.modelCache.set(brandSlug, obs);
    }
    return this.modelCache.get(brandSlug)!;
  }

  getModel(brandSlug: string, modelSlug: string): Observable<CarModel | undefined> {
    return this.getModelsForBrand(brandSlug).pipe(
      map((models) => models.find((m) => m.slug === modelSlug))
    );
  }

  /** Every model across every brand — used for search / home-page highlights. */
  getAllModels(): Observable<CarModel[]> {
    return this.getBrands().pipe(
      switchMap((brands) => {
        if (!brands.length) return of([] as CarModel[]);
        const requests = brands.map((b) => this.getModelsForBrand(b.slug));
        return combineArrays(requests);
      })
    );
  }
}

function combineArrays(sources: Observable<CarModel[]>[]): Observable<CarModel[]> {
  // Small local combineLatest-free helper to avoid importing forkJoin edge cases
  // when a source brand has no models file yet.
  return new Observable<CarModel[]>((subscriber) => {
    const results: CarModel[][] = new Array(sources.length).fill([]);
    let completed = 0;
    sources.forEach((src$, i) => {
      src$.subscribe({
        next: (val) => (results[i] = val),
        error: () => {
          results[i] = [];
          completed++;
          if (completed === sources.length) {
            subscriber.next(results.flat());
            subscriber.complete();
          }
        },
        complete: () => {
          completed++;
          if (completed === sources.length) {
            subscriber.next(results.flat());
            subscriber.complete();
          }
        },
      });
    });
  });
}
