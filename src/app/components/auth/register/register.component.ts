import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone:false
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  backendErrorMessage: string = '';

  ngOnInit(): void {
  }

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password:['', [Validators.required, Validators.minLength(5)]]
    });
   }


   onSubmit(): void {

    this.backendErrorMessage = '';

    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.authService.register(this.registerForm.value).subscribe({
      next:(response) => {
        console.log("usuario registrado", response),
        this.router.navigate(["/login"])
      },
      error:(err) => {
        if (err instanceof Error )  {
          // Error personalizado del backend
          this.backendErrorMessage = err.message;
        } else {
          // En caso de que el error no sea un error estándar
          this.backendErrorMessage = 'Error desconocido';
        }
      }
    })


   }







}
