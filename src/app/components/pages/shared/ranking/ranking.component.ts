import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
  standalone: false
})
export class RankingComponent implements OnInit {

  ranking: Game[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getRanking().subscribe({
      next: (data) => this.ranking = data,
      error: (err) => console.error('Error cargando ranking', err)
    });
  }

}
