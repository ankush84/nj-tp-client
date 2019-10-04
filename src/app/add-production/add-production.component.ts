import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { CommService } from '../comm/comm.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-production',
  templateUrl: './add-production.component.html',
  styleUrls: ['./add-production.component.less']
})
export class AddProductionComponent implements OnInit {

  public form: FormGroup; // our form model

  

  constructor(private commService: CommService,
    private dialogRef: MatDialogRef<AddProductionComponent>,
    private _fb: FormBuilder  ) { }

  ngOnInit() {
    this.form = this._fb.group( 
      {lotNumber:['',Validators.required],
      details:[''],
      products: this._fb.array([this.initProducts()]),
    });
  }

  initProducts() {
    // initialize our address
    return this._fb.group({
        productName: ['', Validators.required],
        qtyUsed: ['', Validators.required],
        qtyWaste: ['', Validators.required]
    });
}

addProduct() {
// add address to the list
const control = <FormArray>this.form.controls['products'];
control.push(this.initProducts());
}

removeProduct(i: number) {
// remove address from the list
const control = <FormArray>this.form.controls['products'];
control.removeAt(i);
}

  save() {

    let args = {};
    // args['billingId'] = this.form.get('billingId').value;
    // args['productName'] = this.form.get('productName').value;
    // args['qty'] = this.form.get('qty').value;
    // args['price'] = this.form.get('price').value;
    // args['details'] = this.form.get('details').value;

    this.dialogRef.close();

    // this.commService.request("AddProduction", args).then((reply) => {

    //   this.dialogRef.close();
    // }
   // );
  }

  close() {
    this.dialogRef.close();
  }
}
