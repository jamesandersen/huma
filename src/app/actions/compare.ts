import { Action } from '@ngrx/store';
import { Filing } from '../models/filing';
import { Symbol } from '../models/symbol';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 * 
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique. 
 */
export const ActionTypes = {
  SET_SYMBOL:  '[Compare] SetSymbol',
  SET_FILING:  '[Compare] SetFiling',
  CLEAR:       '[Compare] Clear',
  LOADING:     '[Compare] Loading'
};

export interface Set<T> {
    data: T;
    index: number;
}

export interface SetLoading {
  target: string;
  index: number;
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 * 
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SetSymbolAction implements Action {
  type = ActionTypes.SET_SYMBOL;

  constructor(public payload: Set<Symbol>) { }
}

export class SetFilingAction implements Action {
  type = ActionTypes.SET_FILING;

  constructor(public payload: Set<Filing>) { }
}

export class ClearAction implements Action {
  type = ActionTypes.CLEAR;

  constructor(public payload: any) { }
}

export class LoadingAction implements Action {
  type = ActionTypes.LOADING;

  constructor(public payload: SetLoading) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SetSymbolAction
  | SetFilingAction
  | ClearAction
  | LoadingAction;