import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';

/**
 * Represents the payload for post request
 * @interface 
 */

interface payload {
  contact: {
    /**
     * @type {string}
     */
    user_name: string,
    /**
     * @type {string}
     */
    mobile_no: number,
    /**
     * @type {string}
     */
    password: string,
    /**
     * @type {string}
     */
    email: string,
    /**
     * @type {string}
     */
    src: null | string
  },
  /**
   * Array of the accound_ids
   * @type {Array<number>}
   */
  account_ids: Array<number>,
  /**
   * Array of the transaction_ids
   *  @type {Array<number>}
   */
  /**
   * @type {boolean}
   */
  transaction_ids: Array<number>,
  policy: boolean
}


/**
 * @class 
 * @implements {OnInit}
 */

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})


export class SignUpComponent implements OnInit {

  /**
   * @instance 
   * @property {FormControl} name 
   * @property {FormControl} email 
   * @property {FormControl} password 
   * @property {FormControl} mobno 
   * @property {FormControl} policy 
  */
  public form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    mobno: new FormControl(null, [Validators.required, Validators.pattern("[0-9]{10}")]),
    policy: new FormControl(true, [Validators.required])
  })

  /**
   * @type {boolean}
   */
  public is_invalid: boolean = true


  /**
   * @constructor
   * @param {ApiService} api - provide methods for intracting with the backend api
   * @param {Router} route - Redirect to some other pages
   * @param {SnackbarService} snack - Show the sucesss/warn messages
   */
  constructor(private api: ApiService, private route: Router, private snack: SnackbarService) { }

  /**
   * @method ngOninit
   * @returns {void}
   */
  ngOnInit(): void {
  }

  /**
   * @method ngDoCheck
   * @returns {void0}
   */

  ngDoCheck() {
    this.is_invalid = true
    if (this.form.valid == true && this.form.controls['policy'].value == true) {
      this.is_invalid = false
    }
  }

  /**
   * @method sign_up
   * @returns {void}
   */
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
      } else {
        this.route.navigateByUrl("/verify/login")
      }
      // if (Object.keys(res).length > 0) {
      //   this.route.navigateByUrl("/verify/login")
      // }
    })
  }
}
