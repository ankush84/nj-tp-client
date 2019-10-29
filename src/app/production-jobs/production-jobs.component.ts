import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { CommService, ISubscription } from '../comm/comm.service';
import { SupplyMessage } from '../comm/payload';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-production-jobs',
  templateUrl: './production-jobs.component.html',
  styleUrls: ['./production-jobs.component.less']
})
export class ProductionJobsComponent implements OnInit {

  @Input()
  displayedColumns = ['date','finalProductName', 'lotNumber' ,'productName', 'qtyUsed','qtyWaste', 'purchaseId','details'];

  @Input()
  dataSource: MatTableDataSource<ProductionJobSupply>;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  jobData: ProductionJobSupply[] = [];
  stockSubscription: ISubscription;
  private beginCount: number = 0;

  constructor(private commService: CommService) {

    this.dataSource = new MatTableDataSource(this.jobData);
  }

  ngOnInit() {
    this.stockSubscription =  this.commService.subscribe("Production", (supply) => {

      switch (supply.phase) {
        case SupplyMessage.BATCH_BEGIN: this.beginCount++; break;
        case SupplyMessage.BATCH_END: this.beginCount--;
          this.refreshDataSource();
          break;
        case SupplyMessage.ADD:
          let job = <ProductionJobSupply>JSON.parse(supply.supply);
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

export class ProductionJobSupply {
  id: number;
  purchaseId: number;
  finalProductName: String;
  productName: String;
  qtyUsed: number;
  qtyWaste: number;
  lotNumber: String;
  details: String;
  timestamp: number;
}
