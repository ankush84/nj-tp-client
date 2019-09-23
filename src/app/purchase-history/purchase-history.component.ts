import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommService } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.less']
})
export class PurchaseHistoryComponent implements OnInit {

  @Input()
  displayedColumns = ['date', 'billNo', 'productName', 'price', 'qty', 'details'];

  @Input()
  dataSource: MatTableDataSource<PurchaseSupply>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  purchaseData: PurchaseSupply[] = [];

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.purchaseData);
  }

  ngOnInit() {
    this.commService.subscribe("Purchase", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.ADD:
          let purchase = <PurchaseSupply>JSON.parse(supply.supply);
          (<any>purchase).date = new Date(purchase.timestamp);
          //purchase.timestamp=new Date(purchase.timestamp);
          this.purchaseData.push(purchase);

          break;
        case SupplyMessage.DELETE:

          //this.purchaseHistoryMap.delete(purchase.id);
          break;
      }

    });
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}

export class PurchaseSupply {
  id: number;
  productName: String;
  price: number;
  qty: number;
  details: String;
  billingId: String;
  timestamp: number;
}
