import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponentComponent } from './components/auth/login-component/login-component.component'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { AuthGuardGuard } from './guard/admin-auth-guard.guard';
import { UserDashboardComponent } from './components/pages/user-dashboard/user-dashboard.component';
import { UserGuardGuard } from './guard/user-guard.guard';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    AdminDashboardComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule
    
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
