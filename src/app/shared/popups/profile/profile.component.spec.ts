import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataShareService } from '../../services/data.service';
import { By } from '@angular/platform-browser';
import { ProfileComponent } from './profile.component';
import { ApiService } from '../../services/api/api.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CustomeSpinnerService } from '../../services/spinner/custome-spinner.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
// import { CustomeSpinnerService } from '../../services/custome-spinner.service';

class MockDialog {
    open(component: Component, data: any) {
        return {
            afterClosed: () => {
                return of(data.ds)
            }
        }
    }
}

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let spyDialogRef: MatDialogRef<any>;
    let spyMatDialogData: typeof MAT_DIALOG_DATA;
    let spyDS: jasmine.SpyObj<DataShareService>;
    let spyApi: jasmine.SpyObj<ApiService>;
    let spySpinner: jasmine.SpyObj<CustomeSpinnerService>;
    let spyDialog: jasmine.SpyObj<MatDialog>;
    let spySnackbar: jasmine.SpyObj<SnackbarService>;
    beforeEach(async () => {
        spyDialogRef = jasmine.createSpyObj(['close'])
        spyDS = jasmine.createSpyObj(['unlinked_bank_accounts', 'linked_bank_accounts', 'get_user_info'])
        spyApi = jasmine.createSpyObj("ApiService", ['add_account', 'update_user_info', 'get_user_detail_by_id', 'update_user_contact_info'])
        spySpinner = jasmine.createSpyObj("CustomeSpinnerService", ['open', 'close'])
        spySnackbar = jasmine.createSpyObj(['sucess', 'warn'])
        await TestBed.configureTestingModule({
            declarations: [ProfileComponent],
            schemas: [
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
                    provide: SnackbarService,
                    useValue: spySnackbar
                },
                {
                    provide: MatDialog,
                    useClass: MockDialog
                },
                {
                    provide: MatDialogRef,
                    useValue: spyDialogRef
                },
                {
                    provide: DataShareService,
                    useValue: spyDS
                },
                {
                    provide: ApiService,
                    useValue: spyApi
                },
                {
                    provide: CustomeSpinnerService,
                    useValue: spySpinner
                },

            ]
        })
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        spyMatDialogData = TestBed.inject(MAT_DIALOG_DATA)
        spySpinner = TestBed.inject(CustomeSpinnerService) as jasmine.SpyObj<CustomeSpinnerService>
        spyDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it("should load the data when the loadData() call", async () => {
        spyApi.get_user_detail_by_id.and.returnValue(of([{ contact: { user_name: "naveen", email: "naveen@gmail.com", mobile_no: "9839377209" } }]))
        component.loadData()
        expect(spySpinner.open).toHaveBeenCalledTimes(1)
        expect(spySpinner.close).toHaveBeenCalledTimes(1)
    })


    it("should call the `loadListBank() method`", async () => {
        let bank_accounts = [{ "id": 1, "name": "HDFC", "img": "../../../../../assets/banks/hdfc.png" }, { "id": 1, "name": "HDFC", "img": "../../../../../assets/banks/hdfc.png" }]
        spyDS.linked_bank_accounts.and.returnValue(new Promise(res => { res(bank_accounts) }))
        await component.loadListBank()
        expect(component.bank_accounts.length).toBe(bank_accounts.length)
    })

    it("should enable the form by calling edit_content()", () => {
        component.edit_content()
        expect(component.form.enabled).toBeTrue()
    })

    it("should call the api when clicking the save button", () => {
        spyOn(component, 'loadData')
        spyApi.update_user_contact_info.and.returnValue(new Promise(res => res({ status: 200 })))
       spyApi.get_user_detail_by_id.and.returnValue(of([]))
        component.account_info = [{ contact: {} }]
        component.save()
        expect(spyApi.update_user_contact_info).toHaveBeenCalled()
        // expect(component.loadData).toHaveBeenCalledTimes(1)
    })


    it("should call the  `expense() method`", () => {
        spyDS.get_user_info.and.returnValue(new Promise(resolve => {
            resolve(<any>{
                accounts_info: [],
                transactions_info: []
            })
        }))
        expect(component.income_amout).toBe(0)
        expect(component.expense_amout).toBe(0)
        expect(component.balance).toBe(0)

    })

    it("should close the dialog when calling the `close() method`", () => {
        component.close()
        expect(spyDialogRef.close).toHaveBeenCalledTimes(1)
    })
    it("should open account component for add while call the addCard()", () => {
        let bank_accounts = [{ "id": 1, "name": "HDFC", "img": "../../../../../assets/banks/hdfc.png" }, { "id": 1, "name": "HDFC", "img": "../../../../../assets/banks/hdfc.png" }]
        component.account_info = { account_ids: [] }
        spyApi.add_account.and.returnValue(of({ id: 1 }))
        spyApi.update_user_info.and.returnValue(of({ id: 1 }))
        spyApi.get_user_detail_by_id.and.returnValue(of([{ contact: { user_name: "naveen", email: "naveen@gmail.com", mobile_no: "9839377209" } }]))
        spyDS.linked_bank_accounts.and.returnValue(new Promise(res => { res(bank_accounts) }))
        component.addCard()
        expect(spyApi.update_user_info).toHaveBeenCalledTimes(1)
    })
});
