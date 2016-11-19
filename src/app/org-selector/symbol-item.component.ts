import {Component, Input, EventEmitter, ChangeDetectionStrategy, trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import {Symbol} from '../models/symbol';

@Component({
  selector: 'symbol-item', // <app></app>
  providers: [],
  styles: [require('./symbol-item.less')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `
    <li [@itemStateTrigger]="state" class="symbol-item" [ngClass]="{ selected: state == 'selected' }">
      <div>
        <svg class="check" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
        <g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M39.363,79L16,55.49l11.347-11.419L39.694,56.49L72.983,23L84,34.085L39.363,79z">
        </path>
        </g>
        </svg>
        <span class="exchange">{{symbol.exchange}}:</span>
        <span class="ticker">{{symbol.Symbol}}</span>
      </div>
      <div class="name">{{symbol.Name}}</div>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('itemStateTrigger', [
      state('default', style({
        backgroundColor: '#eee'
      })),
      state('selected',   style({
        transform: 'scale(1.05)'
      })),
      state('unselected',   style({
        borderColor: 'gray'
      })),
      transition('default => selected, unselected => selected', [
        style({transform: 'scale(1)'}),
        animate(200)
      ]),
      transition('void => *', [
        style({transform: 'scale(0.95)', opacity: '0.2'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%) scale(1)'}))
      ]),
    ])
  ]
})
export class SymbolItemComponent {
   @Input() symbol: Symbol;
   @Input() selected: boolean = false;
   
   constructor(){}
  
   get state() : string {
     return this.selected === true ? 'selected' : (this.selected === false ? 'unselected' : 'default');
   }
}