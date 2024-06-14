import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { TransactionPopupComponent } from './transaction-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api/api.service';
import { DataShareService } from '../../services/data.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransactionPopupComponent', () => {
  let component: TransactionPopupComponent;
  let fixture: ComponentFixture<TransactionPopupComponent>;
  let spyDialogRef: MatDialogRef<any>;
  let spyMatDialogData: typeof MAT_DIALOG_DATA;
  let spyApi: jasmine.SpyObj<ApiService>;
  let spyDS: jasmine.SpyObj<DataShareService>;
  beforeEach(async () => {
    spyDialogRef = jasmine.createSpyObj(['close'])
    spyDS = jasmine.createSpyObj(['linked_bank_accounts'])
    spyApi = jasmine.createSpyObj("ApiService", ['get_all_categories_by_flagId', 'update_user_info','add_transaction','get_account_by_bankid','update_account_by_id'])
    await TestBed.configureTestingModule({
      declarations: [TransactionPopupComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: spyDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            account_info: {
              accounts_info: [],
              account_ids:[1],
              contact:{
                "user_name": "naveen kumar",
                "email": "naveen@gmail.com",
                "password": "1234",
                "mobile_no": "9784376584",
              },
              transaction_ids:[1]
            }
          }
        },
        {
          provide: ApiService,
          useValue: spyApi
        },
        {
          provide: DataShareService,
          useValue: spyDS
        },
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
    })
    fixture = TestBed.createComponent(TransactionPopupComponent);
    component = fixture.componentInstance;
    spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>
    spyDS = TestBed.inject(DataShareService) as jasmine.SpyObj<DataShareService>
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should load categories and banks data when `loadData()` is called", async () => {
    let category_res = [{ "id": 1, "name": "Housing", "type": 0 }, { "id": 2, "name": "Transportation", "type": 0 }]
    let banks_res = [{ "id": 1, "name": "HDFC", "img": "../../../../../assets/banks/hdfc.png" }, { "id": 2, "name": "State Bank of India (SBI)", "img": "../../../../../assets/banks/sbi.png" }]
    spyApi.get_all_categories_by_flagId.and.returnValue(of(category_res))
    spyDS.linked_bank_accounts.and.returnValue(new Promise(res => res(banks_res)))
    await component.loadData()
    expect(component.categories.length).toEqual(category_res.length)
    expect(component.linked_bank_accounts.length).toEqual(banks_res.length)
  })
  // it("call loadData() method", () => {
  // })

  it("should set form to invalid state when `changeTransaction()` is called",()=>{
    spyOn(component,'loadData')
    component.changeTransaction(0)
     expect(component.loadData).toHaveBeenCalled()
     expect(component.form.valid).not.toBeTrue()
  })


  it("should enable the submit button if the form is valid",()=>{
    component.balance_checker = true
    component.form.patchValue({
      amount:"100",
      category:1,
      desc:"salary",
      bank:1,
      date:"2022-11-12"
    })
    component.ngDoCheck()
    expect(component.disbled_submit_btn).toBeFalsy()
  })

  it("should call dialog.close() when close() method is called",()=>{
    component.close()
    expect(spyDialogRef.close).toHaveBeenCalled()
  })

  it("should submit the data by click on submit button",()=>{
    component.flag =1
    component.form.patchValue({
      amount:"100",
      category:1,
      desc:"salary",
      bank:1,
      date:"2022-11-12"
    })
    
    spyApi.add_transaction.and.returnValue(of({id:1}))
    spyApi.get_account_by_bankid.and.returnValue(of([{balance:100}]))
    spyApi.update_account_by_id.and.returnValue(of(true))
    spyApi.update_user_info.and.returnValue(of(true))
     component.submit()
     expect(spyDialogRef.close).toHaveBeenCalledTimes(1)
  })
});
