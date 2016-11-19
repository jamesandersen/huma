import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Http, Headers, Response} from '@angular/http';

import { environment } from '../../environments/environment';
import {Symbol} from '../models/symbol';
import {Filing} from '../models/filing';

const JSON_HEADERS = new Headers();
JSON_HEADERS.append('Accept', 'application/json');
JSON_HEADERS.append('Content-Type', 'application/json');

@Injectable()
export class SECDataService {

  constructor(public http: Http) { }

  getFiling(ticker: string): Observable<Filing> {
     return this.http
      .get( `${environment.serviceBaseURI}api/secdata/${ticker}/filing`, {
        headers: JSON_HEADERS
      }).map(resp => resp.json());
  }

  getSymbol(ticker: string): Observable<Symbol> {
     return this.http
      .get(`${environment.serviceBaseURI}api/secdata/${ticker}/symbol`, {
        headers: JSON_HEADERS
      }).map(resp => resp.json());
  }

  searchSymbols(ticker: string): Observable<Array<Symbol>> {
     return this.http
      .get(`${environment.serviceBaseURI}api/secdata/symbols/search/${ticker}`, {
        headers: JSON_HEADERS
      }).map(resp => resp.json());
  }

  errorMessage(err:any) { }
}
