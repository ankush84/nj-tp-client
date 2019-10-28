import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { CommService } from '../comm/comm.service';
import { MatDialogRef } from '@angular/material';
import { ProductQty } from '../add-production-custom-field/add-production-custom-field.component';

@Component({
  selector: 'app-add-production-tpr',
  templateUrl: './add-production-tpr.component.html',
  styleUrls: ['./add-production-tpr.component.less']
})
export class AddProductionTprComponent implements OnInit {

  public form: FormGroup; // our form model

  

  constructor(private commService: CommService,
    private dialogRef: MatDialogRef<AddProductionTprComponent>,
    private _fb: FormBuilder  ) { }

  ngOnInit() {
    this.form = this._fb.group( 
      {lotNumber:['',Validators.required],
      details:[''],
      _dry401:[''],
      _602:[''],
      _675:[''],
      _684:[''],
      _685:[''],
      _687:[''],
      _kr99:[''],
      _denka:[''],
      _cn08:[''],
      _kresinSecond:[''],
      _crystalFirst:[''],
      _crystalSecond:[''],
      _oil:[''],
      _calcium:[''],
      _colour:[''],
      products: this._fb.array([this.initProducts()]),
    });
  }

  initProducts() {
   
    return this._fb.group({
        productName: [''],
        qtyUsed: [''],
        qtyWaste: ['']
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
private productQtyArry:{name:string,qtyUsed:number,qtyWaste:number}[]=[];

  save() {

    let args = {};
    args['lotNumber'] = this.form.get('lotNumber').value;    
    args['details'] = this.form.get('details').value;
    this.productQtyArry.splice(0,this.productQtyArry.length);

    
    this.checkAndAdd('_dry401',"Dry 401");
    this.checkAndAdd('_602',"602");
    this.checkAndAdd('_675',"675");
    this.checkAndAdd('_684',"684");
    this.checkAndAdd('_685',"685");
    this.checkAndAdd('_687',"687");
    this.checkAndAdd('_kr99',"K. Resin 99");
    this.checkAndAdd('_denka',"Denka");
    this.checkAndAdd('_cn08', "CN 08");
    this.checkAndAdd('_kresinSecond',"K Resin Second");
    this.checkAndAdd('_crystalFirst', "Crystal First");
    this.checkAndAdd('_crystalSecond', "Crystal Second");
    this.checkAndAdd('_oil', "Oil");
    this.checkAndAdd('_calcium', "Calcium");
    this.checkAndAdd('_colour', "Colour");
    
    let productNames=[];
    let qtyUsed=[];
    let qtyWaste=[];

    for (let index = 0; index < this.productQtyArry.length; index++) {
      const element =this.productQtyArry[index];
      productNames.push(element.name);
      qtyUsed.push(element.qtyUsed.toString());
      qtyWaste.push(element.qtyWaste.toString());      
    }


    let productArray=<FormArray> this.form.get('products');
    for (let index = 0; index < productArray.length; index++) {
      const element =productArray.at(index);
      if(element.get('productName').value
      && element.get('qtyUsed').value
      && element.get('qtyWaste').value){
      productNames.push(element.get('productName').value);
      qtyUsed.push(element.get('qtyUsed').value.toString());
      qtyWaste.push(element.get('qtyWaste').value.toString());      
    }
  }

    args['productNames']=productNames;
    args['qtyUsed']=qtyUsed;
    args['qtyWaste']=qtyWaste;    

    this.commService.request("AddProduction", args).then((reply) => {

      this.dialogRef.close();
    }
   );
  }
  checkAndAdd(formProp: string, productName: string) {
    var  val= <ProductQty>this.form.get(formProp).value;
    if(!val || !val.qtyUsed || val.qtyUsed<0.0001 || !val.qtyWaste || val.qtyWaste < 0.0001) return;
        
    this.productQtyArry.push({name:productName,qtyUsed:val.qtyUsed, qtyWaste:val.qtyWaste});
    
  }

  close() {
    this.dialogRef.close();
  }
}
