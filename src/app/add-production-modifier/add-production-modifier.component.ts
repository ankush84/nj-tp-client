import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { CommService } from '../comm/comm.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductQty } from '../add-production-custom-field/add-production-custom-field.component';

@Component({
  selector: 'app-add-production-modifier',
  templateUrl: './add-production-modifier.component.html',
  styleUrls: ['./add-production-modifier.component.less']
})
export class AddProductionModifierComponent implements OnInit {

    public form: FormGroup; // our form model
  
    constructor(private commService: CommService,
      private dialogRef: MatDialogRef<AddProductionModifierComponent>,
      private _fb: FormBuilder   ,
      @Inject(MAT_DIALOG_DATA) private data: any ) {
        
    
    }

    ngOnInit() {
      this.form = this._fb.group( 
        {finalProductName:['',Validators.required],
        details:[''],
        _675:[''],
        _684:[''],
        _685:[''],
        _687:[''],
        _oil:[''],
        _calcium:[''],
        products: this._fb.array([this.initProducts()]),
      });
    
      if(this.data){
        this.form.get('finalProductName').setValue(this.data);
      }
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
      args['finalProductName'] = this.form.get('finalProductName').value;    
      args['details'] = this.form.get('details').value;
      this.productQtyArry.splice(0,this.productQtyArry.length);
  
      
      this.checkAndAdd('_675',"675");
      this.checkAndAdd('_684',"684");
      this.checkAndAdd('_685',"685");
      this.checkAndAdd('_687',"687");
      this.checkAndAdd('_oil', "Oil");
      this.checkAndAdd('_calcium', "Calcium");
      
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
  if(reply.returnCode===0){
        this.dialogRef.close();
      }
    else{
      window.alert(reply.returnValues[0]);
      }});
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
  
