import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private httpClient: HttpClient) { }

  getCountries() {
    return this.httpClient.get('/assets/data/countries.json');
  }

  getStatesByCountry(name: string) {
    return this.httpClient.get('/assets/data/countries.json').pipe(
      map((countries: any) => countries.filter((country:any) => country.name === name)),
      map(country => country[0].states)
    );
  }
}
