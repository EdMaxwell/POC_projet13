import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'isLoggedIn'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.isLoggedIn.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to chat if already logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    
    // Create a new component instance with logged-in state
    const newComponent = new LoginComponent(authService, router);
    
    expect(router.navigate).toHaveBeenCalledWith(['/chat']);
  });

  it('should login successfully with valid username', () => {
    authService.login.and.returnValue(true);
    
    component.username = 'testuser';
    component.password = 'anypassword';
    component.onLogin();
    
    expect(authService.login).toHaveBeenCalledWith('testuser', 'anypassword');
    expect(router.navigate).toHaveBeenCalledWith(['/chat']);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when username is empty', () => {
    component.username = '';
    component.password = 'password';
    component.onLogin();
    
    expect(authService.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please enter a username');
  });

  it('should show error when username is only whitespace', () => {
    component.username = '   ';
    component.password = 'password';
    component.onLogin();
    
    expect(authService.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please enter a username');
  });

  it('should show error when login fails', () => {
    authService.login.and.returnValue(false);
    
    component.username = 'testuser';
    component.password = 'password';
    component.onLogin();
    
    expect(component.errorMessage).toBe('Login failed. Please try again.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should display login form elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('input[name="username"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should display demo tip', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.login-hint')?.textContent).toContain('Demo Tip');
    expect(compiled.querySelector('.login-hint')?.textContent).toContain('two browser windows');
  });

  it('should clear error message on new login attempt', () => {
    component.errorMessage = 'Previous error';
    component.username = 'testuser';
    authService.login.and.returnValue(true);
    
    component.onLogin();
    
    expect(component.errorMessage).toBe('');
  });
});
