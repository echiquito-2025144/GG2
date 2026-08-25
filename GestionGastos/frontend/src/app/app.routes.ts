import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login';
import { RegisterComponent } from './modules/auth/pages/register/register'; 
import { DashboardComponent } from './modules/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' }
];