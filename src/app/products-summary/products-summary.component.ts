import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-products-summary',
  templateUrl: './products-summary.component.html',
  styleUrls: ['./products-summary.component.less']
})
export class ProductsSummaryComponent implements OnInit {


  @Input()
  displayedColumns = ['productName', 'qty', 'amount'];

  @Input()
  dataSource: MatTableDataSource<StockSummary>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  stockData: StockSummary[] = [];
  stockDetails:{[productName:string]:{[id:number] : StockSupply}} = {};
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
          case SupplyMessage.UPDATE:
          let stock = <StockSupply>JSON.parse(supply.supply);
          if(!stock.productName || stock.productName==null)break;
          if(!this.stockDetails[stock.productName.toString()])
          {
            this.stockDetails[stock.productName.toString()]={};
          }

          this.stockDetails[stock.productName.toString()][stock.id]=stock;

          
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
    this.stockSubscription.dispose();
  }

  private refreshDataSource() {
    if (this.beginCount === 0) {
      this.stockData=[];
      Object.keys(this.stockDetails).forEach(key => {
        
        let summary = new StockSummary();
        summary.productName=key;
        summary.qty=0;
        summary.amount=0;

        Object.keys(this.stockDetails[key]).forEach(id => {
          let stk =<StockSupply> this.stockDetails[key][id];
          summary.qty+=stk.qty;
          summary.amount+=(stk.qty * stk.price);

        });
        this.stockData.push(summary);
      });

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

class StockSummary {
  productName: String;
  qty: number;
  amount: number;
}

class StockSupply {
  id: number;
  purchaseId: number;
  productName: String;
  qty: number;
  price: number;
  timestamp: number;
}
