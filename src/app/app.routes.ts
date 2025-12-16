import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SupportChatComponent } from './components/support-chat/support-chat.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: SupportChatComponent, canActivate: [authGuard] },
  // Legacy route for backward compatibility
  { path: 'support-chat', redirectTo: 'chat', pathMatch: 'full' }
];
