import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, filterString: string) {
    if(value.length === 0 || filterString === ''){
      return value
    }

    const cryptos = []
    for(const i of value){
      let lowercase = ((i.symbol)as string).toLowerCase()
      let uppercase = (filterString.toLowerCase())
      
      if(lowercase == uppercase ){
        cryptos.push(i)
      }
    }    
    return cryptos
  }

}
