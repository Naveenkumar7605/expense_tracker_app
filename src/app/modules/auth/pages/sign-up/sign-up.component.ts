import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

interface payload {
  contact: {
    user_name: string,
    mobile_no: number,
    password: string,
    email: string,
    src: null | string
  },
  account_ids: Array<number>,
  transaction_ids: Array<number>,
  policy: boolean
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  constructor(private api: ApiService, private route: Router, private snack: SnackbarService) { }


  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    mobno: new FormControl(null, [Validators.required, Validators.pattern("[0-9]{10}")]),
    policy: new FormControl(true, [Validators.required])
  })

  is_invalid: boolean = true



  ngOnInit(): void {
  }

  ngDoCheck() {
    this.is_invalid = true
    if (this.form.valid == true && this.form.controls['policy'].value == true) {
      this.is_invalid = false
    }
  }
  sign_up() {
    let payload: payload = {
      contact: {
        user_name: this.form.controls['name'].value,
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value,
        mobile_no: this.form.controls['mobno'].value,
        src: null
      },
      account_ids: [],
      transaction_ids: [],
      policy: this.form.controls['policy'].value
    }
    this.api.signup(payload).then((res: any) => {

      if (res.status == 400) {
        this.snack.warn("This email address is already taken")
        return
      }
      if (Object.keys(res).length > 0) {
        this.route.navigateByUrl("/verify/login")
      }
    })
  }
}
