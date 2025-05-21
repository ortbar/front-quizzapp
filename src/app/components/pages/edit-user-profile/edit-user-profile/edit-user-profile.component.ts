import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiErrorResponse } from 'src/app/models/auth/api-error-response';
import { UserProfileUpdateDTO } from 'src/app/models/user/UserProfileUpdate.model';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {

  constructor(private userService: UserServiceService, private fb: FormBuilder) { }

    // visualizacion password
  showPassword = false;

  profileForm!: FormGroup;
  user!: UserProfileUpdateDTO;

  successMessage: string = '';
errorMessage: string = '';


    onSubmit() {

      if (this.profileForm.valid) {

        const formValue = { ...this.profileForm.value
        };

          // Si la contraseña está vacía, la eliminamos del objeto
      if (!formValue.password || formValue.password.trim() === '') {
        delete formValue.password;
      }

      const updatedUser = {
        ...this.user,
        ...this.profileForm.value,
        roles: this.user.roles, // aseguramos roles para que no se pierdan
      };

      this.userService.updateUserProfile(updatedUser).subscribe({
        next: (updated) => {
          this.successMessage = '✅ Perfil actualizado correctamente';
          this.errorMessage = '';
        },
        error: (err: ApiErrorResponse) => {
        this.errorMessage = `❌ ${err.message || 'Error al actualizar el perfil'}`;
        this.successMessage = '';
        },
      });
    }
  }



  ngOnInit(): void {

      this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm = this.fb.group({
          username: [
            data.username,
             [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(10)
            ]
          ],
          email: [
            data.email,
             [
              Validators.required,
              Validators.email
            ]
          ],
          password: [
            '', [
                Validators.minLength(5),
                Validators.maxLength(10)
              ]
            ], // 
        });
      }
    });
  }

    togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
