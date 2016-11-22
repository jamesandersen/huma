import {Component, OnInit, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Response} from '@angular/http';
import {FormControl, FormGroup } from '@angular/forms';
import {Observable, Observer, BehaviorSubject} from 'rxjs';
import {Action, SetSymbolAction } from '../models/Actions';
import {SECDataService} from '../secdata/sec-data.service';
import {Symbol} from '../models/symbol';
import {AppState} from '../models/AppState';
import { state } from '../../app/app.dispatcher';
import {SymbolItemComponent} from './symbol-item.component';

/*
 * App Component
 * Top Level Component
 */
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'app'
  selector: 'symbol-picker', // <app></app>

  providers: [SECDataService],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [require('./symbol-picker.less')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `<div class="symbol" [formGroup]="symbolForm">
      <input type="text" name="ticker" required formControlName="ticker" [placeholder]="placeholder">
      <ul [hidden]="loading | async">
        <symbol-item *ngFor="let symbol of tickerSymbols | async" (click)="onSelection(symbol)"
          [symbol]="symbol"
          [selected]="!selectedSymbol ? undefined : symbol.Symbol === selectedSymbol.Symbol"
          ></symbol-item>
      </ul>
      <div [hidden]="(loading | async) === false || false" class="loader">Loading...</div>
    </div>`
})
export class SymbolPickerComponent implements OnInit, OnChanges {
  @Input() selectedSymbol: Symbol;
  @Input() placeholder: string;
  @Output() symbolSelected = new EventEmitter<Symbol>();

  public tickerControl = new FormControl();
  public symbolForm = new FormGroup({ ticker: this.tickerControl });

  public tickerSymbols: Observable<Array<Symbol>>;
  public loading = new BehaviorSubject<boolean>(false);

  private symbolsSubject = new BehaviorSubject<Symbol[]>([]);
  private updatingSelectedSymbol : boolean = false;

  constructor(
    @Inject(state) private state: Observable<AppState>,
    public dataService: SECDataService) { }

  ngOnInit() {

    // merge initial value with subsequent changes into stream
    var symbolChangesByUserEntry = this.tickerControl.valueChanges
        .filter(txt => !this.updatingSelectedSymbol)
        .debounceTime(200)
        .distinctUntilChanged()
        .switchMap(term => {
          console.log('ticker value change: ' + term);
          this.loading.next(true);
          return this.dataService.searchSymbols(term.toString())
                  .catch((err, obs) => Observable.from([[ <Symbol>{ Name: `no data matches ${term}`}]]));
        })
        .do(val => this.loading.next(false));

    // for each ticker value change, fetch the matching symbol values
    this.tickerSymbols = Observable.merge(this.symbolsSubject, symbolChangesByUserEntry).share();
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['selectedSymbol']) {
        if (changes['selectedSymbol'].currentValue) {
          this.setupSelectedSymbol(changes['selectedSymbol'].currentValue);
        }
      }
  }

  onSelection(evt: Symbol) {
    this.symbolSelected.emit(evt);
  }

  setupSelectedSymbol(sym: Symbol) {
    this.updatingSelectedSymbol = true;
    this.tickerControl.setValue(sym.Symbol);
    this.symbolsSubject.next([sym]);
    this.loading.next(false);
    this.updatingSelectedSymbol = false;
  }
}