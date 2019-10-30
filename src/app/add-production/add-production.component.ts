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
      {finalProductName:['',Validators.required],
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
    args['finalProductName'] = this.form.get('finalProductName').value;    
    args['details'] = this.form.get('details').value;

    let productNames=[];
    let qtyUsed=[];
    let qtyWaste=[];
    let productArray=<FormArray> this.form.get('products');
    for (let index = 0; index < productArray.length; index++) {
      const element =productArray.at(index);
      productNames.push(element.get('productName').value);
      qtyUsed.push(element.get('qtyUsed').value.toString());
      qtyWaste.push(element.get('qtyWaste').value.toString());      
    }

    args['productNames']=productNames;
    args['qtyUsed']=qtyUsed;
    args['qtyWaste']=qtyWaste;    

    this.commService.request("AddProduction", args).then((reply) => {

      if(reply.returnCode===0){
        this.dialogRef.close();
      }
    else{
      window.alert(reply.returnValues[0]);
      }});
  }

  close() {
    this.dialogRef.close();
  }
}
