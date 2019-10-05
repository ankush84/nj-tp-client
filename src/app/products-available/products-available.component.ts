import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-products-available',
  templateUrl: './products-available.component.html',
  styleUrls: ['./products-available.component.less']
})
export class ProductsAvailableComponent implements OnInit {

  @Input()
  displayedColumns = ['date', 'productName', 'qty', 'price','purchaseId'];

  @Input()
  dataSource: MatTableDataSource<StockSupply>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  stockData: StockSupply[] = [];
  stockSubscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.stockData);
  }

  ngOnInit() {
    this.stockSubscription =  this.commService.subscribe("Stock", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
          let stock = <StockSupply>JSON.parse(supply.supply);
          (<any>stock).date = new Date(stock.timestamp).toString().slice(0,24);;
          this.stockData.push(stock);

          this.refreshDataSource();

          break;
        case SupplyMessage.DELETE:

          //this.purchaseHistoryMap.delete(purchase.id);
          break;
      }

    });
  }

  ngOnDestroy(): void {
    this.stockSubscription.dispose();
  }

  private refreshDataSource() {
    if (this.beginCount === 0) {
      this.dataSource = new MatTableDataSource(this.stockData);
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

export class StockSupply {
  id: number;
  purchaseId: number;
  productName: String;
  qty: number;
  price: number;
  timestamp: number;
}
