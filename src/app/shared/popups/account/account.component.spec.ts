import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataShareService } from '../../services/data.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let spyDialogRef: MatDialogRef<any>;
  let spyMatDialogData: typeof MAT_DIALOG_DATA;
  let spyDS: jasmine.SpyObj<DataShareService>;
  beforeEach(async () => {
    spyDialogRef = jasmine.createSpyObj(['close'])
    spyDS = jasmine.createSpyObj(['unlinked_bank_accounts'])
    await TestBed.configureTestingModule({
      declarations: [AccountComponent],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: "new"
          }
        },
        {
          provide: MatDialogRef,
          useValue: spyDialogRef
        },
        {
          provide: DataShareService,
          useValue: spyDS
        }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    spyMatDialogData = TestBed.inject(MAT_DIALOG_DATA)
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("The cancel button should be visible if the user is new to opening the account.", async () => {
    let banks = [
      {
        "id": 1,
        "name": "HDFC",
        "img": "../../../../../assets/banks/hdfc.png"
      },
      {
        "id": 2,
        "name": "State Bank of India (SBI)",
        "img": "../../../../../assets/banks/sbi.png"
      }
    ]
    spyDS.unlinked_bank_accounts.and.returnValue(new Promise(res => { res(banks) }))
    await fixture.detectChanges()
    let mat_select =
      await fixture.detectChanges()
    expect(component.cancel_btn).toBeFalse()
    expect((fixture.debugElement.query(By.css("mat-select")).nativeElement as HTMLElement).children.length).toEqual(component.banks.length)
  })

  describe("disable/enable the save button",()=>{
    it("should disable the save button if the form is invalid",()=>{
         component.ngDoCheck()
         expect(component.save_btn).toBeTrue()

    })

    it("should enable the save button if the form is valid",()=>{
      let {controls} = component.form
      controls['account_no'].patchValue("96483939393")
      controls['cardholder_name'].patchValue("naveen")
      controls['bank'].patchValue("1")
      component.ngDoCheck()
      expect(component.save_btn).toBeFalse()
    })
  })

  describe("dialog close",()=>{
    it("should dialog close method work if the close method call",()=>{
      component.close()
      expect(spyDialogRef.close).toHaveBeenCalled()
      expect(spyDialogRef.close).toHaveBeenCalledTimes(1)
    })
  
    it("should dialog close method work if the save method call",()=>{
      component.close()
      expect(spyDialogRef.close).toHaveBeenCalled()
      expect(spyDialogRef.close).toHaveBeenCalledTimes(1)
    })
  })
});
