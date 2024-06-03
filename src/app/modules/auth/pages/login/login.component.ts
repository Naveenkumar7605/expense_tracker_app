import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private route: Router, private api: ApiService,private snack:SnackbarService) { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  })

  login() {
     this.api.login(this.form.controls['email'].value, this.form.controls['password'].value).then((res: any) => {
      if (res.status == 200) {
        sessionStorage.setItem("user_id",res.data.id)
        this.snack.sucess("Login successful. Redirecting...")
        setTimeout(() => {
          this.route.navigateByUrl("/dashboard")
        },1000);
      }else {
        this.snack.warn("Invalid email or password. Please try again.")
      }
    })
  }

  is_invalid: boolean = true


  ngDoCheck() {
    this.is_invalid = true
    if (this.form.valid == true) {
      this.is_invalid = false
    }
  }

}
