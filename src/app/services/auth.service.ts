import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthLoginRequest } from '../models/auth/authLoginRequestModel';
import { AuthLoginResponse } from '../models/auth/authLoginResponseModel';
import { Observable } from 'rxjs';
import { Router, RouterModule, Routes } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/log-in';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(this.apiUrl, credentials);
  }

  saveToken(token: string): void {
    console.log("Token guardado:", token);
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  public getUserRole(): string | null {

    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decodedToken: any = jwtDecode(token);
      console.log("token decodificado: ", decodedToken);
      
      if(decodedToken.authorities) {
        const roles = decodedToken.authorities.split(',');
        return roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
      }
      
    } catch (error) {
      console.log("error al decodificar el token", error);
      return null;
    }
    return null;
    
  }
  
  public hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    try {
      const decoded: any = jwtDecode(token);
      const authorities = decoded.authorities?.split(',') || [];
      return authorities.includes(`ROLE_${role}`);
    } catch (err) {
      return false;
    }
  }



}
