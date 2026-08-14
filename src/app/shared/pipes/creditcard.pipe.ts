import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'creditcard'
})
export class CreditcardPipe implements PipeTransform {

  transform(value: any) {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

}
