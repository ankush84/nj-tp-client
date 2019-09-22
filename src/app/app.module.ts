import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsSummaryComponent } from './products-summary/products-summary.component';
import { ProductsPurchaseComponent } from './products-purchase/products-purchase.component';
import { ProductsConsumeComponent } from './products-consume/products-consume.component';
import { ProductsAvailableComponent } from './products-available/products-available.component';
import { LoginComponent } from './login/login.component';
import { DashboardInventoryComponent } from './dashboard-inventory/dashboard-inventory.component';
//AIzaSyCVXKd8EzbsAhzq75OrYCICDClz3q53XsQ
@NgModule({
  declarations: [
    AppComponent,
    ProductsSummaryComponent,
    ProductsPurchaseComponent,
    ProductsConsumeComponent,
    ProductsAvailableComponent,
    LoginComponent,
    DashboardInventoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
