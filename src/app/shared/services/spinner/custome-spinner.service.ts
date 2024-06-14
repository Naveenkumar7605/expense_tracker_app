import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class CustomeSpinnerService {
  dialogRef!: MatDialogRef<SpinnerComponent>;
  constructor(private dialog: MatDialog) {}

  public open(
    title: string = 'Please wait',
    config: {width:string} = { width: '200px' }
  ): Observable<boolean> {
    this.dialogRef = this.dialog.open(SpinnerComponent, {
      panelClass: 'custom-modalbox',
      disableClose: true,
      backdropClass: 'light-backdrop',
    })
    this.dialogRef.updateSize(config.width);
    // this.dialogRef.componentInstance.title = title;
    return this.dialogRef.afterClosed();
  }

  public close() {
    if (this.dialogRef) this.dialogRef.close();
  }
}
