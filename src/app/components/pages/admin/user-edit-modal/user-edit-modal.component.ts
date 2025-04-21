import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user/user.model';


@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.css'],
  standalone:false
})
export class UserEditModalComponent implements OnInit {

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
    this.save.emit(this.user);
  }

  onClose(){
    this.close.emit();
  }

}
