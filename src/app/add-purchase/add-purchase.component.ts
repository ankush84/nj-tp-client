import { Component,  Inject,OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommService } from '../comm/comm.service';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.less']
})
export class AddPurchaseComponent implements OnInit {

  form: FormGroup = new FormGroup({
    billingId: new FormControl(''),
    productName: new FormControl(''),
    qty: new FormControl(''),
    price: new FormControl(''),
    details: new FormControl(''),
  });

  constructor(
  private commService: CommService,
    private dialogRef: MatDialogRef<AddPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
    
  ) { 
    if(data){
      this.form.get('productName').setValue(data);
    }
  }

  ngOnInit() {
  }

  save() {

    let args = {};
    args['billingId'] = this.form.get('billingId').value;
    args['productName'] = this.form.get('productName').value;
    args['qty'] = this.form.get('qty').value.toString();
    args['price'] = this.form.get('price').value.toString();
    args['details'] = this.form.get('details').value;

    this.commService.request("AddPurchase", args).then((reply) => {

      this.dialogRef.close();
    }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
