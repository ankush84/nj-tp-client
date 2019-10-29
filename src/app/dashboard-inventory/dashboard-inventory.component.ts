import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddPurchaseComponent } from '../add-purchase/add-purchase.component';
import { AddProductionTprComponent } from '../add-production-tpr/add-production-tpr.component';
import { AddProductionComponent } from '../add-production/add-production.component';
import { AddProductionTpeComponent } from '../add-production-tpe/add-production-tpe.component';
import { AddProductionModifierComponent } from '../add-production-modifier/add-production-modifier.component';
import { AddProductionMasterBatchComponent } from '../add-production-master-batch/add-production-master-batch.component';
import { AddSaleComponent } from '../add-sale/add-sale.component';

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
    dialogConfig.data="TPR";

  this.dialog.open(AddProductionTprComponent, dialogConfig);
}

onAddTPEProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="TPE";

  this.dialog.open(AddProductionTpeComponent, dialogConfig);
}

onAddModifierProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="Modifier";

  this.dialog.open(AddProductionModifierComponent, dialogConfig);
}
onAddMasterBatchProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="Master Batch";

  this.dialog.open(AddProductionMasterBatchComponent, dialogConfig);
}
onAddProduction() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.data="";

  this.dialog.open(AddProductionComponent, dialogConfig);
}



onAddTPRSale() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="TPR";

  this.dialog.open(AddSaleComponent, dialogConfig);
}

onAddTPESale() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="TPE";

  this.dialog.open(AddSaleComponent, dialogConfig);
}

onAddModifierSale() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="Modifier";

  this.dialog.open(AddSaleComponent, dialogConfig);
}
onAddMasterBatchSale() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data="Master Batch";

  this.dialog.open(AddSaleComponent, dialogConfig);
}

onAddSale() {

  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

  this.dialog.open(AddSaleComponent, dialogConfig);
}

}
