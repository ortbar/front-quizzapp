import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../siderbar/sidebar/sidebar.component";
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { UserProfileUpdateDTO } from 'src/app/models/user/UserProfileUpdate.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone:false,

})
export class LayoutComponent implements OnInit {

 constructor(public authService: AuthService, public router: Router,private userService: UserServiceService) {}

 welcomeMessage = "";

  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
    this.authService.setCurrentUserFromToken(token);  // decodifica y setea desde el token

        this.authService.currentUser$.subscribe((user: UserProfileUpdateDTO | null) => {
      if (user) {
        this.welcomeMessage = `Bienvenido, ${user.sub}`; // 'sub' es el username en JWT
        console.log("Usuario actual en Layout:", user);
      } else {
        this.welcomeMessage = "";
      }
    });
}
  }

  logout() {
    this.authService.logout();
  }

}
