import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes:Routes=[
  {
    path:"",redirectTo:"auth",pathMatch:"full"
  },
  {
    path:"auth",component:AuthComponent,
  },
  {
    path:"login",component:LoginComponent,
  },
  {
    path:"signup",component:SignUpComponent,
  }
]

@NgModule({
  declarations: [
    AuthComponent,
    SignUpComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
