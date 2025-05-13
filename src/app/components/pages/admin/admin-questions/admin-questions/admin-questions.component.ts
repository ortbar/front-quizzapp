import { Component, OnInit, ViewChild } from '@angular/core';
import { error } from 'console';
import { Question } from 'src/app/models/question/question.model';
import { QuestionServiceService } from 'src/app/services/question-service.service';


@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css'],
  standalone:false
})
export class AdminQuestionsComponent implements OnInit {

  constructor(private service: QuestionServiceService) { }

  questions: Question[]= [];

  selectedQuestion: Question | null = null;

  modalVisible: boolean= false;

onCreateQuestion(): void {
  this.selectedQuestion = null; // nueva pregunta
  this.modalVisible = true; // mostramos modal
}

onEditQuestion(question: Question): void {
  this.selectedQuestion = { ...question }; // clonamos
  this.modalVisible = true; // mostramos modal
}

onDeleteQuestion(question: Question): void {
  this.service.deleteQuestion(question.id).subscribe(() => {
    this.loadQuestions();
  });
}




onSaveQuestion(savedQuestion: Question): void {
  if (savedQuestion.id) {
    // actualizar
    this.service.updateQuestion(savedQuestion).subscribe(() => {
      this.loadQuestions();
      this.modalVisible = false;
    });
  } else {
    // crear
    this.service.createQuestion(savedQuestion).subscribe(() => {
      this.loadQuestions();
      this.modalVisible = false;
    });
  }
}

onCloseModal(): void {
  this.modalVisible = false;
}




loadQuestions(): void {
  this.service.getAllQuestions().subscribe(data => this.questions = data);
}
  

  

ngOnInit(): void {
  this.loadQuestions();
}









}
