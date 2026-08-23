import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'numberSuffix'
})
export class NumberSuffixPipe implements PipeTransform {
  /** Shortens a large number to 1.2K, 3.4M and so on. */
  transform(input: number, args?: number): string | number {
    let exp;
    const suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];
    const isNagtiveValues = input < 0;
    if (Number.isNaN(input) || (input < 1000 && input >= 0) || !this.isNumeric(input) || (input < 0 && input > -1000)) {
      if (!!args && this.isNumeric(input) && !(input < 0) && input != 0) {
        return input.toFixed(args);
      } else {
        return input;
      }
    }

    if (!isNagtiveValues) {
      exp = Math.floor(Math.log(input) / Math.log(1000));

      return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
    } else {
      input = input * -1;

      exp = Math.floor(Math.log(input) / Math.log(1000));

      return (input * -1 / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
    }
    
  }
  isNumeric(value: number): boolean {
    if (value < 0) value = value * -1;
    if (/^-{0,1}\d+$/.test(String(value))) {
      return true;
    } else if (/^\d+\.\d+$/.test(String(value))) {
      return true;
    } else {
      return false;
    }
  }
 
}