import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { OrgSelectorComponent } from './org-selector/org-selector.component';
import { CompareComponent } from './compare/compare.component';
import { SymbolPickerComponent } from './org-selector/symbol-picker.component';
import { SymbolItemComponent } from './org-selector/symbol-item.component';
import { FilingChartComponent } from './filing-chart/filing-chart.component';

import { OrgSelectorRoutes } from './org-selector/org-selector.routes';
import { CompareRoutes } from './compare/compare.routes';

import { stateAndDispatcher } from './app.dispatcher';

const routes: Routes = [
  ...OrgSelectorRoutes,
  ...CompareRoutes
];

@NgModule({
  declarations: [
    AppComponent,
    OrgSelectorComponent,
    CompareComponent,
    SymbolItemComponent,
    SymbolPickerComponent,
    FilingChartComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ stateAndDispatcher ],
  bootstrap: [AppComponent]
})
export class AppModule { }
