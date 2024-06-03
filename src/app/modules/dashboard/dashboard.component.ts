import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionPopupComponent } from 'src/app/shared/popups/transaction-popup/transaction-popup.component';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

constructor(private api:ApiService){

}

  ngOnInit(): void {

  }


}
