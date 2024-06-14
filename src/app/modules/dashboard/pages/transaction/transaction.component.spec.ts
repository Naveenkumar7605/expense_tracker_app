import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import { DataShareService } from 'src/app/shared/services/data.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let spyDS: jasmine.SpyObj<DataShareService>;
  let spyApi: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    spyApi = jasmine.createSpyObj("ApiService", ['add_account', 'update_user_info', 'get_account_by_bankid'])
    spyDS = jasmine.createSpyObj("DataShareService", ['get_user_info', 'add_account', 'linked_bank_accounts', 'get_transaction_history'])
    await TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: DataShareService,
          useValue: spyDS
        },
        {
          provide: ApiService,
          useValue: spyApi
        },
      ]
    })

    spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    spyDS = TestBed.inject(DataShareService) as jasmine.SpyObj<DataShareService>;
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOninit()", async () => {
    let banks = [{
      "id": 1,
      "name": "HDFC",
      "img": "../../../../../assets/banks/hdfc.png"
    }]
    spyOn(component, 'account_info')
    spyDS.linked_bank_accounts.and.returnValue(new Promise(res => res(banks)))
    spyDS.get_user_info.and.returnValue(new Promise(res => res(<any>{ contact: { email: "naveen@gmail.com" } })))
    await component.ngOnInit()
    expect(component.form.controls['account'].value).toBeDefined()
    expect(component.email).toBe("naveen@gmail.com")
    expect(component.account_info).toHaveBeenCalled()
  })


  it("It should call the `account_info` method.", async () => {
    spyApi.get_account_by_bankid.and.returnValue(of([{ balance: 1000, cardholder_name: "naveen", account_no: "98989" }]))
    await component.account_info()
    expect(component.account_balance).toBeDefined()
    expect(component.cardholder_name).toBeDefined()
    expect(component.account_no).toBeDefined()
  })

  it("It should call the `account_info()` method when calling the `selected_account()` method.", () => {
    spyOn(component, 'account_info')
    component.selected_account(1)
    expect(component.account_info).toHaveBeenCalled()
  })

  it("The `transaction_history` should be empty when calling the `selectType()` method.", () => {
    component.selectType(1)
    expect(component.transaction_history.length).toBe(0)
  })


  it("Enable the `go_btn` button if the start date is less than the end date.", () => {
    component.form.controls['start_date'].patchValue({ _d: new Date("2024-06-11") })
    component.form.controls['end_date'].patchValue({ _d: new Date("2024-06-15") })
    component.ngDoCheck()
    expect(component.go_btn).toBeFalsy()
  })

  it("Disable the `go_btn` button if the start date is greater than the end date.", () => {
    component.form.controls['start_date'].patchValue({ _d: new Date("2024-06-19") })
    component.form.controls['end_date'].patchValue({ _d: new Date("2024-06-15") })
    component.ngDoCheck()
    expect(component.go_btn).toBeTruthy()
  })

  it("The `go` method should return `transaction_history` based on the start date and end date.", async () => {
    let transaction_history = [{
      "amount": "25000",
      "category": "Salary",
      "desc": "monthly salary",
      "bank": 3,
      "flag": 1,
      "datetime": "2024-06-02T18:30:00.000Z",
      "user_id": 1,
      "id": 1
    },]
    component.form.controls['start_date'].patchValue({ _d: new Date("2024-06-11") })
    component.form.controls['end_date'].patchValue({ _d: new Date("2024-06-15") })
    spyDS.get_transaction_history.and.returnValue(new Promise(res => res(transaction_history)))
    await component.go()
    expect(component.transaction_history.length).toBe(transaction_history.length)

  })
});
