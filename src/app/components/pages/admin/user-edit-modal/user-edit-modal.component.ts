import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user.model';


@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.css'],
  standalone: false
})

export class UserEditModalComponent implements OnInit {



  successMessage: string | null = null;
  errorMessage: string | null = null;

  // visualizacion password
  showPassword = false;

  //recibimos el usuario a editar.
  @Input() user!: User;

  // clic en "Guardar", enviamos el usuario editado.
  @Output() save = new EventEmitter<User>();

  //cuando se cierra el modal, avisamos al padre.
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  availableRoles: string[] = ['USER', 'ADMIN'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {



    this.form = this.fb.group({
      username: [
        this.user.username,
        [ Validators.required, Validators.minLength(5), Validators.maxLength(10)],
      ],
      email: [
        this.user.email, [Validators.required, Validators.email]
      ],
      password: [
        this.user.password, Validators.maxLength(10)
      ],
      enabled: [this.user.enabled],
      roles: this.fb.array(
        this.availableRoles.map(
          role => this.fb.control(
            this.user.roles.includes(role)
          )
        ),
        this.minSelectedCheckboxes(1) // Al menos un rol
      )
    });
  }



  minSelectedCheckboxes(min = 1): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map(ctrl => ctrl.value)
        .reduce((prev, next) => next ? prev + 1 : prev, 0);

      return totalSelected >= min ? null : { required: true };
    };
  }


  get rolesFormArray(): FormArray {
    return this.form.get('roles') as FormArray;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }



  onSave() {

    const passwordControl = this.form.get('password');
    const passwordValue = passwordControl?.value;


    if (passwordValue && passwordValue.length < 5) {
      this.setErrorMessage('Password no válida. Mínimo 5 caracteres.');
      return;
    }


    if (this.form.invalid) {
      this.setErrorMessage('Por favor corrige los errores antes de guardar.');
      return;
    }



    const selectedRoles = this.availableRoles
      .filter((_, index) => this.rolesFormArray.at(index).value);



    const updatedUser: User = {
      ...this.user,
      ...this.form.value,
      password: passwordValue || this.user.password,
      roles: selectedRoles
    };

    this.save.emit(updatedUser);

  }

  onDelete(){

  }

  onClose() {
    this.close.emit();
  }

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
  }

  // logica eleccion rol
  toggleRole(role: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.user.roles.includes(role)) {
        this.user.roles.push(role);
      }
    } else {
      this.user.roles = this.user.roles.filter(r => r !== role);
    }
  }


  //cada vez que el usuario marca o desmarca un checkbox// Recibe si el chekcbox se ha marcado y el cual (el rol) y llama a toogle, que añade el rol marcado
  onRoleChange(event: Event, role: string): void {
    const input = event.target as HTMLInputElement;
    this.toggleRole(role, input.checked);
  }





}
