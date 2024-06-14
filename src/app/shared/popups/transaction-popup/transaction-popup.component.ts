import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api/api.service';
import { DataSource } from '@angular/cdk/collections';
import { DataShareService } from '../../services/data.service';
import * as DateTime from 'luxon'
@Component({
  selector: 'app-transaction-popup',
  templateUrl: './transaction-popup.component.html',
  styleUrls: ['./transaction-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionPopupComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private DS: DataShareService
  ) { }

  public flag: number = 1
  public categories: any[] = [];
  public linked_bank_accounts: any[] = [];
  public balance_checker: boolean = true;
  public total_amount: number = 0;
  private bank_account_id: number = 1
  public disbled_submit_btn: boolean = true
  public default_bg: string = "green";
  color: ThemePalette = 'accent';

  currentDate = new Date();

  formatList = [
    'y/M/d',
    'y/MM/d',
    'dd-MM-yy',
    'MM/dd/yyyy',
    'dd-MM-yy',
    'MM-dd-yy',
    'MMM/dd/yy',
    'MMMM dd,yyyy',
    // etc...
  ];

  dateFormat = this.formatList[0];

  ngOnInit(): void {
    this.loadData()
  }


  loadData() {

    this.linked_bank_accounts = []
    this.api.get_all_categories_by_flagId(this.flag).subscribe((res: any) => {
      this.categories = res
    })
    this.DS.linked_bank_accounts().then((res: any) => {
      this.linked_bank_accounts = res
    })
  }


  changeTransaction(flag: number) {
    this.total_amount = 0
    this.categories = []

    this.form.controls['desc'].patchValue(null)
    this.form.controls['bank'].patchValue(null)
    this.form.controls['category'].patchValue(null)
    this.flag = flag
    this.loadData()
  }

  selectBank(ev: any) {
    let { accounts_info } = this.data.account_info
    this.bank_account_id = ev.value
    let data_bal = accounts_info.filter((item: any) => item.bank == ev.value);
    this.total_amount = data_bal[0]?.balance
    if (this.flag == 0) {
      this.balance_checker = false
      if (data_bal.length > 0 && this.form.controls['amount'].value < data_bal[0].balance) {
        this.balance_checker = true
      }
    }
  }

  form = new FormGroup({
    amount: new FormControl(0, [Validators.required, Validators.pattern("[0-9]*")]),
    category: new FormControl(null, [Validators.required]),
    desc: new FormControl(null,),
    bank: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
  })

  ngDoCheck() {
    this.disbled_submit_btn = true
    this.form.controls['amount'].valueChanges.subscribe(res => {
      this.selectBank({
        value: this.bank_account_id
      })
    })
    if (this.form.valid == true && this.balance_checker && this.form.controls['amount'].value > 0) {
      this.disbled_submit_btn = false
    }
  }

  close() {
    this.dialogRef.close(false)
  }

  submit() {
    let now = new Date()
    let { account_info } = this.data

    let payload: any = {
      // datetime: now,
      amount: this.form.controls['amount'].value,
      category: this.form.controls['category'].value,
      desc: this.form.controls['desc'].value,
      bank: this.form.controls['bank'].value,
      flag: this.flag,
      datetime: new Date(this.form.controls['date'].value)
    }

    this.api.add_transaction(payload).subscribe((res: any) => {
      let { transaction_ids, contact, account_ids, bank } = account_info;
      let { id } = <any>res;
      transaction_ids.push(id);
      this.api.get_account_by_bankid(this.bank_account_id).subscribe((res: any) => {
        let { balance } = <any>res[0]
        let account_id = res[0].id
        let plus_minus = this.flag == 1 ? balance + parseInt(this.form.controls['amount'].value) : balance - parseInt(this.form.controls['amount'].value)
        let account_payload = {
          ...res[0],
          balance: plus_minus

        }
        this.api.update_account_by_id(account_id, account_payload).subscribe(res => {
          let payload = {
            contact,
            account_ids,
            transaction_ids: transaction_ids
          }
          this.api.update_user_info(payload).subscribe(res => {
            this.dialogRef.close(true)
          })
        })
      })
    })
  }



}
