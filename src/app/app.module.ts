import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './components/auth/login-component/login-component.component'; 
import { AdminDashboardComponent } from './components/pages/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/pages/user-dashboard/user-dashboard.component';
import { AuthGuardGuard } from './guard/admin-auth-guard.guard';
import { UserGuardGuard } from './guard/user-guard.guard';
import { AuthInterceptor } from './auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './components/auth/register/register.component';
import { LayoutComponent } from './components/pages/shared/layout/layout.component';
import { SidebarComponent } from './components/pages/shared/siderbar/sidebar/sidebar.component';
import { AdminUsersComponent } from './components/pages/admin/admin-users/admin-users.component';
import { UserTableComponent } from './components/pages/admin/user-table/user-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,  // Añade componentes no standalone aquí
    AdminDashboardComponent,
    UserDashboardComponent,
    RegisterComponent,
    LayoutComponent,
    SidebarComponent,
    AdminUsersComponent,
    UserTableComponent,
   
   
    
    
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,  // Solo una vez
    RouterModule,
    ReactiveFormsModule
   
  

    
  ],
  providers: [AuthGuardGuard, UserGuardGuard,
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
