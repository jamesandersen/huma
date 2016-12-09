import {Component, OnInit, OnChanges, SimpleChanges, Input, trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { Filing } from '../models/filing';

@Component({
  selector: 'app-filing-chart',
  styleUrls: ['./filing-chart.less'],
  templateUrl: './filing-chart.html',
  animations: [
    trigger('chartStateTrigger', [
      state('inactive', style({
        backgroundColor: '*',
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
    let val = dollarValue / this.maxValue * 100;
    return isNaN(val) ? 0 : val;
  }

  getFilingChartCoordinates= () => {
    let firstCoord = { x: 0, y: 100, height: 0, down: false }; // start in top left of chart
    let coords: any = { };

    let buildCoord: any = (lastCoord: any, value: number, isCredit: boolean) => {

      // set the height by adjusting the raw $ value to chart scale
      let height = Math.abs(this.pixelValue(value));

      // if there is a value move x over to the right, otherwise keep it the same
      let x = value !== 0 ? lastCoord.x + 10 : lastCoord.x;

      // y is based on the height of the value but also whether value is + or - AND credit or debit
      // a positive debit OR negative credit takes us DOWN the y-axis while
      // a negative debit OR positive credit takes us UP the y-axis
      let down = (value > 0 ? true : false) && (isCredit ? false : true );
      let lastCoordStartY = lastCoord.y + (lastCoord.down ? lastCoord.height : 0);
      let y = lastCoordStartY - (down ? 0 : height);

      console.log(`height: ${height}, x: ${x}, y: ${y}, down: ${down}`);
      return { height: height, x: x, y: y, down: down };
    };
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
