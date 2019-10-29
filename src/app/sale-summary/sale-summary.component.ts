import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
  import { CommService, ISubscription } from '../comm/comm.service';
  import { SupplyMessage } from '../comm/payload';
  import { MatTableDataSource, MatSort } from '@angular/material';
  
@Component({
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.less']
})
export class SaleSummaryComponent implements OnInit {
  
    @Input()
    displayedColumns = ['party', 'product', 'qty'];
  
    @Input()
    dataSource: MatTableDataSource<SaleSummary>;
  
    @ViewChild(MatSort, { static: false }) sort: MatSort;
  
    summary: SaleSummary[] = [];
    details:{[productName:string]:{[id:number] : SaleJobSupply}} = {};
    subscription: ISubscription;
    private beginCount: number = 0;
  
    constructor(private commService: CommService) {
  
      this.dataSource = new MatTableDataSource(this.summary);
    }
  
    ngOnInit() {
      this.subscription =  this.commService.subscribe("Sale", (supply) => {
  
        switch (supply.phase) {
          case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
          case SupplyMessage.BATCH_END: this.beginCount--;
            this.refreshDataSource();
            break;
          case SupplyMessage.ADD:
            let sale = <SaleJobSupply>JSON.parse(supply.supply);
            if(!sale.party || sale.party==null)break;
            if(!sale.productName || sale.productName==null)break;
            
            let partyProduct=sale.party.toString() + "_" + sale.productName.toString();
            if (!this.details[partyProduct])
            {
              this.details[partyProduct]={};
            }
  
            this.details[partyProduct][sale.id]=sale;
  
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
          
          let summary = new SaleSummary();
          summary.qty=0;
  
          Object.keys(this.details[key]).forEach(id => {
            let sup =<SaleJobSupply> this.details[key][id];
            let totalQty =sup.qtyUsed;
            summary.qty+=sup.qtyUsed;
            summary.party = sup.party;
            summary.product = sup.productName;  
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
  
  class SaleSummary {
    party: String;
    qty: number;
    product: String;
  }
  
  export class SaleJobSupply {
    id: number;
    party: String;
    billNo: String;
    saleNo: number;
    productName: String;
    qtyUsed: number;
    lotNumber: String;
    details: String;
    timestamp: number;
  }
  