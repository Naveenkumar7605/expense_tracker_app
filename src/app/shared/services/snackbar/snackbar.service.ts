import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }
  

  ngOnInit(){
  }
  
 

  sucess(msg:any){
    this._snackBar.openFromComponent(SnackbarComponent,{
      duration: 1*700,
      verticalPosition:"top",
      data:{
        message:msg,
        bg:"#317aff",
        color:"white",
        type:0
      }
    })
  }

  warn(msg:any){
    this._snackBar.openFromComponent(SnackbarComponent,{
      duration: 1*1000,
      verticalPosition:"top",
      data:{
        message:msg,
        bg:"#ff00008f",
        color:"white",
        type:0
      }
    })
  }

  
}
