import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';

/**
 * @class
 * @implements {OnInit}
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * @constructor
   * @param {Router} route 
   * @param {ApiService} api 
   * @param {SnackbarService} snack 
   */
  constructor(private route: Router, private api: ApiService, private snack: SnackbarService) { }
  /**
   * @instance
   * @property {FormGroup}
   * @property {FormControl} name 
   * @property {FormControl} email 
   * @property {FormControl} password 
   * @property {FormControl} mobno 
   * @property {FormControl} policy 
  */
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl(null, [Validators.required]),
  })
  /**
   * @type {boolean}
   */

  public is_invalid: boolean = true

  /**
   * @method ngOnInit
   * @description -  It's first load when the component Mount
   * @returns {void}
   */

  ngOnInit(): void {
  }


  /**
  * @method sign_up
  * @description -  Redirect to sign up page
  * @see {@link /dashboard}
  */

  login() {
    this.api.login(this.form.controls['email'].value, this.form.controls['password'].value).then((res: any) => {
      if (res.status == 200) {
        sessionStorage.setItem("user_id", res.data.id)
        this.snack.sucess("Login successful. Redirecting...")
        setTimeout(() => {
          this.route.navigateByUrl("/dashboard")
        }, 1000);
      } else {
        this.snack.warn("Invalid email or password. Please try again.")
      }
    })
  }


  /**
   * @method ngDoCheck
   * @returns {void}
   */
  ngDoCheck() {
    this.is_invalid = true
    if (this.form.valid == true) {
      this.is_invalid = false
    }
  }

}
