import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MaterialModule } from './material/material.module';
import { TransactionPopupComponent } from './popups/transaction-popup/transaction-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountComponent } from './popups/account/account.component';
import { ProfileComponent } from './popups/profile/profile.component';
// import { AddImageComponent } from './popups/add-image/add-image.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { AddProfileComponent } from './popups/add-profile/add-profile.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
// import {provideNativeDateAdapter} from '@angular/material/core';
// import { RedirectGuard } from './guard/redirect.guard';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DowloadTransComponent } from './popups/dowload-trans/dowload-trans.component';

@NgModule({
  declarations: [
    TransactionPopupComponent,
    AccountComponent,
    ProfileComponent,
    AddProfileComponent,
    SnackbarComponent,
    SpinnerComponent,
    DowloadTransComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMomentDateModule
  ],
  providers:[
//     provideNativeDateAdapter()
  ],
  exports:[MaterialModule]
})
export class SharedModule { }
