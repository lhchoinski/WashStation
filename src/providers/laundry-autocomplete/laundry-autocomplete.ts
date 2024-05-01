import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';

@Injectable()
export class LaundryAutocompleteProvider implements AutoCompleteService {

  labelAttribute = 'autocompleteLabel';
  laundries: Array<any> = [];

  constructor() {}

  getResults(keyword:string) {
    return this.laundries.filter(el => (el.autocompleteLabel.toLowerCase().includes(keyword.toLowerCase())));
  }
}
