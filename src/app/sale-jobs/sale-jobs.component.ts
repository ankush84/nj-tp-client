import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-sale-jobs',
  templateUrl: './sale-jobs.component.html',
  styleUrls: ['./sale-jobs.component.less']
})
export class SaleJobsComponent implements OnInit {

    @Input()
    displayedColumns = ['date','party', 'billNo' ,'saleNo','productName', 'qtyUsed', 'lotNumber', 'details'];
  
    @Input()
    dataSource: MatTableDataSource<SaleJobSupply>;
  
    @ViewChild(MatSort, { static: false }) sort: MatSort;
  
    jobData: SaleJobSupply[] = [];
    stockSubscription: ISubscription;
    private beginCount: number = 0;
  
    constructor(private commService: CommService) {
  
      this.dataSource = new MatTableDataSource(this.jobData);
    }
  
    ngOnInit() {
      this.stockSubscription =  this.commService.subscribe("Sale", (supply) => {
  
        switch (supply.phase) {
          case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
          case SupplyMessage.BATCH_END: this.beginCount--;
            this.refreshDataSource();
            break;
          case SupplyMessage.ADD:
            let job = <SaleJobSupply>JSON.parse(supply.supply);
            (<any>job).date = new Date(job.timestamp).toString().slice(0,24);;
  
            this.jobData.push(job);
  
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
        this.dataSource = new MatTableDataSource(this.jobData);
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
  