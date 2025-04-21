import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../../services/user-service.service';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  standalone: false
})
export class AdminUsersComponent implements OnInit {

  constructor(private userService: UserServiceService) {}

  users: User[] = [];

  selectedUser: User | null = null;




  ngOnInit(): void {
    // this.getAllUsers();
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios', err);
      }
    });
  }

    // Cuando hacemos clic en Editar
    onUserEdit(user: User): void {
      this.selectedUser = { ...user }; // Clonamos para evitar modificar la tabla directamente
    }

    onSaveUser(user: User): void {
      this.userService.updateUser(user).subscribe(() => {
        this.getUsers(); // Actualizamos lista
        this.selectedUser = null;
      });
    }

      // Cuando cerramos el modal sin guardar
  onCloseModal(): void {
    this.selectedUser = null;
  }


    // Recarga de usuarios
    private getUsers(): void {
      this.userService.getAllUsers().subscribe({
        next: (data) => this.users = data,
        error: (err) => console.error('❌ Error al cargar usuarios', err)
      });
    }

}
