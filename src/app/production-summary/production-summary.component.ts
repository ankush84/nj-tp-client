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
  details:{[productName:string]:{[id:number] : ProductionJobSupply}} = {};
  subscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.summary);
  }

  ngOnInit() {
    this.subscription =  this.commService.subscribe("Production", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
          let production = <ProductionJobSupply>JSON.parse(supply.supply);
          if(!production.finalProductName || production.finalProductName==null)break;
          if(!this.details[production.finalProductName.toString()])
          {
            this.details[production.finalProductName.toString()]={};
          }

          this.details[production.finalProductName.toString()][production.id]=production;

          
          //this.stockData.push(stock);

          this.refreshDataSource();

          break;
        case SupplyMessage.DELETE:

          //this.purchaseHistoryMap.delete(purchase.id);
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
          let sup =<ProductionJobSupply> this.details[key][id];
          let totalQty =sup.qtyUsed+ sup.qtyWaste;
          summary.qty+=sup.qtyUsed;
          summary.amount+=(totalQty * sup.price);

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

 class ProductionJobSupply {
  id: number;
  purchaseId: number;
  productName: String;
  qtyUsed: number;
  qtyWaste: number;
  price: number;
  finalProductName: String;
  details: String;
  timestamp: number;
}