import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddPurchaseComponent } from '../add-purchase/add-purchase.component';
import { AddProductionTprComponent } from '../add-production-tpr/add-production-tpr.component';
import { AddProductionComponent } from '../add-production/add-production.component';
import { AddProductionTpeComponent } from '../add-production-tpe/add-production-tpe.component';

@Component({
  selector: 'app-dashboard-inventory',
  templateUrl: './dashboard-inventory.component.html',
  styleUrls: ['./dashboard-inventory.component.less']
})
export class DashboardInventoryComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  onAddPurchase(productName:string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    dialogConfig.data=productName;
    this.dialog.open(AddPurchaseComponent, dialogConfig);
}

onAddTPRProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddProductionTprComponent, dialogConfig);
}

onAddTPEProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddProductionTpeComponent, dialogConfig);
}

onAddModifierProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddProductionTprComponent, dialogConfig);
}
onAddMasterBatchProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddProductionTprComponent, dialogConfig);
}
onAddProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddProductionComponent, dialogConfig);
}


}
