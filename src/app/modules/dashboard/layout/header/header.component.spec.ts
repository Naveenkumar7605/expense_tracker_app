import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Router } from '@angular/router';

class MockDialog {
  open(component: Component, data: any) {
    return {
      afterClosed: () => {
        return of(data.ds)
      }
    }
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let spyApi: jasmine.SpyObj<ApiService>;
  let spyRouter: jasmine.SpyObj<Router>;
  let spyDialog:jasmine.SpyObj<MatDialog>
  beforeEach(async () => {
    spyApi = jasmine.createSpyObj("ApiService", ['add_account', 'get_user_detail_by_id'])
    spyRouter = jasmine.createSpyObj("Router",['navigateByUrl'])
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers:[
        {
          provide: MatDialog,
          useClass: MockDialog
        },
        {
          provide: ApiService,
          useValue: spyApi
        },
        {
          provide: Router,
          useValue: spyRouter
        },
      ]
    })
    spyRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    spyDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("It should invoke 'api.get_user_detail_by_id' when calling the ngOnInit() method.",()=>{
    spyOn(component,'activeUrl')
    spyApi.get_user_detail_by_id.and.returnValue(of([{
      contact:{
        src:null
      }
    }]))
    component.ngOnInit()
    expect(component.activeUrl).toHaveBeenCalledWith()
  })

  it("It should display the side navbar when calling the show() function.",()=>{
    component.show()
    expect(component.side_nav).toBeTruthy()
  })

  it("It should hide the side navbar when calling the hide() function.",()=>{
    component.hide()
    expect(component.side_nav).toBeFalsy()
  })

  it("It should redirect to the login page when calling the logout() function.",()=>{
   component.logout()
   expect(spyRouter.navigateByUrl).toHaveBeenCalled()
  })

});
