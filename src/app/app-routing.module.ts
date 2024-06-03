import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectGuard } from './shared/guard/redirect.guard';

const routes: Routes = [
  {
    path:"",redirectTo:"dashboard",pathMatch:"full"
  },
  {
    path:"verify" ,loadChildren:()=>import("./modules/auth/auth.module").then(m=>m.AuthModule),
  },
  {
    path:"dashboard" ,loadChildren:()=>import("./modules/dashboard/dashboard.module").then(m=>m.DashboardModule),canActivate:[RedirectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
