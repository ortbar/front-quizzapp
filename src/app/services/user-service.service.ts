import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user/user.model';
import { error } from 'console';
import { ApiErrorResponse } from '../models/auth/api-error-response';
import { UserProfileUpdateDTO } from '../models/user/UserProfileUpdate.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/findAll`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/admin/users/updateUser/${user.id}`,user).pipe(
        catchError((error: HttpErrorResponse) => {
          const apiError = error.error as ApiErrorResponse;

          const message = apiError?.message || 'Error actualizando usuario';

          return throwError(() => new Error(message));
        }
      )
      )
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/deleteUser/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = error.error as ApiErrorResponse;
        const message = apiError?.message || 'Error eliminando usuario';
        return throwError(() => new Error(message));
      })
    );
  }

  // editProfile(user: UserProfileUpdateDTO): Observable<UserProfileUpdateDTO> {
  //   return this.http.put<UserProfileUpdateDTO>

  // }

    private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

    getUserProfile(): Observable<UserProfileUpdateDTO> {
    return this.http.get<UserProfileUpdateDTO>(`${this.apiUrl}/api/user/profile`, {
      headers: this.getAuthHeaders()
    });
  }

updateUserProfile(user: Partial<UserProfileUpdateDTO>): Observable<UserProfileUpdateDTO> {
  return this.http.put<UserProfileUpdateDTO>(
    `${this.apiUrl}/api/user/edit-profile`,
    user,
    {
      headers: this.getAuthHeaders(),
      observe: 'response'  // importante para acceder a headers
    }
  ).pipe(
    map(response => {
      const newToken = response.headers.get('Authorization');
      
  if (newToken?.startsWith('Bearer ')) {
    const token = newToken.replace('Bearer ', '');
    localStorage.setItem('jwt', token);
    console.log('nuevo token', token)
    
    this.authService.setCurrentUserFromToken(token);
      }
      return response.body!;
    }),
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as ApiErrorResponse;
      return throwError(() => apiError);
    })
  );
}



}