import { Symbol } from './symbol';
import { Filing } from './filing';

export interface SECCompare {
    readonly filing1: Filing;
    readonly filing2: Filing;

    readonly symbol1: Symbol;
    readonly symbol2: Symbol;
}

export interface AppState {
    readonly compare: SECCompare;
    readonly visibilityFilter: string;
}