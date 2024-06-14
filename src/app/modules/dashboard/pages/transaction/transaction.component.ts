import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataShareService } from 'src/app/shared/services/data.service';
import { DateTime } from "luxon"
// import { DowloadTransComponent } from 'src/app/shared/popups/dowload-trans/dowload-trans.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  constructor(private db: DataShareService, private api: ApiService,) { }
  transaction_history: any[] = []
  accounts: any[] = [];
  account_balance: number = 0;
  go_btn: boolean = true;
  bank_name: any;
  email: any;
  cardholder_name: any;
  account_no: any;
  form = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl(),
    account: new FormControl()
  })

  ngOnInit(): void {
    this.db.linked_bank_accounts().then(res => {
      this.accounts = res
      if (this.accounts.length > 0) {
        this.form.controls['account'].patchValue(this.accounts[0].id)
        this.account_info()
      }
    })




    this.db.get_user_info().then((res: any) => {
      let { transactions_info, contact } = res;
      this.email = contact.email
    })

  }

  openDowloadWindow() {
    let styles = `
      body{
       padding:4px
      }
    `
    setTimeout(() => {
      var printContents = document.getElementById("reportContent")!.innerHTML;
      let popupWin: any = window.open(
        "Angular Large Table to pdf",
        "_blank",
        "width=768,height=auto"
      )
      popupWin.document.write(
        `
        <html onload="window.print()">
          <head>
             <title>Expenses tracker</title>
          </head>
          <style>
            ${styles}
          </style>
          <body onload="window.print()">
             ${printContents}
          </body>
        </html>
        `
      );
      popupWin.document.close();
    }, 100);
  }

  public account_info() {
    let bank_id: number = this.form.controls['account'].value
    this.api.get_account_by_bankid(bank_id).subscribe((res: any) => {
      this.account_balance = res[0].balance
      this.cardholder_name = res[0].cardholder_name
      this.account_no = res[0].account_no
    })
    let bank_name = this.accounts.filter(item => item.id == bank_id)
    if (bank_name.length > 0) {
      this.bank_name = bank_name[0].name
    }
  }


  selected_account(ev: any) {
    this.account_info()
  }

  selectType(e: any) {
    this.transaction_history = []
  }


  go() {
    let start_dt = DateTime.fromJSDate(this.form.controls['start_date'].value._d).toFormat("yyyy-MM-dd")
    let end_dt = DateTime.fromJSDate(this.form.controls['end_date'].value._d).toFormat("yyyy-MM-dd")
    let bank_id: number = this.form.controls['account'].value
    this.db.get_transaction_history(bank_id, start_dt, end_dt).then(res => {

      this.transaction_history = res.map((item: any) => {
        return {
          ...item,
          date: new Date(item.datetime).toISOString().slice(0, 10)
        }
      })
      this.transaction_history = this.transaction_history
    })
  }

  order_data() {
    this.transaction_history = this.transaction_history.reverse()
  }


  ngDoCheck() {
    let start_dt = DateTime.fromJSDate(this.form.controls['start_date'].value?._d).toFormat("yyyy-MM-dd");
    let end_dt = DateTime.fromJSDate(this.form.controls['end_date'].value?._d).toFormat("yyyy-MM-dd");
    this.go_btn = true
    if (start_dt <= end_dt && (start_dt != "Invalid DateTime" && end_dt != "Invalid DateTime")) {
      this.go_btn = false
    }
  }

}
