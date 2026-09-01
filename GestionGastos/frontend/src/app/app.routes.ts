import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login';
import { RegisterComponent } from './modules/auth/pages/register/register'; 
import { DashboardComponent } from './modules/dashboard/pages/dashboard/dashboard';
import { IngresosComponent } from './ingresos/ingresos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' }
];

import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};