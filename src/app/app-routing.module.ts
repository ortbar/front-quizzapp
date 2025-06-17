import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './components/auth/login-component/login-component.component';
import { AdminDashboardComponent } from './components/pages/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuardGuard } from './guard/admin-auth-guard.guard';
import { UserDashboardComponent } from './components/pages/user-dashboard/user-dashboard.component';
import { UserGuardGuard } from './guard/user-guard.guard';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminUsersComponent } from './components/pages/admin/admin-users/admin-users.component';
import { AdminQuestionsComponent } from './components/pages/admin/admin-questions/admin-questions/admin-questions.component';
import { EditUserProfileComponent } from './components/pages/edit-user-profile/edit-user-profile/edit-user-profile.component';
import { Edit } from 'lucide-angular';
import { GameComponent } from './components/pages/game/game/game.component';

const routes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'register', component: RegisterComponent},
  {path:'juego', component: GameComponent, canActivate:[UserGuardGuard]},
  {path: 'admin', component: AdminDashboardComponent, canActivate:[AuthGuardGuard],
    children: [
       { path: 'edit-user', component: EditUserProfileComponent},
       { path: 'users', component: AdminUsersComponent },
       { path: 'questions', component: AdminQuestionsComponent}
      ]
  },  
  {path: 'user-dashboard', component: UserDashboardComponent, canActivate:[UserGuardGuard],
    children: [
      { path: 'edit-user', component: EditUserProfileComponent}
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
