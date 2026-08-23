import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'creditcard'
})
export class CreditcardPipe implements PipeTransform {

  /** Groups a card number into blocks of four. */
  transform(value: string): string {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

}
