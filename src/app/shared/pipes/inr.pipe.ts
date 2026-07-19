import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a plain number as Indian-grouped currency, e.g. 1450000 -> ₹14,50,000
 */
@Pipe({ name: 'inr', standalone: true })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined, withSymbol = true): string {
    if (value === null || value === undefined || isNaN(value)) return '—';
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
    return withSymbol ? `₹${formatted}` : formatted;
  }
}
