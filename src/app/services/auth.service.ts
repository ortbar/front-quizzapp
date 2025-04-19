import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthLoginRequest } from '../models/auth/authLoginRequestModel';
import { AuthLoginResponse } from '../models/auth/authLoginResponseModel';
import { catchError, Observable, throwError } from 'rxjs';
import { Router, RouterModule, Routes } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiErrorResponse } from '../models/auth/api-error-response';
import { AuthCreateUserRequest } from '../models/auth/authCreateUserRequestModel';
import { AuthCreateUserResponse } from '../models/auth/authCreateUserResponseModel';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar al servidor. Verifica tu conexión o intenta más tarde.';
    }
    if (error.status === 400) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Campos inválidos';
    }
    if (error.status === 401) return 'Credenciales inválidas (usuario o contraseña incorrectos)';
    if (error.status === 404) return 'Usuario no encontrado';
    if (error.status === 500) return 'Error del servidor. Intente más tarde';
    if (error.error?.message) return error.error.message;
    
    return 'Error desconocido';
  }


  login(credentials: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${this.apiUrl}/auth/log-in`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  register(registerRequest: AuthCreateUserRequest): Observable<AuthCreateUserResponse> {
    return this.http.post<AuthCreateUserResponse>(`${this.apiUrl}/auth/sign-up`, registerRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
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
