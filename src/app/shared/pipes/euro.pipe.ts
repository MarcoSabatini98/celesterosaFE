import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Pipe({ name: 'euro' })
export class EuroPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    const n = Number(value ?? 0);
    return fmt.format(Number.isFinite(n) ? n : 0);
  }
}
