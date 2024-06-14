import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  content:any;
  color:any;
  bg:any;
  ngOnInit(): void {
    let {type,message,bg,color} = this.data
    this.content = message
    this.bg = bg
    this.color = color
  }

}
