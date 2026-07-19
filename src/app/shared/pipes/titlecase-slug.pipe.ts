import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlecaseSlug', standalone: true })
export class TitlecaseSlugPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
