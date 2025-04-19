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

  // getAllUsers() {
  //   this.loading = true;
  //   this.userService.getAllUsers().subscribe({
  //     next: (data: User[]) => {
  //       this.users = data;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('❌ Error al cargar usuarios:', err);
  //       this.errorMessage = 'No se pudieron cargar los usuarios. Intente más tarde.';
  //       this.loading = false;
  //     }
  //   });
  // }

}
