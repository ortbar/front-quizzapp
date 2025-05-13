import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/models/question/question.model';

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.css'],
  standalone:false
})
export class QuestionTableComponent implements OnInit {

  @Input() questions: Question[] = [];

  @Output() edit = new EventEmitter<Question>();
  @Output() delete = new EventEmitter<Question>();

  constructor() { }

  ngOnInit(): void {
  }

onEdit(question: Question): void {
  this.edit.emit(question);
}

onDelete(question: Question): void {
  this.delete.emit(question);
}

}
