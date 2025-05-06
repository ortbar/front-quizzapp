import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user/user.model';
import { error } from 'console';
import { ApiErrorResponse } from '../models/auth/api-error-response';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

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


}







