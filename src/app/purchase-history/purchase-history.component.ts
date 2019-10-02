import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.less']
})
export class PurchaseHistoryComponent implements OnInit ,OnDestroy{
 
  @Input()
  displayedColumns = ['date', 'billingId', 'productName', 'price', 'qty', 'details'];

  @Input()
  dataSource: MatTableDataSource<PurchaseSupply>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  purchaseData: PurchaseSupply[] = [];
  purchaseSubscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.purchaseData);
  }


  ngOnInit() {
   this.purchaseSubscription =  this.commService.subscribe("Purchase", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
          let purchase = <PurchaseSupply>JSON.parse(supply.supply);
          (<any>purchase).date = new Date(purchase.timestamp);
          this.purchaseData.push(purchase);

          this.refreshDataSource();

          break;
        case SupplyMessage.DELETE:

          //this.purchaseHistoryMap.delete(purchase.id);
          break;
      }

    });
  }

  ngOnDestroy(): void {
    this.purchaseSubscription.dispose();
  }

  private refreshDataSource() {
    if (this.beginCount === 0) {
      this.dataSource = new MatTableDataSource(this.purchaseData);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });

    }
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
