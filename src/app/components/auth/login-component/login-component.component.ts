import { Component, OnInit } from '@angular/core';
import { AuthLoginRequest } from '../../../models/auth/authLoginRequestModel';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
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

 loginForm!: FormGroup;
  backendError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    this.backendError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mostrar errores si se intenta enviar sin tocar
      return;
    }

    const credentials: AuthLoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.jwt);
        const userRole = this.authService.getUserRole();

        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        if (err instanceof Error) {
          this.backendError = err.message;
        } else {
          this.backendError = 'Error desconocido.';
        }
      }
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}




