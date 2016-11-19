import { Symbol } from './symbol.ts';
import { Filing } from './filing.ts';

export interface SECCompare {
    filing1 : Filing;
    filing2 : Filing;

    symbol1 : Symbol;
    symbol2 : Symbol;
}

export interface AppState {
    compare: SECCompare;
    visibilityFilter: string;
}