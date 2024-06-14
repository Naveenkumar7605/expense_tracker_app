import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SnackbarService } from 'src/app/shared/services/snackbar/snackbar.service';
// import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';


// ------------------------------ Interfaces ----------------------------------------
interface StatusInterface {
  status: number,
  data?: any
}

// ------------------------------- Mock Classes ---------------------------------------

class MockApi {
  private credential: any[] = [{ email: "naveen@gmail.com", pass: 7605 }]
  login(email: string, password: string) {
    return new Promise((res, rej) => {
      this.credential.map(item => {
        if (item.email == email && item.pass == password) {
          res(<StatusInterface>{
            status: 200,
            data: []
          })
        }
        res(<StatusInterface>{
          status: 400,
          data: []
        })
      })
    })
  }
}

// ---------------------------------- Spec ---------------------------------------------

describe("Login Component", () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let spyApi: jasmine.SpyObj<ApiService>;
  let spyRouter: jasmine.SpyObj<Router>;
  let spySnackbar: jasmine.SpyObj<SnackbarService>;
  let form = () => component.form;
  beforeEach(() => {
    spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl'])
    spySnackbar = jasmine.createSpyObj(['sucess', 'warn'])
    TestBed.configureTestingModule({
      imports:[
        
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      declarations: [LoginComponent],
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
        }
      ]
    })
    fixture = TestBed.createComponent(LoginComponent)
    spyApi = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>
    spyRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
    spySnackbar = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>
    component = fixture.componentInstance


  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should be form with a controls", () => {
    expect(component.form.contains("email")).toBeTruthy()
    expect(component.form.contains("password")).toBeTruthy()
  })

  it("should require form field values", () => {
    let { controls } = form();
    let email = controls['email']
    let password = controls['password']
    email.setValue("naveen@gmail.com")
    password.setValue("1234")
    expect(email.valid).toBeTruthy()
    expect(password.valid).toBeTruthy()
  })

  describe("login",()=>{
    it("should  redirect the url if the credential is valid ", async () => {
      let { controls } = form()
      controls['email'].setValue("naveen@gmail.com")
      controls['password'].setValue("7605")
      await spyApi.login(controls['email'].value, controls['password'].value).then(res => {
        spyRouter.navigateByUrl("/")
        expect(res.status).toEqual(200)
        spySnackbar.sucess("")
        expect(spySnackbar.sucess).toHaveBeenCalledTimes(1)
      })
    })
  
    it("should throw a warning message if the credentials are invalid ", async () => {
      let { controls } = form()
      controls['email'].setValue("naveen@gmail.com")
      controls['password'].setValue("12")
      await spyApi.login(controls['email'].value, controls['password'].value).then(res => {
        expect(res.status).toEqual(400)
        spySnackbar.warn("")
        expect(spySnackbar.warn).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("disable/enable login button", () => {
    it("should disable the login button if the form is invalid", () => {
      component.form.controls['email'].patchValue("naveen")
      component.form.controls['password'].patchValue(7606)
      component.ngDoCheck()
      fixture.detectChanges()
      expect((<HTMLButtonElement>fixture.debugElement.query(By.css("button")).nativeElement).disabled).toBeTrue()

    })

    it("should enable the login button if the form is valid", () => {
      component.form.controls['email'].setValue("naveen@gmail.com")
      component.form.controls['password'].setValue('7688')
      component.ngDoCheck()
      fixture.detectChanges()
      expect((<HTMLButtonElement>fixture.debugElement.query(By.css("button")).nativeElement).disabled).toBeFalse()

    })
  })

})
