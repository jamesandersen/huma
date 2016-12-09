import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SECCompare } from '../reducers/compare';
import { SECDataService } from '../secdata/sec-data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import {Observable} from 'rxjs';
import {SetSymbolAction, SetFilingAction } from '../actions/compare';


@Injectable()
export class SECDataResolve implements Resolve<SECCompare> {
  constructor(
      private state: Store<fromRoot.State>,
      private ds: SECDataService,
      private router: Router) {}

  fetchSymbol(ticker: string, idx: number) {
      this.ds.getSymbol(ticker)
              .map(data => new SetSymbolAction({ index: idx, symbol: data })).take(1)
              .subscribe(action => { this.state.dispatch(action); });
  }

  fetchFiling(ticker: string) {
      this.ds.getFiling(ticker)
              .map(data => new SetFilingAction(data)).take(1)
              .subscribe(action => { this.state.dispatch(action); });
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SECCompare> {
    let ticker1: string = route.params['ticker1'];
    let ticker2: string = route.params['ticker2'];

    return this.state.first(state => {
        let ticker1Match = state.compare.symbol1 && state.compare.symbol1.Symbol === ticker1;
        let ticker2Match = state.compare.symbol2 && state.compare.symbol2.Symbol === ticker2;

        // fetch the symbols if needed
        if (!ticker1Match) { this.fetchSymbol(ticker1, 1); }
        if (!ticker2Match) { this.fetchSymbol(ticker2, 2); }

        // don't even try the filings until the symbols are there 
        // (the reducer handles SetFilingAction expecting the symbols to be set)
        if (!(ticker1Match || ticker2Match)) { return false; }

        let filing1Match = state.compare.filing1 && state.compare.filing1.tradingSymbol === ticker1;
        let filing2Match = state.compare.filing2 && state.compare.filing2.tradingSymbol === ticker2;

        // fetch the filings if needed
        if (!filing1Match) { this.fetchFiling(ticker1); }
        if (!filing2Match) { this.fetchFiling(ticker2); }

        return filing1Match && filing2Match;
    }).map(state => state.compare );
  }
}
