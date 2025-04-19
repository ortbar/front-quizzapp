import { Component, OnInit } from '@angular/core';
import { AuthLoginRequest } from '../../../models/auth/authLoginRequestModel';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../app-routing.module';
import { AppComponent } from '../../../app.component';
import { error } from 'console';


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  standalone:false
})


export class LoginComponentComponent implements OnInit {

  credentials: AuthLoginRequest = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authservice.login(this.credentials).subscribe({
      next: (response) => {
        this.authservice.saveToken(response.jwt);

        const userRole = this.authservice.getUserRole();
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        // Aquí gestionamos los errores de manera adecuada
        if (err instanceof Error )  {
          // Error personalizado del backend
          this.errorMessage = err.message;
        } else {
          // En caso de que el error no sea un error estándar
          this.errorMessage = 'Error desconocido';
        }
      }
    });
  }
}




