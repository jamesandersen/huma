import { OpaqueToken } from '@angular/core';
import { SECCompare, AppState} from './models/AppState';
import { Action, SetSymbolAction, ClearTickersAction, SetFilingAction } from './models/Actions';

import { BehaviorSubject, Subject, Observable } from 'rxjs';

export const initState = new OpaqueToken('initState');
export const dispatcher = new OpaqueToken('dispatcher');
export const state = new OpaqueToken('state');

export const stateAndDispatcher = [
  {
    provide: initState,
    useValue: {
      compare: {
        ticker1: null,
        ticker2: null,
        symbol1: null,
        symbol2: null,
        filing1: null,
        filing2: null
      }
    }
  },
  { provide: dispatcher, useValue: new Subject<Action>() },
  { provide: state, useFactory: generateState, deps: [initState, dispatcher] }
];

function generateState(initialState: AppState, actions: Observable<Action>): Observable<AppState> {
  const res = new BehaviorSubject(initialState);
  const stateFromActions = actions.scan((prevState, action) => {
    let newState: SECCompare = prevState.compare;
    if (action instanceof SetSymbolAction) {
      newState = {
        symbol1: action.symbolIndex === 1 ? action.symbol : prevState.compare.symbol1,
        symbol2: action.symbolIndex === 2 ? action.symbol : prevState.compare.symbol2,
        filing1: null,
        filing2: null
      };
    } else if (action instanceof ClearTickersAction) {
      newState = {
        symbol1: null,
        symbol2: null,
        filing1: null,
        filing2: null
      };
    } else if (action instanceof SetFilingAction) {
      newState = {
        symbol1: prevState.compare.symbol1,
        symbol2: prevState.compare.symbol2,
        filing1: prevState.compare.symbol1 !== null && prevState.compare.symbol1.Symbol === action.filing.tradingSymbol
            ? action.filing
            : prevState.compare.filing1,
        filing2: prevState.compare.symbol2 !== null && prevState.compare.symbol2.Symbol === action.filing.tradingSymbol
            ? action.filing
            : prevState.compare.filing2
      };
    }

    return <AppState>{ compare: newState };
  }, initialState).share();

  stateFromActions.subscribe(s => { 
    res.next(s); });
  return res;
}
