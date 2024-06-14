import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing"
import { AddProfileComponent } from "./add-profile.component"
import { CommaExpr } from "@angular/compiler";
import { ApiService } from "../../services/api/api.service";
import { MatDialogRef } from "@angular/material/dialog";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

// class MockDialog{
//     close(){

//     }
// }

describe("Add Profile", () => {
    let component: AddProfileComponent;
    let fixture: ComponentFixture<AddProfileComponent>;
    let spyApi: jasmine.SpyObj<ApiService>
    let spyDialogRef: jasmine.SpyObj<MatDialogRef<AddProfileComponent>>
    beforeEach(() => {
        spyApi = jasmine.createSpyObj(['get_user_detail_by_id', 'update_user_info'])
        spyDialogRef = jasmine.createSpyObj(['close'])
        TestBed.configureTestingModule({
            declarations: [AddProfileComponent],
            schemas:[
                NO_ERRORS_SCHEMA
              ],
            providers: [
                {
                    provide: ApiService,
                    useValue: spyApi
                },
                {
                    provide: MatDialogRef,
                    useValue: spyDialogRef
                },
            ]
        })
        fixture = TestBed.createComponent(AddProfileComponent)
        component = fixture.componentInstance
        spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>
        spyDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddProfileComponent>>

    })
    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it("should call ngOninit()", () => {
        spyOn(component, 'loadData')
        component.ngOnInit()
        expect(component.loadData).toHaveBeenCalledTimes(1)
    })

    it("Load data should be called when ngOnInit is invoked",async ()=>{
        component.img = {
            nativeElement:{
                src:null
            }
        }
        spyApi.get_user_detail_by_id.and.returnValue(of([{contact:{src:{blobData:"img"}}}]))
        component.loadData()
        fakeAsync(()=>{
            expect(component.placeImage).toHaveBeenCalledTimes(1)
        })
    })

    it("`trackImage()` should be called when `openFileManager()` is invoked.",()=>{
        let file = new File(['content'],"file.png",{type:"image/png"});
        component.openFileManager({
            target:{
                files:[file]
            }
        })
        spyOn(component,'trackImage')
        component.img = {
            nativeElement:{
                src:null
            }
        }
        fakeAsync(()=>{
            expect(component.placeImage).toHaveBeenCalledTimes(1)
        },)
        
    })
    it("should call deleteImage()",()=>{
        spyOn(component,'placeImage')
        component.deleteImage()
        expect(component.img_src).toBeNull()
        expect(component.show_delete_btn).toBeFalse()
        expect(component.placeImage).toHaveBeenCalled()

    })

    it("Invoke the `save()` method when clicking the save button",()=>{
        spyOn(component,'loadData')
        component.account_info = [{}]
        spyApi.update_user_info.and.returnValue(of(true))
        component.save()
        expect(component.loadData).toHaveBeenCalledTimes(1)
        expect(spyDialogRef.close).toHaveBeenCalledTimes(1)


    })

})


