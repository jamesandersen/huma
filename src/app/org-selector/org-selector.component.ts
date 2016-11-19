import {Component, OnInit, Inject} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Observer} from 'rxjs';
import {Action, SetSymbolAction } from '../models/Actions';
import { ActivatedRoute, Router } from '@angular/router';
import {Symbol} from '../models/symbol';
import {AppState} from '../models/AppState';
import {state, dispatcher } from '../../app/app.dispatcher';
import {SymbolPickerComponent} from './symbol-picker.component';
import {SECDataService} from '../secdata/sec-data.service';

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
  //pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  //styles: [require('./launch.less')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./launch.html'),
  styles: [require('./launch.less')]
})
export class OrgSelectorComponent implements OnInit {
  public error: string;
  
  private autoSelect1 : boolean = true;

  constructor( 
    @Inject(dispatcher) private dispatcher: Observer<Action>,
    @Inject(state) private state: Observable<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private secService: SECDataService) { }

  ngOnInit() {
    // set default symbols
    this.state.take(1).subscribe(currentState => {
      if (!currentState.compare.symbol1) {
        this.secService.getSymbol('MSFT').subscribe(sym => this.onSelection(1, sym));
      }

      if (!currentState.compare.symbol2) {
        this.secService.getSymbol('AAPL').subscribe(sym => this.onSelection(2, sym));
      }
    });
  }

  get compare() { return this.state.map(s => s.compare); }
  get canCompare() { return this.state.map(s => !!(s.compare.symbol1 && s.compare.symbol2)); }

  onSelection(index: number, evt: Symbol) {
    this.dispatcher.next(new SetSymbolAction(index, evt));
  }

  compareSymbols() {
    // Pass along the hero id if available
    this.router.navigate(['/compare']);
  }
}