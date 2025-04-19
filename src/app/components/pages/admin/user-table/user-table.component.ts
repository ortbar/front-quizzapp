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

  // se emiten datos (el usuario a editar..)


  constructor() { }

  ngOnInit(): void {
    console.log(this.users);
    
  }

  // Método que se llamará al hacer clic en "Editar"


  // onDelete(user){

  // }

}
