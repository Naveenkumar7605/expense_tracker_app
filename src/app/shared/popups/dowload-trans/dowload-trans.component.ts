import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
// import * as jspdf from 'jspdf';
@Component({
  selector: 'app-dowload-trans',
  templateUrl: './dowload-trans.component.html',
  styleUrls: ['./dowload-trans.component.scss']
})
export class DowloadTransComponent implements OnInit {
  @ViewChild("reportContent") reportContent!: ElementRef
  constructor(@Inject(MAT_DIALOG_DATA) private date:any) { }

  ngOnInit(): void {
    console.log(this.date)
    // const doc = new jsPDF().
    // const content = this.reportContent.nativeElement;

    // doc.fromHTML(content.innerHTML, 15, 15, {
    //   'width': 190
    // });

    // doc.save('asdfghj' + '.pdf');
    // setTimeout(() => {
    //   const htmlToPrint =
    //     "" +
    //     '<style type="text/css">' +
    //     ".pageFooter {" +
    //     "    display: table-footer-group;" +
    //     "    counter-increment: page;" +
    //     "}" +
    //     ".pageFooter:after {" +
    //     '   content: "Page " counter(page)' +
    //     "}" +
    //     "</style>";
    //     console.log(document.getElementById("reportContent"))
    //   var printContents = document.getElementById("reportContent")!.innerHTML;
    //   let popupWin: any = window.open(
    //     "Angular Large Table to pdf",
    //     "_blank",
    //     "width=768,height=auto"
    //   )
    //   console.log(popupWin)

    //   popupWin.document.write(
    //     `
    //     <html>
    //       <head>
    //          <title>hello</title>
    //       </head>
    //       <body>
    //          ${printContents}
    //       </body>
    //     </html>
    //     `
    //   );
    //   popupWin.document.close();

    // }, 1000);
  }


}
