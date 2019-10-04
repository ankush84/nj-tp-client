import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddPurchaseComponent } from '../add-purchase/add-purchase.component';
import { AddProductionComponent } from '../add-production/add-production.component';

@Component({
  selector: 'app-dashboard-inventory',
  templateUrl: './dashboard-inventory.component.html',
  styleUrls: ['./dashboard-inventory.component.less']
})
export class DashboardInventoryComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  onAddPurchase() {

    const dialogConfig = new MatDialogConfig();

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;

    this.dialog.open(AddPurchaseComponent, dialogConfig);
}

onAddProduction() {

  const dialogConfig = new MatDialogConfig();

  this.dialog.open(AddProductionComponent, dialogConfig);
}

}
