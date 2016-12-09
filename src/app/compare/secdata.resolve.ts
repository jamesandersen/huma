import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SECCompare } from '../reducers/compare';
import { SECDataService } from '../secdata/sec-data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import {Observable} from 'rxjs';
import {SetSymbolAction, SetFilingAction, LoadingAction, ActionTypes } from '../actions/compare';


@Injectable()
export class SECDataResolve implements Resolve<SECCompare> {
  constructor(
      private state: Store<fromRoot.State>,
      private ds: SECDataService,
      private router: Router) {}

  fetchSymbol(ticker: string, idx: number) {
      this.state.dispatch(new LoadingAction({ target: ActionTypes.SET_SYMBOL, index: idx }));
      this.ds.getSymbol(ticker)
              .map(data => new SetSymbolAction({ index: idx, data: data })).take(1)
              .subscribe(action => { this.state.dispatch(action); });
  }

  fetchFiling(ticker: string, idx: number) {
      this.state.dispatch(new LoadingAction({ target: ActionTypes.SET_FILING, index: idx }));
      this.ds.getFiling(ticker)
              .map(data => new SetFilingAction({ index: idx, data: data })).take(1)
              .subscribe(action => { this.state.dispatch(action); });
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SECCompare> {
    let ticker1: string = route.params['ticker1'];
    let ticker2: string = route.params['ticker2'];

    return this.state.first(state => {
        let ticker1Match = state.compare.symbol1.value && state.compare.symbol1.value.Symbol === ticker1;
        let ticker2Match = state.compare.symbol2.value && state.compare.symbol2.value.Symbol === ticker2;
        let filing1Match = state.compare.filing1.value && state.compare.filing1.value.tradingSymbol === ticker1;
        let filing2Match = state.compare.filing2.value && state.compare.filing2.value.tradingSymbol === ticker2;

        // fetch the symbols if needed
        // NOTE: We have to return false here because the state doesn't immediately update and each
        // call to dispatch will trigger another state to be pushed so we only want to kick off one
        // action per execution
        if (!ticker1Match && !state.compare.symbol1.loading) { this.fetchSymbol(ticker1, 1); return false; }
        if (!ticker2Match && !state.compare.symbol2.loading) { this.fetchSymbol(ticker2, 2); return false; }

        // fetch the filings if needed
        if (!filing1Match && !state.compare.filing1.loading) { this.fetchFiling(ticker1, 1); return false; }
        if (!filing2Match && !state.compare.filing2.loading) { this.fetchFiling(ticker2, 2); return false; }

        return filing1Match && filing2Match;
    }).map(state => state.compare );
  }
}
