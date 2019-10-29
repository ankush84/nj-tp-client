import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-production-available',
  templateUrl: './production-available.component.html',
  styleUrls: ['./production-available.component.less']
})
export class ProductionAvailableComponent implements OnInit {

   @Input()
  displayedColumns = ['date', 'productName', 'qty', 'cost','lotNumber'];

  @Input()
  dataSource: MatTableDataSource<ProductionStockSupply>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  stockData: ProductionStockSupply[] = [];
  stockSubscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.stockData);
  }

  ngOnInit() {
    this.stockSubscription =  this.commService.subscribe("ProductionStock", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
          case SupplyMessage.UPDATE:
          let stock = <ProductionStockSupply>JSON.parse(supply.supply);
          (<any>stock).date = new Date(stock.timestamp).toString().slice(0,24);;
          this.stockData.push(stock);

          this.refreshDataSource();

          break;
        case SupplyMessage.DELETE:
          let toDel = <ProductionStockSupply>JSON.parse(supply.supply);

          let index = -1;
          for (let i; index < this.stockData.length; i++) {
            if (this.stockData[i].id === toDel.id) {
              index = i;
              break;
            }
          }
          if (index > -1) {
            this.stockData.splice(index, 1);
          }
          this.refreshDataSource();
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

class ProductionStockSupply {
  id: number;
  productName: String;
  qty: number;
  cost: number;
  lotNumber: String;
  timestamp: number;
}
