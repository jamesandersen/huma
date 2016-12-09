import { Action } from '@ngrx/store';

export interface DataLoadAction extends Action {
    loading: boolean;
}