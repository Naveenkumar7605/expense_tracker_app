import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button"
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatSelectModule} from "@angular/material/select"
import {MatSlideToggleModule} from "@angular/material/slide-toggle"
import {MatCheckboxModule} from  "@angular/material/checkbox"
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from "@angular/material-moment-adapter"
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
// import { MatDatetimepickerModule } from '@mat-datetimepicker/core';

const material = [
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatProgressSpinnerModule
//   MatMomentDatetimeModule,
//   MatDatetimepickerModule

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
    ...material
  ],
  exports:[
    CanvasJSAngularChartsModule,
    ...material
  ]
})
export class MaterialModule { }
