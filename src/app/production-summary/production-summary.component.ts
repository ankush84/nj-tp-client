import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-production-summary',
  templateUrl: './production-summary.component.html',
  styleUrls: ['./production-summary.component.less']
})
export class ProductionSummaryComponent implements OnInit {


  @Input()
  displayedColumns = ['finalProductName', 'qty', 'amount'];

  @Input()
  dataSource: MatTableDataSource<ProductionSummary>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  summary: ProductionSummary[] = [];
  details:{[productName:string]:{[id:number] : ProductionStockSupply}} = {};
  subscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.summary);
  }

  ngOnInit() {
    this.subscription =  this.commService.subscribe("ProductionStock", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
        case SupplyMessage.UPDATE:
          let production = <ProductionStockSupply>JSON.parse(supply.supply);
          if(!production.productName || production.productName==null)break;
          if(!this.details[production.productName.toString()])
          {
            this.details[production.productName.toString()]={};
          }

          this.details[production.productName.toString()][production.id]=production;

          
          //this.stockData.push(stock);

          this.refreshDataSource();

          break;
        case SupplyMessage.DELETE:
          let productionToDel = <ProductionStockSupply>JSON.parse(supply.supply);
          if (this.details[productionToDel.productName.toString()]) {
            delete this.details[productionToDel.productName.toString()][productionToDel.id];
            let allRemoved = true;
            Object.keys(this.details[productionToDel.productName.toString()]).forEach(id => {
              if (this.details[productionToDel.productName.toString()][id]) {
                allRemoved = false;
              }
            });
            if (allRemoved) {
              delete this.details[productionToDel.productName.toString()]
            }
          }
          this.refreshDataSource();
          
          break;
      }

    });
  }

  ngOnDestroy(): void {
    this.subscription.dispose();
  }

  private refreshDataSource() {
    if (this.beginCount === 0) {
      this.summary=[];
      Object.keys(this.details).forEach(key => {
        
        let summary = new ProductionSummary();
        summary.finalProductName=key;
        summary.qty=0;
        summary.amount=0;

        Object.keys(this.details[key]).forEach(id => {
          let sup =<ProductionStockSupply> this.details[key][id];
          summary.qty+=sup.qty;
          if(sup.cost){
          summary.amount+=sup.cost;
          }

        });
        this.summary.push(summary);
      });

      this.dataSource = new MatTableDataSource(this.summary);
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

class ProductionSummary {
  finalProductName: String;
  qty: number;
  amount: number;
}

 class ProductionStockSupply {
  id: number;
  productName: String;
  qty: number;
  cost: number;
  lotNumber: String;
  timestamp: number;
}