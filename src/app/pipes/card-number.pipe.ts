import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardNumber',
  standalone: true
})
export class CardNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const clean = value.replace(/\D/g, '');
    if (clean.length === 16) {
      return clean.replace(/(.{4})/g, '$1 ').trim();
    }

    const parts = clean.match(/.{1,4}/g);
    return parts ? parts.join(' ') : value;
  }
}
