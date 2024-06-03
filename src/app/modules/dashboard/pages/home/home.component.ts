import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from 'src/app/shared/popups/account/account.component';
import { TransactionPopupComponent } from 'src/app/shared/popups/transaction-popup/transaction-popup.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { CustomeSpinnerService } from 'src/app/shared/services/custome-spinner.service';
import { DataShareService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog, 
    private api: ApiService, 
    private ds: DataShareService,
    private spinner:CustomeSpinnerService
  ) { }
  private user_id!: number;
  public total_balance: number = 0.0
  public account_info: any;
  public transfer_info: any;
  public records: any[] = []
  public readonly TMY: Array<{ name: string, id: number }> = [
    {
      name: "Today",
      id: 1
    },
    {
      name: "Month",
      id: 2
    },
    {
      name: "Year",
      id: 3
    }
  ]

  async ngOnInit(): Promise<void> {
    this.loadData()

  }

  private async loadData() {
    this.spinner.open()
    await this.ds.get_user_info().then((resp: any) => {
      this.spinner.close()
      this.account_info = resp;
      let { account_ids, accounts_info } = resp
      if (account_ids.length == 0) {
        this.openAddAccount()
      } else {
        console.log(accounts_info,accounts_info)
        let sum: number = 0
        accounts_info.map((a: any) => {
          sum += a.balance
        })
        this.total_balance = sum
      }
      this.recent_transaction_history(1)
    })
  }

  recent_transaction_history(slot: any) {
    let { transactions_info } = this.account_info;
    let transaction_datas = transactions_info.slice(0, 5)
    let now = new Date().toISOString();

    let today = () => {
      let today_transaction: any[] = [];
      let now_slice = now.slice(0, 10);
      for (let i = 0; i < transaction_datas.length; i++) {
        let time = new Date(transaction_datas[i].datetime).toISOString().slice(0,10)
        let trans_dt = new Date(transaction_datas[i].datetime).toISOString().slice(0, 10);
        if (now_slice == trans_dt) {
          today_transaction.push({ ...transaction_datas[i], date: time })
        }

      }
      return today_transaction
    }

    let month = () => {
      let month_transaction: any[] = []
      let month_slice = new Date().toISOString().slice(0, 7);
      for (let i = 0; i < transaction_datas.length; i++) {
        let trans_dt = new Date(transaction_datas[i].datetime).toISOString().slice(0, 7);
        let full_date = new Date(transaction_datas[i].datetime).toISOString().slice(0, 10);
        if (month_slice == trans_dt) {
          month_transaction.push({ ...transaction_datas[i], date: full_date })
        }
      }
      return month_transaction
    }

    let year = () => {
      let years: any[] = []
      let year_slice = new Date().toISOString().slice(0, 4);
      for (let i = 0; i < transaction_datas.length; i++) {
        let trans_dt = new Date(transaction_datas[i].datetime).toISOString().slice(0, 4);
        let full_date = new Date(transaction_datas[i].datetime).toISOString().slice(0, 10);
        if (year_slice == trans_dt) {
          years.push({ ...transaction_datas[i], date: full_date })
        }

      }
      return years
    }

    switch (slot) {
      case 1: {
        this.records = today()
      }; break;
      case 2: {
        this.records = month()
      }; break;
      case 3: {
        this.records = year()
      }
    }
  }


  openTransaction() {
    const dialof = this.dialog.open(TransactionPopupComponent, {
      minWidth: "270px",
      minHeight: "400px",
      disableClose: true,
      data: {
        account_info: this.account_info
      }

    }).afterClosed().subscribe((res: any) => {
      this.loadData()
    })
  }

  openAddAccount() {
    const dialof = this.dialog.open(AccountComponent, {
      minWidth: "270px",
      minHeight: "400px",
      maxWidth: "500px",
      disableClose: true,
      data: {
        type: "new"
      }

    }).afterClosed().subscribe((res: any) => {
      if (res != false) {
        let payload: any = ({
          ...res
        })
        this.api.add_account(payload).subscribe((res: any) => {
          let { account_ids, contact, transaction_ids } = this.account_info;
          let { id } = <any>res;
          account_ids.push(id)
          this.api.update_user_info({
            contact,
            account_ids,
            transaction_ids
          }).subscribe(res => {
            this.loadData()
          })
        })
      }
    })
  }
}
