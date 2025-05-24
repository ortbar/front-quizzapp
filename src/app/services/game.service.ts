import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../models/game/game.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {


  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  startGame(): Observable<Game>{
    return this.http.post<Game>(`${this.apiUrl}/api/game/startGame`,{});
  }

    saveGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/api/game/saveGame`, game);
  }





}
