
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @interface
 * @type {string}  - img 
 * @type {string} - head
 * @type {string} - content
 */

interface dataTypes {
  img: string,
  head: string,
  content: string
}

/**
 * 
 * @class
 * @implements {OnInit}
 */

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  /**
   * Count for change the carasoul item visibilty
   * @type {number} - count
   */
  @ViewChild("carasoul") carasoul!: ElementRef;

  /**
   * Reference to  the carasoul element
   * @type {ElementRef} - carasoul 
   */
  public count = 0

  /**
   * Data for the carasoul item
   * @type {Array<dataTypes>} - data
   */
  public data: Array<dataTypes> = [
    {
      img: "../../../assets/Group 225.png",
      head: "Gain total control of your money",
      content: "Become your own money manager and make every cent count"
    },
    {
      img: "",
      head: "Know where your money goes",
      content: "Track your transaction easily, with categories and financial report "
    },
    {
      img: "../../../assets/Ilustration.png",
      head: "Planning ahead",
      content: "Setup your budget for each category so you in control"
    }
  ]

  /**
   * @constructor 
   * @param {Renderer2} render - Return the methods for Dom manipute
   * @param {Router} route - To navigate to another Page
   */

  constructor(private render: Renderer2, private route: Router) { }


  /**
   * @method ngOnInit
   * @description -  It's first load when the component Mount
   * @returns {void}
   */
  ngOnInit(): void {

  }

  /**
   * @method ngAfterContentInit
   * @description - Called after ngOninit . 
   * @returns {void}
   */

  ngAfterContentInit() {
    setTimeout(() => {
      let ele = this.carasoul.nativeElement.firstChild;
      setInterval(() => {
        let data = this.count * 250;
        let trans = `-${data}px 0px 0px`;
        this.render.setStyle(ele, "translate", trans)
        this.render.setStyle(ele, "transition", "0.8s")
        if (this.count == 2) {
          this.count = 0
        }
        else {
          this.count++
        }
      }, 2000);

    }, 300)
  }

  /**
   * @method sign_up
   * @description -  Redirect to sign up page
   * @see {@link /verify/signup}
   */

  sign_up() {
    this.route.navigateByUrl("/verify/signup")
  }

  /**
   * @method login()
   * @description  Redirect to login up page
   * @see {@link /verify/signup}
   * @return {void}
   */

  login() {
    this.route.navigateByUrl("/verify/login")
  }
}
