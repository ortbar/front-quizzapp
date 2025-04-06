import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './components/auth/login-component/login-component.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { AuthGuardGuard } from './guard/admin-auth-guard.guard';
import { UserDashboardComponent } from './components/pages/user-dashboard/user-dashboard.component';
import { UserGuardGuard } from './guard/user-guard.guard';

const routes: Routes = [{ path: 'login', component: LoginComponentComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate:[AuthGuardGuard] }, 
  {path: 'user-dashboard', component: UserDashboardComponent, canActivate:[UserGuardGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
