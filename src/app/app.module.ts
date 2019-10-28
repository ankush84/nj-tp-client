import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTableDataSource,
  MatDialogModule,
  MatIconModule, 
  MatSidenavModule,
  MatToolbarModule,
  MatMenuModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsSummaryComponent } from './products-summary/products-summary.component';
import { ProductionJobsComponent } from './production-jobs/production-jobs.component';
import { ProductsAvailableComponent } from './products-available/products-available.component';
import { LoginComponent } from './login/login.component';
import { DashboardInventoryComponent } from './dashboard-inventory/dashboard-inventory.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { AddProductionComponent } from './add-production/add-production.component';
import { ProductionSummaryComponent } from './production-summary/production-summary.component';
import { AddProductionTprComponent } from './add-production-tpr/add-production-tpr.component';
import { AddProductionCustomFieldComponent } from './add-production-custom-field/add-production-custom-field.component';
import { AddProductionTpeComponent } from './add-production-tpe/add-production-tpe.component';
import { AddProductionModifierComponent } from './add-production-modifier/add-production-modifier.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsSummaryComponent,
    ProductionJobsComponent,
    ProductsAvailableComponent,
    PurchaseHistoryComponent,
    LoginComponent,
    DashboardInventoryComponent,
    AddPurchaseComponent,
    AddProductionComponent,
    ProductionSummaryComponent,
    AddProductionTprComponent,
    AddProductionCustomFieldComponent,
    AddProductionTpeComponent,
    AddProductionModifierComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule, MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatMenuModule,
  ],

  entryComponents: [AddPurchaseComponent, AddProductionComponent, AddProductionTprComponent,AddProductionTpeComponent ,AddProductionModifierComponent],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
