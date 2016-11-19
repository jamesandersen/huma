import { Filing } from './filing';
import { Symbol } from './symbol';

export class SetSymbolAction {
    constructor(public symbolIndex: number, public symbol: Symbol) {}
}

export class SetFilingAction {
    constructor(public filing: Filing) {}
}

export class ClearTickersAction { constructor(public foo: boolean) { } }

export type Action = SetSymbolAction | SetFilingAction | ClearTickersAction;
