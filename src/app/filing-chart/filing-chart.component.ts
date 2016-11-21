import {Component, OnInit, OnChanges, SimpleChanges, Input, trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { Filing } from '../models/filing';

@Component({
  selector: 'filing-chart',
  styles: [require('./filing-chart.less')],
  template: `
    <div class="chart" [@chartStateTrigger]="chartState">
        Filing Chart {{filing?.tradingSymbol}}
        <div>Document Type: {{filing?.documentType}}</div>
        <div>Period End: {{filing?.documentPeriodEndDate}}</div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" id="svg2" viewBox="0 0 100 100">
            <g id="layer1" >
              <rect id="revenues" width="8" 
                [attr.height]="coords.revenues?.height" 
                [attr.x]="coords.revenues?.x" 
                [attr.y]="coords.revenues?.y" 
                fill="#14a918" stroke-width="0"/>
              
              <rect id="cost_of_revenue" width="8" 
                [attr.height]="coords.costOfRevenue?.height" 
                [attr.x]="coords.costOfRevenue?.x" 
                [attr.y]="coords.costOfRevenue?.y" 
                fill="#ce3100" stroke="#000" stroke-width="0"/>
              <rect id="operating_expenses" width="8" 
                [attr.height]="coords.operatingExpenses?.height" 
                [attr.x]="coords.operatingExpenses?.x" 
                [attr.y]="coords.operatingExpenses?.y" 
                fill="#ce3100" 
                stroke="#000" stroke-width="0"/>
              <rect id="other_operating_income" width="8" 
                [attr.height]="coords.otherOperatingIncome?.height" 
                [attr.x]="coords.otherOperatingIncome?.x" 
                [attr.y]="coords.otherOperatingIncome?.y" 
                fill="#14a918" stroke="#000" stroke-width="0"/>
              <rect id="non_operating_income" width="8" 
                [attr.height]="coords.nonoperatingIncomeLoss?.height" 
                [attr.x]="coords.nonoperatingIncomeLoss?.x"
                [attr.y]="coords.nonoperatingIncomeLoss?.y"
                fill="#14a918" 
                stroke="#000" 
                stroke-width="0"/>
              <rect id="interest_debt_expense" width="8" 
                [attr.height]="coords.interestAndDebtExpense?.height" 
                [attr.x]="coords.interestAndDebtExpense?.x" 
                [attr.y]="coords.interestAndDebtExpense?.y" 
                fill="#ce3100" 
                stroke="#000" stroke-width=".058"/>
              <rect id="tax_expense" width="7.883" 
                [attr.height]="coords.incomeTaxExpenseBenefit?.height" 
                [attr.x]="coords.incomeTaxExpenseBenefit?.x"
                [attr.y]="coords.incomeTaxExpenseBenefit?.y"
                fill="#ce3100" stroke="#000" stroke-width="0"/>
              <rect id="discontinued_operations" width="7.934" 
                [attr.height]="coords.incomeFromDiscontinuedOperations?.height" 
                [attr.x]="coords.incomeFromDiscontinuedOperations?.x"
                [attr.y]="coords.incomeFromDiscontinuedOperations?.y"
                fill="#ce3100" 
                stroke="#000" stroke-width="0"/>
              <rect id="extraordinary_items" width="7.941" 
                [attr.height]="coords.extraordaryItemsGainLoss?.height" 
                [attr.x]="coords.extraordaryItemsGainLoss?.x"
                [attr.y]="coords.extraordaryItemsGainLoss?.y"
                fill="#ce3100" stroke="#000" stroke-width="0"/>
            </g>
          </svg>
        </div>
        <br>
        <div class="rollup credit">Revenues: {{filing?.revenues}}</div>
        <div class="debit indent1">Cost of Revenue: {{filing?.costOfRevenue}}</div>
        <div class="debit indent1">Operating Expenses: {{filing?.operatingExpenses}}</div>
        <div class="debit rollup">Costs and Expenses: {{filing?.costsAndExpenses}}</div>
        <div class="credit">Other operating income: {{filing?.otherOperatingIncome}}</div>
        <div class="debit">Operating Income: {{filing?.operatingIncomeLoss}}</div>
        <br/>
        <div class="rollup credit">Non-operating income: {{filing?.nonoperatingIncomeLoss}}</div>
        <div class="debit indent1">Interest And Debt Expense: {{filing?.interestAndDebtExpense}}</div>
        <div class="credit rollup">Income (Loss) from Continuing Operations Before Tax: {{filing?.incomeFromContinuingOperationsBeforeTax}}</div>
        <br/>

        <div class="rollup credit">Income Tax Expense (Benefit): {{filing?.incomeTaxExpenseBenefit}}</div>
        <div class="debit indent1">Income (Loss) from Continuing Operations After Tax: {{filing?.incomeFromContinuingOperationsAfterTax}}</div>
        <div class="credit indent1">Income (Loss) from Discontinued Operations, Net of Tax: {{filing?.incomeFromDiscontinuedOperations}}</div>
        <div class="credit rollup">Extraordinary Items of Income (Expense), Net of Tax: {{filing?.extraordaryItemsGainLoss}}</div>
        <div class="credit rollup">Net Income (Loss): {{filing?.netIncomeLoss}}</div>
        
        <br/>
        <button (click)="toggleChartState()">Toggle State</button>
        <!--<div>
          <svg class="pie" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" />
          </svg>
        </div>
        <div class="container">
          <div class="container-chart">
            <div class="container-semicircle">
              <div class="semicircle large"></div>
              <div class="semicircle mid"></div>
              <div class="semicircle small"></div>
            </div>
          </div>
        </div>-->
        
    </div>
  `,
  animations: [
    trigger('chartStateTrigger', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class FilingChartComponent implements OnInit, OnChanges {
   public chartState: string = 'inactive';
   @Input() filing: Filing;
   @Input() maxValue: number;
   public coords: any = {};

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['filing'] || changes['maxValue']) {
        if (this.filing && this.maxValue > 0) {
          this.coords = this.getFilingChartCoordinates();
        }
      }
  }

  toggleChartState = () => {
    this.chartState = this.chartState === 'inactive' ? 'active' : 'inactive';
  }

  pixelValue = dollarValue => {
    var val = dollarValue / this.maxValue * 100;
    return isNaN(val) ? 0 : val;
  }

  getFilingChartCoordinates= () => {
    var firstCoord = { x: 0, y: 100, height: 0, down: false }; // start in top left of chart
    var coords : any = { };

    var buildCoord : any = (lastCoord: any, value: number, isCredit: boolean) => {

      // set the height by adjusting the raw $ value to chart scale
      var height = Math.abs(this.pixelValue(value));

      // if there is a value move x over to the right, otherwise keep it the same
      var x = value !== 0 ? lastCoord.x + 10 : lastCoord.x;

      // y is based on the height of the value but also whether value is + or - AND credit or debit
      // a positive debit OR negative credit takes us DOWN the y-axis while
      // a negative debit OR positive credit takes us UP the y-axis
      var down = (value > 0 ? true : false) && (isCredit ? false : true );
      var lastCoordStartY = lastCoord.y + (lastCoord.down ? lastCoord.height : 0);
      var y = lastCoordStartY - (down ? 0 : height);

      console.log(`height: ${height}, x: ${x}, y: ${y}, down: ${down}`);
      return { height: height, x: x, y: y, down: down };
    }
    coords.revenues = buildCoord(firstCoord, this.filing.revenues, true);
    coords.costOfRevenue = buildCoord(coords.revenues, this.filing.costOfRevenue, false);
    coords.operatingExpenses = buildCoord(coords.costOfRevenue, this.filing.operatingExpenses, false);
    coords.otherOperatingIncome = buildCoord(coords.operatingExpenses, this.filing.otherOperatingIncome, true);
    coords.nonoperatingIncomeLoss = buildCoord(coords.otherOperatingIncome, this.filing.nonoperatingIncomeLoss, true);
    coords.interestAndDebtExpense = buildCoord(coords.nonoperatingIncomeLoss, this.filing.interestAndDebtExpense, false);
    coords.incomeTaxExpenseBenefit = buildCoord(coords.interestAndDebtExpense, this.filing.incomeTaxExpenseBenefit, false);
    coords.incomeFromDiscontinuedOperations = buildCoord(coords.incomeTaxExpenseBenefit, this.filing.incomeFromDiscontinuedOperations, true);
    coords.extraordaryItemsGainLoss = buildCoord(coords.incomeFromDiscontinuedOperations, this.filing.extraordaryItemsGainLoss, true);

    return coords;
  }
}