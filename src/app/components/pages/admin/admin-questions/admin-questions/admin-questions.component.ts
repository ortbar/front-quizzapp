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
 
  //paginacion

  // pageSizeOptions: number[] = [5, 10, 20];

 
  currentPage = 0;
  pageSize = 5;

  totalPages = 0;
  totalElements = 0;



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
  this.service.getPaginatedQuestions(this.currentPage, this.pageSize).subscribe(response => {
    this.questions = response.content;
    this.totalPages = response.totalPages;
    this.totalElements = response.totalElements;
    this.currentPage = response.number;
  });
}

// metodos para cambiar d pagina

onPageSizeChange(): void {
  this.currentPage = 0; // Reseteamos a la primera página
  this.loadQuestions(); // Volvemos a cargar
}

goToPage(page: number): void {
  if (page >= 0 && page < this.totalPages) {
    this.currentPage = page;
    this.loadQuestions();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadQuestions();
  }
}

previousPage(): void {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadQuestions();
  }
}
  

  

ngOnInit(): void {
  this.loadQuestions();

}






}










