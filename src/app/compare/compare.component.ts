import {Component, OnInit, OnDestroy} from '@angular/core';
import {SECDataService} from '../secdata/sec-data.service';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';

import {SetFilingAction } from '../actions/compare';

import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { SECCompare } from '../reducers/compare';

/*
 * Compare Component
 * Compares filings for two companies
 */
@Component({
  selector: 'app-compare',
  providers: [ SECDataService ],
  styleUrls: ['./compare.less'],
  template: `
  <div class="compare">
    <div [hidden]="(loading1 | async)">
      <app-filing-chart 
        [filing]="(compare | async).filing1" 
        [maxValue]="(maxValue | async)"></app-filing-chart>
    </div>
    <div [hidden]="(loading1 | async) === false || false" class="loader">Loading...</div>
  </div>
  <div class="compare">
    <div [hidden]="(loading2 | async)">
      <app-filing-chart 
        [filing]="(compare | async).filing2" 
        [maxValue]="(maxValue | async)"></app-filing-chart>
    </div>
    <div [hidden]="(loading2 | async) === false || false" class="loader">Loading...</div>
  </div>
  `
})
export class CompareComponent implements OnInit, OnDestroy {
   public loading1 = new BehaviorSubject<boolean>(false);
   public loading2 = new BehaviorSubject<boolean>(false);

   public maxValue = new Observable<number>();

   private subscriptions : Subscription[] = [];

   constructor(
     private state: Store<fromRoot.State>,
    public dataService: SECDataService) {}

  ngOnInit() {

    this.maxValue = this.state.map(state => {
      return state.compare && (state.compare.filing1 || state.compare.filing2)
        ? Math.max(
          state.compare.filing1 ? state.compare.filing1.revenues : 0,
          state.compare.filing2 ? state.compare.filing2.revenues : 0)
        : 0;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get compare(): Observable<SECCompare> { return this.state.map(s => s.compare); }
}