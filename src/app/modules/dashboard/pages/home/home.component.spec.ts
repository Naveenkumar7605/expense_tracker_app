import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';

import { DataShareService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';
import { CommaExpr } from '@angular/compiler';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountComponent } from 'src/app/shared/popups/account/account.component';
import { By } from '@angular/platform-browser';
import { CustomeSpinnerService } from 'src/app/shared/services/spinner/custome-spinner.service';
import { ApiService } from 'src/app/shared/services/api/api.service';


interface AccountInfoInterface {
  contact: {
    user_name: string,
    email: string,
    password: string,
    mobile_no: string,
    src: null | Object
  },
  account_ids: number[],
  transaction_ids: number[],
  accounts_info: Array<{
    bank_name: string,
    bank_img: string,
    account_no: string,
    balance: number,
    bank: number,
    cardholder_name: string
  }>,
  transactions_info: Array<{
    id: number,
    bank_name: string,
    bank_img: string,
    category: string,
    amount: string,
    bank_id: number,
    flag: number,
    datetime: string,
    desc: null | string
  }>

}

class MockDialog {
  open(component: Component, data: any) {
    return {
      afterClosed: () => {
        return of(data.ds)
      }
    }
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let spyApi: jasmine.SpyObj<ApiService>;
  let spyDS: jasmine.SpyObj<DataShareService>;
  let spySpinner: jasmine.SpyObj<CustomeSpinnerService>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  let accountInfo: AccountInfoInterface;
  beforeEach(async () => {
    spyApi = jasmine.createSpyObj("ApiService", ['add_account', 'update_user_info'])
    spyDS = jasmine.createSpyObj("DataShareService", ['get_user_info', 'add_account'])
    spySpinner = jasmine.createSpyObj("CustomeSpinnerService", ['open', 'close'])

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: MatDialog,
          useClass: MockDialog
        },
        {
          provide: ApiService,
          useValue: spyApi
        },
        {
          provide: DataShareService,
          useValue: spyDS
        },
        {
          provide: CustomeSpinnerService,
          useValue: spySpinner
        }
      ]
    })

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    spyDS = TestBed.inject(DataShareService) as jasmine.SpyObj<DataShareService>;
    spySpinner = TestBed.inject(CustomeSpinnerService) as jasmine.SpyObj<CustomeSpinnerService>
    spyDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>
    // fixture.detectChanges();

    accountInfo = {
      "contact": {
        "user_name": "naveen kumar",
        "email": "naveen@gmail.com",
        "password": "1234",
        "mobile_no": "9784376584",
        "src": {
          "blobData": "s"
        }
      },
      "account_ids": [1],
      "transaction_ids": [1],
      "accounts_info": [
        {
          "bank_name": "Axis Bank",
          "bank_img": "../../../../../assets/banks/axis.png",
          "account_no": "97654776349",
          "balance": 25000,
          "bank": 3,
          "cardholder_name": "naveenkumar#Axis"
        }
      ],
      "transactions_info": [
        {
          "id": 6,
          "bank_name": "HDFC",
          "bank_img": "../../../../../assets/banks/hdfc.png",
          "category": "Freelance",
          "amount": "20000",
          "bank_id": 1,
          "flag": 1,
          "datetime": "2024-06-15",
          "desc": null
        }
      ]
    }
  });

  it('should create', () => {
    expect(1).toBe(1);
  });

  it("It should invoke the `loadData` method when calling the `ngOnInit` lifecycle hook.", async () => {
    spyDS.get_user_info.and.returnValue(new Promise(res => {
      res(accountInfo)
    }))
    fixture.detectChanges()
    let sum = 0;
    accountInfo.accounts_info.map(item => {
      sum += item.balance
    })
    await component.total_balance
    expect(component.total_balance).toBe(sum)
  })

  it("It should open the 'Add Account' popup if the account is empty.", () => {
    spyApi.add_account.and.returnValue(of({ id: 1 }))
    spyApi.update_user_info.and.returnValue(of({ id: 1 }))
    spyOn(component, 'openAddAccount')
    accountInfo.account_ids = []
    spyDS.get_user_info.and.returnValue(new Promise(res => {
      res(accountInfo)
    }))
    fixture.detectChanges()
    expect(spyDS.get_user_info).toHaveBeenCalledTimes(1)
  })

  it("It should open the transaction popup when I click.", () => {
    spyOn(component, 'openTransaction')
    spyDS.get_user_info.and.returnValue(new Promise(res => {res(accountInfo)}))
    let transaction_button = fixture.debugElement.query(By.css("#transaction_open"));
    transaction_button.triggerEventHandler('click', Event)
    expect(component.openTransaction).toHaveBeenCalledTimes(1)
  })
});
