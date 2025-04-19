import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../siderbar/sidebar/sidebar.component";
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone:false,

})
export class LayoutComponent implements OnInit {

 constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

}
