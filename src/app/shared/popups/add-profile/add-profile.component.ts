import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {

  @ViewChild("img") img!: ElementRef;
  @ViewChild("video") video!: ElementRef;


  default_img_src: string = "../../../../assets/Picture.png"
  account_info: any;
  img_src: any = null;
  open_type: 0 | 1 = 0;
  show_delete_btn: boolean = false;
  video_tracker: any[] = []

  constructor(private api: ApiService, private dialogRef: MatDialogRef<AddProfileComponent>) { }

  ngOnInit(): void {
    this.loadData()
  }


  loadData() {
    this.api.get_user_detail_by_id().subscribe((res: any) => {
      this.account_info = res
      let { contact } = res[0]
      if (contact?.src != null) {
        setTimeout(() => {
          this.placeImage(contact.src.blobData)
          this.img_src = {
            blobData: contact.src.blobData
          }
          this.show_delete_btn = true
        });
      } else {
        this.placeImage(this.default_img_src)
      }
    })
  }

  public placeImage = (source: any) => {
    if (typeof source == "string") {
      this.img.nativeElement.src = source
      return
    }
    //     let objectUrl = URL.createObjectURL(source)
    //     fetch(objectUrl).then(res => {
    //       this.img.nativeElement.src = objectUrl
    //     }).catch(() => {
    //       this.img.nativeElement.src = this.default_img_src
    //     })
  };


  trackImage(objectUrl: any) {
    this.open_type = 0

    const reader = new FileReader();
    reader.readAsDataURL(objectUrl);
    reader.onloadend = () => {
      this.placeImage(<any>reader.result?.toString())
      let data = {
        blobData: (<any>reader.result?.toString())
      };
      this.img_src = data
      //        this.updateProfile(data)
    }

  }

  save() {
    let { contact } = this.account_info[0]
    let payload = {
      ...this.account_info[0],
      contact: {
        ...contact,
        src: this.img_src
      }
    }
    this.api.update_user_info(payload).subscribe(res => {
      this.loadData()
      this.dialogRef.close()
    })
  }

  openFileManager(ev: any) {
    this.open_type = 0
    ev.target.files[0]
    let blob = new Blob([ev.target.files[0]], { type: ev.target.files[0].type })
    setTimeout(() => {
      this.trackImage(blob)
    },);
  }


  openCamera() {
    this.open_type = 1
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext('2d')
    canvas.height = 200;
    canvas.width = 200;
    this.open_type = 1
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(res => {
      let videoElement = this.video.nativeElement;
      videoElement.srcObject = res;
      this.video_tracker = res.getTracks()
      this.video.nativeElement.nextSibling.addEventListener('click', () => {
        this.open_type = 0
        ctx?.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(async (blob: Blob | any) => {
          res.getTracks().forEach(item => {
            item.stop()
            setTimeout(() => {
              this.trackImage(blob)
            });
          })
        })
      })

    })

  }



  deleteImage() {
    this.img_src = null
    this.placeImage(this.default_img_src)
    this.show_delete_btn = false

  }

  close() {
    if (this.video_tracker.length > 0) {
      this.video_tracker.forEach((item: any) => {
        item.stop()
        this.dialogRef.close()
      })
    } else {
      this.dialogRef.close()
    }


  }
  ngDestroy() {

  }

}
