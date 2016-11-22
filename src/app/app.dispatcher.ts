import { OpaqueToken, Inject } from '@angular/core';
import { SECCompare, AppState} from './models/AppState';
import { Action, SetSymbolAction, ClearTickersAction, SetFilingAction } from './models/Actions';

import { BehaviorSubject, Subject, Observable, Observer } from 'rxjs';

export const initState = new OpaqueToken('initState');
export const dispatcher = new OpaqueToken('dispatcher');
export const state = new OpaqueToken('state');

export const stateAndDispatcher = [
  { provide: initState, useValue: {
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
  { provide: state, useFactory: stateFn, deps: [initState, dispatcher] }
];

function stateFn(initialState: AppState, actions: Observable<Action>): Observable<AppState> {

  const compareToState = compare => (<AppState>{ compare: compare });

  const appStateObs: Observable<AppState> = generateState(initialState.compare, actions).map(compareToState);

  return wrapIntoBehavior(initialState, appStateObs);
}

// TODO: Not really doing anything here to enforce immutability
function generateState(initialState: SECCompare, actions: Observable<Action>): Observable<SECCompare> {
  return actions.scan<Action, SECCompare>((prevState, action) => {
    let newState: SECCompare = prevState;
    if (action instanceof SetSymbolAction) {
      newState = {
        symbol1: action.symbolIndex === 1 ? action.symbol : prevState.symbol1,
        symbol2: action.symbolIndex === 2 ? action.symbol : prevState.symbol2,
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
        symbol1: prevState.symbol1,
        symbol2: prevState.symbol2,
        filing1: prevState.symbol1 !== null && prevState.symbol1.Symbol === action.filing.tradingSymbol ? action.filing : prevState.filing1,
        filing2: prevState.symbol2 !== null && prevState.symbol2.Symbol === action.filing.tradingSymbol ? action.filing : prevState.filing2
      };
    }

    return newState;
  }, initialState).share();
}

function wrapIntoBehavior(init, obs) {
  const res = new BehaviorSubject(init);
  obs.subscribe(s => {
    res.next(s);
  });
  return res;
}
