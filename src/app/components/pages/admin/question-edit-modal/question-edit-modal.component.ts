import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Answer } from 'src/app/models/Answer/answer.model';
import { Question } from 'src/app/models/question/question.model';

@Component({
  selector: 'app-question-edit-modal',
  templateUrl: './question-edit-modal.component.html',
  styleUrls: ['./question-edit-modal.component.css'],
  standalone: false
})
export class QuestionEditModalComponent implements OnInit {

  @Input() question: Question | null = null;
  @Input() visible: boolean = false;

  @Output() saveQuestion = new EventEmitter<Question>();
  @Output() closeModal = new EventEmitter<void>();

  questionForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && !this.question) {
      this.initForm(); // Crear nueva pregunta → formulario limpio
    }

    if (changes['question'] && this.question) {
      this.initForm(); // Editar pregunta existente
    }
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      textoPregunta: [this.question?.textoPregunta || '', Validators.required],
      answers: this.fb.array([],)
    });

    this.answers.clear();

    if (this.question?.answers?.length) {
      this.question.answers.forEach(ans => this.addAnswer(ans));
    } else {
      for (let i = 0; i < 3; i++) {
        this.addAnswer();
      }
    }
  }

  addAnswer(answer?: Answer): void {
    if (this.answers.length >= 3) return;

    const control = this.fb.group({
      answerText: [answer?.answerText || '', Validators.required],
      esCorrecta: [answer?.esCorrecta || false]
    });

    // Escuchar cambios para que solo una sea correcta

    const esCorrectaControl = control.get('esCorrecta');
    (esCorrectaControl?.valueChanges as Observable<boolean>).subscribe((checked: boolean) => {
      if (checked) {
        this.answers.controls.forEach(ctrl => {
          if (ctrl !== control) {
            ctrl.get('esCorrecta')?.setValue(false, { emitEvent: false });
          }
        });
      }
    });

    this.answers.push(control);
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 3) {
      this.answers.removeAt(index);
    }
  }

  hasCorrectAnswer(): boolean {
    return this.answers.controls.filter(ctrl => ctrl.get('esCorrecta')?.value).length === 1;
  }

  noExactDuplicateAnswersValidator(formArray: FormArray) {
    const texts = formArray.controls.map(ctrl => ctrl.get('answerText')?.value?.trim());
    const hasDuplicates = texts.some((text, i) => texts.indexOf(text) !== i);
    return hasDuplicates ? { exactDuplicateAnswers: true } : null;
  }

  onSave(): void {
    if (this.questionForm.invalid) return;
    if (this.answers.length !== 3) return;
    if (!this.hasCorrectAnswer()) return;

    const formValue = this.questionForm.value;

    const result: Question = {
      id: this.question?.id || 0,
      textoPregunta: formValue.textoPregunta.trim(),
      answers: formValue.answers.map((a: any, index: number) => ({
        id: this.question?.answers?.[index]?.id || 0,
        answerText: a.answerText.trim(),
        esCorrecta: a.esCorrecta
      }))
    };

    this.saveQuestion.emit(result);
  }

  onClose(): void {
    this.closeModal.emit();
  }


}
