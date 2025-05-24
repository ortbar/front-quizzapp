import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAnswer } from 'src/app/models/game/userAnswer.model';
import { Question } from 'src/app/models/question/question.model';
import { GameService } from 'src/app/services/game.service';
import { QuestionServiceService } from 'src/app/services/question-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
     username?: string = '';
     gameId: number | undefined;
     questions: Question[] = []; // Lista de preguntas cargadas
     currentQuestionIndex: number = 0; // Índice de la pregunta actual (0-9)
     currentQuestion!: Question; // Pregunta actual mostrada
     selectedAnswerId: number | null = null; // ID de la respuesta seleccionada por el usuario
     score: number = 0; // Puntuación acumulada del usuario
     timer: number = 30; // Tiempo restante para responder una pregunta
     totalTime: number = 30;
     timerInterval: any; // Referencia al setInterval del temporizador
     isAnswerSubmitted: boolean = false; // Controla si ya se respondió esta pregunta
     feedbackMessage: string = ''; // Mensaje de feedback (correcta / incorrecta)
     userAnswers: UserAnswer[] = []; // Respuestas dadas por el usuario (para guardar partida)
     isGameFinished: boolean = false;
    

  constructor(private gameService: GameService,
              private questionService: QuestionServiceService,
              private router: Router) { }


// inicializa la partida y carga 10 preguntas con respuestas
ngOnInit(): void {
  this.gameService.startGame().subscribe(game => {
    this.username = game.username;
    this.gameId = game.id;
    
    this.questionService.getRandomQuestions(10).subscribe(questions => {
      this.questions = questions;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.startTimer(); // empieza el contador
    
    });
  });
}

// metodo al que se llama cuando el tiempo expire
handleAnswerTimeout(){
    this.isAnswerSubmitted = true;
  this.selectedAnswerId = null;
  this.feedbackMessage = '⏰ ¡Se acabó el tiempo! Respuesta incorrecta.';

  // Guardar como respuesta incorrecta (sin seleccionar)
  this.userAnswers.push({
    gameId:this.gameId!,
    questionId: this.currentQuestion.id,
    selectedAnswerId: null
  });

  // Avanzar a la siguiente pregunta tras un breve retraso
  setTimeout(() => this.goToNextQuestion(), 2000);

}

startTimer(): void {
  this.timer = 30; // Resetear a 30 segundos

  this.timerInterval = setInterval(() => {
    this.timer--;
    if (this.timer === 0) {
      clearInterval(this.timerInterval);
      this.handleAnswerTimeout(); // Acción cuando se agota el tiempo
    }
  }, 1000);
}

// metodo para cuando el usuario responda antes de tiempo, detener el timer
selectAnswer(answerId: number): void {
  clearInterval(this.timerInterval);
  

  const currentAnswer = this.currentQuestion.answers.find(a => a.id === answerId);
  const isCorrect = currentAnswer?.esCorrecta;
  this.feedbackMessage = isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😕';
  this.isAnswerSubmitted = true;

  if (isCorrect) {
    this.score += this.timer; // Sumar puntos basados en el tiempo restante
  }

  // Mostrar feedback y luego ir a la siguiente
  setTimeout(() => this.goToNextQuestion(), 2000);
}

goToNextQuestion(): void {
  this.isAnswerSubmitted = false;
  this.selectedAnswerId = null;
  this.feedbackMessage = '';

  this.currentQuestionIndex++;

  if (this.currentQuestionIndex < this.questions.length) {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.startTimer(); // Reiniciar el temporizador para la nueva pregunta
  } else {
    // Aquí puedes manejar el fin del juego
    // Por ejemplo: guardar la partida, navegar a resultados, mostrar resumen...
    console.log('Juego finalizado. Puntuación:', this.score);
    // clearInterval just in case
    clearInterval(this.timerInterval);
    this.isGameFinished = true;

    const gameData = {
     
      score: this.score,
      createdAt: new Date().toISOString(),
      answers: this.userAnswers
    };

    this.gameService.saveGame(gameData).subscribe({
      next: response => {
        console.log('Partida guardada con éxito:', response);
      },
      error: err => {
        console.error('Error al guardar la partida:', err);
      }
    });
  }
        
  }

  reiniciarJuego(): void {
  window.location.reload(); // Recarga la página (simple y directo)
}

}






// finalizeGame(): void {
//   clearInterval(this.timerInterval);

//   const gameData = {
//     userId: this.userId, // O usa el userId que ya tengas en el login
//     score: this.score,
//     createdAt: new Date(),
//     answers: this.userAnswers.map(ans => ({
//       questionId: ans.questionId,
//       selectedAnswerId: ans.selectedAnswerId
//     }))
//   };

//   this.gameService.saveGame(gameData).subscribe(saved => {
//     console.log('Juego guardado', saved);
//     this.router.navigate(['/resultado'], { queryParams: { score: saved.score } });
//   });
// }

// 


