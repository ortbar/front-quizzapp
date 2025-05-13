import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Answer } from 'src/app/models/Answer/answer.model';
import { Question } from 'src/app/models/question/question.model';

@Component({
  selector: 'app-question-edit-modal',
  templateUrl: './question-edit-modal.component.html',
  styleUrls: ['./question-edit-modal.component.css'],
  standalone:false
})
export class QuestionEditModalComponent implements OnInit {

  @Input() question: Question | null = null; // <--- recibe la pregunta

  @Output() saveQuestion = new EventEmitter<Question>(); // <--- avisa al padre cuando se guarda

  @Output() closeModal = new EventEmitter<void>(); // <--- avisa al padre al cerrar

@Input() visible: boolean = false;
  localQuestion: Question = {
    id: 0,
    textoPregunta: '',
    answers: []
  };

    ngOnChanges(changes: SimpleChanges): void {
    // this.visible = true; // mostrar modal automáticamente si cambia la pregunta

    if (this.question) {
      // Modo edición
      this.localQuestion = {
        ...this.question,
        answers: [...this.question.answers]
      };
    } else {
      // Modo creación
      this.localQuestion = {
        id: 0,
        textoPregunta: '',
        answers: []
      };
    }
  }

  addAnswer(): void {
    const newAnswer: Answer = {
      id: 0,
      textoRespuesta: '',
      esCorrecta: false
    };
    this.localQuestion.answers.push(newAnswer);
  }

    removeAnswer(index: number): void {
    this.localQuestion.answers.splice(index, 1);
  }

  onSave(): void {
    this.saveQuestion.emit(this.localQuestion);
    this.visible = false;
  }

  onClose(): void {
    this.closeModal.emit();
    this.visible = false;
  }


  








  constructor() { }

  ngOnInit(): void {

  }

}
