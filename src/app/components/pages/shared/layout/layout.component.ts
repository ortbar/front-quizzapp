import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../siderbar/sidebar/sidebar.component";
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone:false,

})
export class LayoutComponent implements OnInit {

 constructor(private authService: AuthService, private router: Router,private userService: UserServiceService) {}

 welcomeMessage = "";

  ngOnInit(): void {
      this.userService.getUserProfile().subscribe({
    next: (user) => {
      this.welcomeMessage = `Bienvenido, ${user.username}!`;
    },
    error: () => {
      this.welcomeMessage = 'Bienvenido!';
    }
  });
  }

  logout() {
    this.authService.logout();
  }

}
