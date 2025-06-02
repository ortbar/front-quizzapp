import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Question } from '../models/question/question.model';
import { ApiErrorResponse } from '../models/auth/api-error-response';
import { PaginatedResponse } from '../models/question/paginatedQuestionResponse.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<Question[]>{
    return this.http.get<Question[]>(`${this.apiUrl}/admin/questions/AllQuestion`);
  }

  getPaginatedQuestions(page:number, size:number): Observable<PaginatedResponse<Question>> {
    const params = new HttpParams()
      .set('page',page)
      .set('size',size);
    
    return this.http.get<PaginatedResponse<Question>>(`${this.apiUrl}/admin/questions/AllPaginatedQuestion`, {params})

  }

  createQuestion(question:Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/admin/questions/saveQuestion`,question)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = error.error as ApiErrorResponse;
        const message = apiError?.message || 'Error creando pregunta';
        return throwError(() => new Error(message));
      })
    );
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/admin/questions/updateQuestion/${question.id}`, question)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const apiError = error.error as ApiErrorResponse;
          const message = apiError?.message || 'Error actualizando pregunta';
          return throwError(() => new Error(message));
        })
      );
  }

    deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/questions/deleteQuestion/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const apiError = error.error as ApiErrorResponse;
          const message = apiError?.message || 'Error eliminando pregunta';
          return throwError(() => new Error(message));
        })
      );
  }

    getRandomQuestions(count: number = 10): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/admin/questions/random?count=${count}`);
  }




}
