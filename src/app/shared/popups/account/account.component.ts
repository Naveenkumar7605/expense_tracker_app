import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { DataShareService } from '../../services/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {


  public banks:any[]=[];
  constructor(
    private dialogRef: MatDialogRef<AccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api:ApiService,
    private DS:DataShareService
  ) { }




  form = new FormGroup({
    account_no:new FormControl(null,[Validators.required,Validators.pattern("[0-9]*"),Validators.minLength(8),Validators.maxLength(12)]),
    cardholder_name:new FormControl(null,[Validators.required]),
    bank:new FormControl(null,[Validators.required]),
  })


  cancel_btn: boolean = true;
  save_btn:boolean = true
  ngOnInit(): void {
  
    if (this.data.type == "new") {
      this.cancel_btn = false
    }

    this.DS.unlinked_bank_accounts().then(res=>{
      this.banks =res
    })
  }


  ngDoCheck(){
    this.save_btn = true
    if(this.form.valid == true){
      this.save_btn = false
    }
  }
  close() {
    this.dialogRef.close(false)
  }

  save() {
    this.dialogRef.close({...this.form.value,balance:0})
    // this.dialogRef.close({...this.form.value,is_active:this.data.type=='new'?true:false,balance:0})
  }
}
