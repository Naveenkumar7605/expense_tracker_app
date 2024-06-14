import { TestBed } from '@angular/core/testing';
import { CustomeSpinnerService } from './custome-spinner.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

class MockDialog {
  open(component: Component, data: any) {
    return {
      afterClosed: () => {
        return of(data.ds)
      },
      updateSize(width:any){
         return
      }
    }
  }
}

describe('CustomeSpinnerService', () => {
  let service: CustomeSpinnerService;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialog,
          useClass: MockDialog
        },
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
    });
    spyDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>
    service = TestBed.inject(CustomeSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should open the dialog popup when open method",()=>{
    service.open()
    expect(spyDialog.open).toBeDefined()
  })
});
