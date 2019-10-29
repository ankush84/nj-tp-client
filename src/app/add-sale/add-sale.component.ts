import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { CommService } from '../comm/comm.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductQty } from '../add-production-custom-field/add-production-custom-field.component';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.less']
})
export class AddSaleComponent implements OnInit {

    public form: FormGroup; // our form model
  
    constructor(private commService: CommService,
      private dialogRef: MatDialogRef<AddSaleComponent>,
      private _fb: FormBuilder   ,
      @Inject(MAT_DIALOG_DATA) private data: any ) {
        
    
    }

    ngOnInit() {
      this.form = this._fb.group( 
        {party:['',Validators.required],
        billNo:[''],
        details:[''],
        product:[''],
        qtyUsed:[''],
      });
    
      if(this.data){
        this.form.get('product').setValue(this.data);
      }
    }
  
  
  private productQtyArry:{name:string,qtyUsed:number,qtyWaste:number}[]=[];
  
    save() {
  
      let args = {};
      args['party'] = this.form.get('party').value;    
      args['productName'] = this.form.get('product').value;    
      args['qtyUsed'] = this.form.get('qtyUsed').value;    
      args['billNo'] = this.form.get('billNo').value;    
      args['details'] = this.form.get('details').value;
      
      this.commService.request("AddSale", args).then((reply) => {
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
  
