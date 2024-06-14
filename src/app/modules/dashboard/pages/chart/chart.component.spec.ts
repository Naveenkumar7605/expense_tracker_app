import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { DataShareService } from 'src/app/shared/services/data.service';
import { CustomeSpinnerService } from 'src/app/shared/services/spinner/custome-spinner.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let spyDS: jasmine.SpyObj<DataShareService>;
  let spySpinner: jasmine.SpyObj<CustomeSpinnerService>;
  let accountInfo: AccountInfoInterface;
  beforeEach(async () => {
    spySpinner = jasmine.createSpyObj("CustomeSpinnerService", ['open', 'close'])
    spyDS = jasmine.createSpyObj("DataShareService", ['get_user_info', 'add_account'])
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
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
      .compileComponents();
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
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
    expect(component).toBeTruthy();
  });

  it("should call the ngOninit()",async ()=>{
    spyDS.get_user_info.and.returnValue(new Promise(res => {
      res(accountInfo)
    }))
    await component.ngOnInit()
    expect(component.transaction_data.length).toEqual(accountInfo.transactions_info.length)
  })
});
