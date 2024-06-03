import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileComponent } from 'src/app/shared/popups/profile/profile.component';
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user_details: any;
  active_account: any;
  balance: any;
  account_info: any;
  user_name: any;
  img_src: string = "../../../../../assets/pngwing.com.png"
  constructor(private dialog: MatDialog, private api: ApiService, private route: Router, private activeRoute: ActivatedRoute) { }

  private media_query() {
    let matches = () => {
      this.side_nav = false
      if (matchMedia("(max-width:400px)").matches) {
        this.side_nav = true
      }
    }

    window.onresize = (e => {
      matches()
    })
    matches()

  }

  ngOnInit(): void {
    this.api.get_user_detail_by_id().subscribe((res: any) => {
      let blob_img = res[0].contact.src;
      if (blob_img != null) {
        this.img_src = blob_img.blobData
      }
    })

//   this.openProfile()
    this.user_name = sessionStorage.getItem("user_name")
//     this.media_query()

    this.activeUrl()
  }

  side_nav: boolean = false

  show() {
    this.side_nav = true
  }

  hide() {
    this.side_nav = false
  }
  menus = [
    {
      path: "transaction",
      icon_name: "attach_money",
      is_active: false,
      name:"history"

    },
    {
      path: "chart",
      icon_name: "bar_chart",
      is_active: false,
      name:"chart"
    }
  ]

  logout() {
    sessionStorage.clear()
    this.route.navigateByUrl("/verify/login")

  }

  openProfile() {
    const dialof = this.dialog.open(ProfileComponent, {
      minWidth: "300px",
      minHeight: "400px",
      width: "700px",
      maxHeight: "500px",
      disableClose: true,

    }).afterClosed().subscribe((res: any) => {
    })
  }

  activeUrl() {
    let active_url: string = document.URL;
    active_url = active_url.substring(active_url.lastIndexOf("/")).replace("/", '').trim();
    this.menus.map((item: any) => {
      Object.defineProperty(item, "is_active", { value: false, enumerable: false })
      if (item.path == active_url) {
        Object.defineProperty(item, "is_active", { value: true, enumerable: true })
      }
      return item
    })
  }

  url_change() {
    this.activeUrl()
  }
}
