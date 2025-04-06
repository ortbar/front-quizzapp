import { Component, OnInit } from '@angular/core';
import { AuthLoginRequest } from 'src/app/models/auth/authLoginRequestModel';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  credentials: AuthLoginRequest = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.jwt);

        const userRole = this.authService.getUserRole();
        console.log("Rol del usuario: ", userRole);
        
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user-dashboard']);
        } 
      
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }

}
