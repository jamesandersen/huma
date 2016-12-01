import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { OrgSelectorComponent } from './org-selector/org-selector.component';
import { CompareComponent } from './compare/compare.component';
import { SymbolPickerComponent } from './org-selector/symbol-picker.component';
import { SymbolItemComponent } from './org-selector/symbol-item.component';
import { FilingChartComponent } from './filing-chart/filing-chart.component';

import { OrgSelectorRoutes } from './org-selector/org-selector.routes';
import { CompareRoutes } from './compare/compare.routes';

import { reducer } from './reducers';

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
    RouterModule.forRoot(routes),
    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
