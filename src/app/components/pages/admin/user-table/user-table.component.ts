import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../models/user/user.model';


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  standalone:false
})
export class UserTableComponent implements OnInit {


  // se reciben datos desde admin-users
  @Input() users: User[] = [];

  // se emiten datos al comp padre (el usuario a editar..)
  @Output() editUser = new EventEmitter<User>();

   // se emiten datos al comp padre (el usuario a eliminar..)
  @Output() deleteUser = new EventEmitter<User>();


  constructor() { }

  ngOnInit(): void {
    console.log(this.users);
    
  }

  // Método que se llamará al hacer clic en "Editar"
  onEdit(user: User): void {

    this.editUser.emit(user);
  }

  onDelete(user: User): void {
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.username}?`);
    if (confirmed) {
      this.deleteUser.emit(user);
    }
  }




}
