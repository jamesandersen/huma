import * as compare from '../actions/compare';
import { Symbol } from '../models/symbol';
import { Filing } from '../models/filing';
import { Loadable } from './loadable';

export interface SECCompare {
    readonly filing1: Loadable<Filing>;
    readonly filing2: Loadable<Filing>;

    readonly symbol1: Loadable<Symbol>;
    readonly symbol2: Loadable<Symbol>;
}

const initialState: SECCompare = {
    filing1: new Loadable<Filing>(),
    filing2: new Loadable<Filing>(),

    symbol1: new Loadable<Symbol>(),
    symbol2: new Loadable<Symbol>()
}

export function reducer(state = initialState, action: compare.Actions): SECCompare {
  switch (action.type) {
    case compare.ActionTypes.SET_SYMBOL: {
      const setSym = <compare.Set<Symbol>>action.payload;
      if (setSym.index === 1) {
        return Object.assign({}, state, { symbol1: new Loadable<Symbol>(setSym.data, false) });
      } else if (setSym.index === 2) {
        return Object.assign({}, state, { symbol2: new Loadable<Symbol>(setSym.data, false) });
      }
    }

    case compare.ActionTypes.SET_FILING: {
      const setFil = <compare.Set<Filing>>action.payload;
      if (setFil.index === 1) {
        return Object.assign({}, state, { filing1: new Loadable<Filing>(setFil.data, false) });
      } else if (setFil.index === 2) {
        return Object.assign({}, state, { filing2: new Loadable<Filing>(setFil.data, false) });
      }
    }

    case compare.ActionTypes.CLEAR: {
      return initialState;
    }

    case compare.ActionTypes.LOADING: {
      const setLoading = <compare.SetLoading>action.payload;

      if (setLoading.target === compare.ActionTypes.SET_SYMBOL) {
        if (setLoading.index === 1) {
          return Object.assign({}, state, { symbol1: new Loadable<Symbol>(state.symbol1.value, true) });
        } else if (setLoading.index === 2) {
          return Object.assign({}, state, { symbol2: new Loadable<Symbol>(state.symbol2.value, true) });
        }
      } else if(setLoading.target === compare.ActionTypes.SET_FILING) {
        if (setLoading.index === 1) {
          return Object.assign({}, state, { filing1: new Loadable<Filing>(state.filing1.value, true) });
        } else if (setLoading.index === 2) {
          return Object.assign({}, state, { filing2: new Loadable<Filing>(state.filing2.value, true) });
        }
      }
    }

    default: {
      return state;
    }
  }
}