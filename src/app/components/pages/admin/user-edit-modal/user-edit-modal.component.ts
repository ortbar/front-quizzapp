import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user/user.model';


@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.css'],
  standalone:false
})
export class UserEditModalComponent implements OnInit {

  availableRoles: string[] = ['USER', 'ADMIN'];


  successMessage: string | null = null;
  errorMessage: string | null = null;

  //recibimos el usuario a editar.
  @Input() user!: User;

  // clic en "Guardar", enviamos el usuario editado.
  @Output() save = new EventEmitter<User>();

  //cuando se cierra el modal, avisamos al padre.
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onSave() {



    this.setErrorMessage('');
    this.save.emit(this.user);
  }

  onClose(){
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

  //
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
