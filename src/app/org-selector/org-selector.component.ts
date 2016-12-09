import {Component, OnInit} from '@angular/core';
import {Observable } from 'rxjs';
import {SetSymbolAction } from '../actions/compare';
import { ActivatedRoute, Router } from '@angular/router';
import {Symbol} from '../models/symbol';
import {SECDataService} from '../secdata/sec-data.service';

import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { SECCompare } from '../reducers/compare';

/*
 * App Component
 * Top Level Component
 */
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'app'
  // selector: 'launch', // <app></app>

  providers: [SECDataService],
  // pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  // styles: [require('./launch.less')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './launch.html',
  styleUrls: ['./launch.less']
})
export class OrgSelectorComponent implements OnInit {
  public error: string;

  constructor(
    private state: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute,
    private secService: SECDataService) { }

  ngOnInit() {
    // set default symbols
    this.state.take(1).subscribe(currentState => {
      if (!currentState.compare.symbol1.value) {
        this.secService.getSymbol('MSFT').subscribe(sym => this.onSelection(1, sym));
      }

      if (!currentState.compare.symbol2.value) {
        this.secService.getSymbol('AAPL').subscribe(sym => this.onSelection(2, sym));
      }
    });
  }

  get compare(): Observable<SECCompare> { return this.state.map(s => s.compare)}
  get canCompare() { return this.state.map(s => !!(s.compare.symbol1.value && s.compare.symbol2.value)); }

  onSelection(index: number, evt: Symbol) {
    this.state.dispatch(new SetSymbolAction({ index: index, data: evt }));
  }

  compareSymbols() {
    // Pass along the hero id if available
    this.state.take(1).subscribe(s => 
      this.router.navigate(['/compare', s.compare.symbol1.value.Symbol, s.compare.symbol2.value.Symbol]));
  }
}
