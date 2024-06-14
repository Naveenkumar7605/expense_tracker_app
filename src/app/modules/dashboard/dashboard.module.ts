import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { ChartComponent } from './pages/chart/chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const route:Routes = [
  {
    path:"",component:DashboardComponent,
    children:[
      {
        path:"",redirectTo:"home",pathMatch:"full"
      },
      {
        path:"home",component:HomeComponent
      },
      {
        path:"transaction",component:TransactionComponent
      },
      {
        path:"chart",component:ChartComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    TransactionComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route ),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class DashboardModule { }
