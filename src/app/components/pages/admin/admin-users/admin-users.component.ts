import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../../../../services/user-service.service';
import { User } from '../../../../models/user/user.model';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';

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

  @ViewChild(UserEditModalComponent) editModalRef!: UserEditModalComponent






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
      this.userService.updateUser(user).subscribe({
        next: (updatedUser) => {
          console.log('✅ Usuario actualizado:', updatedUser);
          this.editModalRef.setSuccessMessage('✅ Usuario actualizado con éxito');
          // Limpia error anterior
          this.selectedUser = null;
          this.getUsers();
        },
        error: (err: Error) => {
          console.error('❌ Error actualizando usuario:', err);
          
          this.editModalRef.setErrorMessage(err.message);
       
        }
      });
    }

    onDeleteUser(user: User): void {
      // Aquí llamas al servicio para eliminarlo en backend
      this.userService.deleteUser(user.id).subscribe(
        () => {
          // Actualiza la lista local de usuarios, por ejemplo filtrando:
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error => {
          console.error('Error al eliminar usuario:', error);
        }
      );
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
