import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone:false
})
export class SidebarComponent implements OnInit {

  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // 'ADMIN' o 'USER'
  }

  logout() {
    this.authService.logout();
  }

}
