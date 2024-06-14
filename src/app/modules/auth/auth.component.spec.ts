import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';

describe('Auth Component', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let spyRouter: jasmine.SpyObj<Router>;
  let spyRender2: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl'])
    spyRender2 = jasmine.createSpyObj('Render2', ['setStyle'])
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: Router,
          useValue: spyRouter
        },
        {
          provide: Renderer2,
          useValue: spyRender2
        }
      ]
    })
      .compileComponents();
    spyRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
    spyRender2 = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("sign_up() method", () => {
    it("should redirect to the login page", () => {
      component.sign_up()
      expect(spyRouter.navigateByUrl).toHaveBeenCalledTimes(1)
    })
  })

  describe("login() method", () => {
    it("should redirect to the sign-up page", () => {
      component.sign_up()
      expect(spyRouter.navigateByUrl).toHaveBeenCalledTimes(1)
    })
  })


});
