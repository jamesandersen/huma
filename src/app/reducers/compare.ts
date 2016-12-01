import * as compare from '../actions/compare';
import { Symbol } from '../models/symbol';
import { Filing } from '../models/filing';

export interface SECCompare {
    readonly filing1: Filing;
    readonly filing2: Filing;

    readonly symbol1: Symbol;
    readonly symbol2: Symbol;
}

const initialState: SECCompare = {
    filing1: null,
    filing2: null,

    symbol1: null,
    symbol2: null
}

export function reducer(state = initialState, action: compare.Actions): SECCompare {
  switch (action.type) {
    case compare.ActionTypes.SET_SYMBOL: {
      const setSym = <compare.SetSymbol>action.payload;

      return {
        symbol1: setSym.index === 1 ? setSym.symbol : state.symbol1,
        symbol2: setSym.index === 2 ? setSym.symbol : state.symbol2,
        filing1: state.filing1,
        filing2: state.filing2
      };
    }

    case compare.ActionTypes.SET_FILING: {
      const setFil = <Filing>action.payload;

      return {
        symbol1: state.symbol1,
        symbol2: state.symbol2,
        filing1: setFil.tradingSymbol === state.symbol1.Symbol ? setFil : state.filing1,
        filing2: setFil.tradingSymbol === state.symbol2.Symbol ? setFil : state.filing2,
      };
    }

    case compare.ActionTypes.CLEAR: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}