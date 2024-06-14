import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MethodCall } from '@angular/compiler';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// ------------------------------ Interfaces ----------------------------------------
interface StatusInterface {
  status: number,
  data?: any
}
// ------------------------------- Mock Classes ---------------------------------------
class MockApi {
  private credential: any[] = [{ email: "naveen@gmail.com", pass: 7605 }]
  signup(payload: any) {
    let { contact } = payload;
    if(this.credential.filter(item=>item.email == contact.email).length>0){
      return new Promise(resolve=>{
        resolve(<StatusInterface>{ status: 400 })
      })
    }else {
      return new Promise(resolve=>{
        resolve(<StatusInterface>{ status: 200 })
      })
    }

  }
}

// ---------------------------------- Spec ---------------------------------------------


describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let spyApi: jasmine.SpyObj<ApiService>;
  let spyRouter: jasmine.SpyObj<Router>;
  let spySnackbar: jasmine.SpyObj<SnackbarService>;
  let form = () => component.form;
  beforeEach(async () => {
    spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl'])
    spySnackbar = jasmine.createSpyObj(['sucess', 'warn'])
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      providers: [
        {
          provide: ApiService,
          useClass: MockApi
        },
        {
          provide: SnackbarService,
          useValue: spySnackbar
        },
        {
          provide: Router,
          useValue: spyRouter
        },
        
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      imports: [MaterialModule,ReactiveFormsModule]
    })
    fixture = TestBed.createComponent(SignUpComponent);
    spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>
    spyRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
    spySnackbar = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>
    component = fixture.componentInstance
    form = () => {
      return component.form
    }
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should be a form with controls", () => {

    expect(form().contains("name")).toBeTruthy()
    expect(form().contains("email")).toBeTruthy()
    expect(form().contains("password")).toBeTruthy()
    expect(form().contains("mobno")).toBeTruthy()
    expect(form().contains("policy")).toBeTruthy()
  })

  it("form field values should be required", () => {
    let { controls } = form();
    controls['name'].setValue("naveen")
    controls['email'].setValue("naveen@gmail.com")
    controls['password'].setValue("1234")
    controls['mobno'].setValue("8655465767")
    expect(controls['name'].valid).toBeTruthy()
    expect(controls['email'].valid).toBeTruthy()
    expect(controls['password'].valid).toBeTruthy()
    expect(controls['mobno'].valid).toBeTruthy()
  })

  describe("sign up method", () => {

    it("should throw the warn message if the email id is already taken by someone", async () => {
      component.form.controls['email'].setValue("naveen@gmail.com")
      component.form.controls['name'].setValue("naveen")
      expect(spySnackbar.warn).toHaveBeenCalledTimes(0)
      component.sign_up()

    })

    it("should redirect to login page if the email id is still no one has taken", async () => {
      component.form.controls['email'].setValue("navee@gmail.com")
      component.form.controls['name'].setValue("naveen")
      component.sign_up()
    })
  })


  describe("disable/enable login button", () => {
    it("should disable the login button if the form is invalid", () => {
      let { controls } = form()
      controls['name'].setValue("naveen")
      controls['email'].setValue("naveen@gmail")
      controls['password'].setValue("1234")
      controls['mobno'].setValue("9384568393")
      component.ngDoCheck()
      fixture.detectChanges()
      expect((<HTMLButtonElement>fixture.debugElement.query(By.css("button")).nativeElement).disabled).toBeTrue()

    })

    it("should enable the login button if the form is valid", () => {
      let { controls } = form()
      controls['name'].patchValue("naveen")
      controls['email'].patchValue("naveen@gmail.com")
      controls['password'].patchValue("1234")
      controls['mobno'].patchValue("9384568393")
      component.ngDoCheck()
      fixture.detectChanges()
      expect((<HTMLButtonElement>fixture.debugElement.query(By.css("button")).nativeElement).disabled).toBeFalse()

    })
  })
});
