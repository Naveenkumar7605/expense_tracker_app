import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  @ViewChild("carasoul") carasoul!: ElementRef;
  constructor(private render:Renderer2,private route:Router) { }
   count = 0

  data =[
    {
      img:"../../../assets/Group 225.png",
      head:"Gain total control of your money",
      content:"Become your own money manager and make every cent count"
    },
    {
      img:"",
      head:"Know where your money goes",
      content:"Track your transaction easily, with categories and financial report "
    },
    {
      img:"../../../assets/Ilustration.png",
      head:"Planning ahead",
      content:"Setup your budget for each category so you in control"
    }
  ]
  ngOnInit(): void {

  }

  ngAfterContentInit(){
    setTimeout(()=>{
      let ele = this.carasoul.nativeElement.firstChild;
      setInterval(() => {
        let data = this.count*250;
        let trans = `-${data}px 0px 0px`;
        this.render.setStyle(ele,"translate",trans)
        this.render.setStyle(ele,"transition","0.8s")
        if(this.count == 2){
          this.count =0
        }
        else{
          this.count++
        }
      },2000);

    },300)
  }

  sign_up(){
    this.route.navigateByUrl("/verify/signup")
  }

  login(){
    this.route.navigateByUrl("/verify/login")
  }
}
