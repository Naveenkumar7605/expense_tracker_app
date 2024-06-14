import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountComponent } from '../account/account.component';
import { DataShareService } from '../../services/data.service';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { CustomeSpinnerService } from '../../services/spinner/custome-spinner.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
// import { CustomeSpinnerService } from '../../services/custome-spinner.service';
// import { AddImageComponent } from '../add-image/add-image.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private api: ApiService, 
    private dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog: MatDialog,
    private DS: DataShareService, 
    private spinner: CustomeSpinnerService,
    private snack:SnackbarService
  ) { }

  bank_accounts: any[] = []
  account_info: any;
  account_number: any = "000 000 000";
  income_amout: number = 0;
  expense_amout: number = 0;
  balance: number = 0;
  user_id: any;
  user_name: any;
  is_disabled: boolean = true;
  active_bank_name: any;
  active_bank_img: any = null;
  cardholder_name: any;
  save_btn: boolean = true
  default_img: string = "../../../../assets/pngwing.com.png"

  form = new FormGroup({
    name: new FormControl({ value: null, disabled: true }, [Validators.required]),
    email: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.pattern("^[a-z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    mobno: new FormControl({ value: null, disabled: true }, [Validators.required]),
  })

  ngOnInit(): void {
    this.loadData()
    this.loadListBank()
    //     this.addPhoto()
  }

  loadListBank() {
    this.DS.linked_bank_accounts().then(res => {
      this.bank_accounts = res
    })
    this.expense_amout = 0
    this.income_amout = 0
    this.balance = this.expense_amout + this.income_amout
    this.account_number = "000 000 000"

  }
  loadData() {
    this.spinner.open()
    this.user_id = Number(sessionStorage.getItem("user_id"))
    this.api.get_user_detail_by_id().subscribe((res: any) => {
    if(res.length>0){
      let { user_name, email, mobile_no, src } = res[0]?.contact
      this.account_info = res[0]
      sessionStorage.setItem("user_name",user_name)
      this.form.controls['name'].patchValue(user_name)
      this.form.controls['email'].patchValue(email)
      this.form.controls['mobno'].patchValue(mobile_no)
      this.spinner.close()
      if (src != null) {
        this.default_img = src.blobData
      } else {
        this.default_img = "../../../../assets/pngwing.com.png"
      }
    }
    })
  }

  edit_content() {
    this.form.enable()
  }

  addPhoto() {
    const dialof = this.dialog.open(AddProfileComponent, {
      minWidth: "300px",
      minHeight: "400px",
      maxHeight: "600px",
      disableClose: true,

    }).afterClosed().subscribe((res: any) => {
      this.loadData()
    })
  }

  save() {
    let { contact } = this.account_info
    let payload = {
      ...this.account_info,
      contact: {
        ...contact,
        user_name: this.form.controls['name'].value,
        email: this.form.controls['email'].value,
        mobile_no: this.form.controls['mobno'].value
      }

    }

    this.api.update_user_contact_info(payload).then((res => {
      if(res.status == 200){
        setTimeout(() => {
          this.loadData()
          this.form.disable()
  
        },200);
      }
      if(res.status ==400){
        this.snack.warn("This email address is already taken")
      }
    }))
  }

  expense(info: any) {
    this.active_bank_name = info.name
    this.DS.get_user_info().then(res => {
      let { transactions_info, accounts_info } = res
      let data = transactions_info.filter((item: any) => item.bank_id == info.id);
      let account = accounts_info.filter((item: any) => item.bank == info.id)
      this.account_number = account[0].account_no
      this.cardholder_name = account[0].cardholder_name
      data.map((item: any) => {
        if (item.flag == 0) {
          exp_count += Number(item.amount)
        }
        if (item.flag == 1) {
          income_count += Number(item.amount)
        }
      })
      this.expense_amout = exp_count
      this.income_amout = income_count
      this.balance = this.expense_amout + this.income_amout
    })
    let exp_count: number = 0;
    let income_count: number = 0;

  }

  close() {
    this.dialogRef.close()
  }

  addCard() {
    const dialof = this.dialog.open(AccountComponent, {
      minWidth: "270px",
      minHeight: "400px",
      maxWidth: "500px",
      disableClose: true,
      data: {
        type: "exist"
      }

    }).afterClosed().subscribe((res: any) => {
      if (res != false) {
        let payload: any = ({
          ...res
        })
        this.api.add_account(payload).subscribe((res: any) => {
          let { account_ids } = this.account_info;
          let { id } = <any>res;
          // let data = account_ids;
          // data.push(id)
          account_ids = account_ids.push(id)
          this.api.update_user_info(this.account_info).subscribe(res => {
            this.loadData()
            this.loadListBank()
          })
        })
      }
    })

  }

  ngDoCheck() {
    this.save_btn = true;
    if (this.form.valid) {
      this.save_btn = false
    }
  }
}
