import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAnswer } from 'src/app/models/game/userAnswer.model';
import { Question } from 'src/app/models/question/question.model';
import { GameService } from 'src/app/services/game.service';
import { QuestionServiceService } from 'src/app/services/question-service.service';
import { AuthService } from 'src/app/services/auth.service';

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
     timerAnimationFrame: any; // Para requestAnimationFrame
     isAnswerSubmitted: boolean = false; // Controla si ya se respondió esta pregunta
     feedbackMessage: string = ''; // Mensaje de feedback (correcta / incorrecta)
     userAnswers: UserAnswer[] = []; // Respuestas dadas por el usuario (para guardar partida)
     isGameFinished: boolean = false;
    

  constructor(
    private gameService: GameService,
    private questionService: QuestionServiceService,
    private router: Router,
    private authService: AuthService
  ) { }


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

// Reemplaza startTimer para usar requestAnimationFrame
startTimer(): void {
  this.timer = this.totalTime;
  const start = performance.now();
  const duration = this.totalTime * 1000;

  const animate = (now: number) => {
    const elapsed = now - start;
    const remaining = Math.max(0, duration - elapsed);
    this.timer = +(remaining / 1000).toFixed(2);
    if (remaining > 0 && !this.isAnswerSubmitted) {
      this.timerAnimationFrame = requestAnimationFrame(animate);
    } else if (!this.isAnswerSubmitted) {
      this.timer = 0;
      this.handleAnswerTimeout();
    }
  };
  this.timerAnimationFrame = requestAnimationFrame(animate);
}

// Detener animación al responder
selectAnswer(answerId: number): void {
  if (this.timerAnimationFrame) {
    cancelAnimationFrame(this.timerAnimationFrame);
  }
  

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
    this.startTimer();
  } else {
    if (this.timerAnimationFrame) {
      cancelAnimationFrame(this.timerAnimationFrame);
    }
    console.log('Juego finalizado. Puntuación:', this.score);
 
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
        // Redirigir según el rol
        const role = this.authService.getUserRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
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

  // Devuelve un color de fondo para la barra de progreso según el tiempo restante
  getProgressColor(): string {
    const percent = this.timer / this.totalTime;
    if (percent > 0.5) {
      // Verde a amarillo
      const ratio = (percent - 0.5) * 2;
      return `linear-gradient(90deg, #4caf50 ${ratio * 100}%, #ffeb3b)`;
    } else if (percent > 0.2) {
      // Amarillo a naranja
      const ratio = (percent - 0.2) / 0.3;
      return `linear-gradient(90deg, #ffeb3b ${ratio * 100}%, #ff9800)`;
    } else {
      // Naranja a rojo
      const ratio = percent / 0.2;
      return `linear-gradient(90deg, #ff9800 ${ratio * 100}%, #f44336)`;
    }
  }

}









