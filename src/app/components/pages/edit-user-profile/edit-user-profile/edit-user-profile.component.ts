import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
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
  showPasswordFields = false;

  profileForm!: FormGroup;
  user!: UserProfileUpdateDTO;

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm = this.fb.group({
          username: [
            data.username,
            [Validators.required, Validators.minLength(5), Validators.maxLength(10)]
          ],
          email: [
            data.email,
            [Validators.required, Validators.email]
          ],
          currentPassword: [''],
          newPassword: ['', [Validators.minLength(5), Validators.maxLength(10)]],
          repeatNewPassword: ['']
        }, { validators: this.passwordsMatchValidator });
      }
    });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const newPassword = group.get('newPassword')?.value;
    const repeatNewPassword = group.get('repeatNewPassword')?.value;
    if (newPassword && repeatNewPassword && newPassword !== repeatNewPassword) {
      group.get('repeatNewPassword')?.setErrors({ mismatch: true });
    } else {
      group.get('repeatNewPassword')?.setErrors(null);
    }
    return null;
  };

  onSubmit() {
    if (this.profileForm.valid) {
      const formValue = { ...this.profileForm.value };
      const payload = {
        email: formValue.email,
        username: formValue.username,
        currentPassword: formValue.currentPassword || '',
        newPassword: formValue.newPassword || '',
        repeatNewPassword: formValue.repeatNewPassword || ''
      };
      this.userService.updateUserProfile(payload).subscribe({
        next: (updated) => {
          this.successMessage = '✅ Perfil actualizado correctamente';
          this.errorMessage = '';
        },
        error: (err: any) => {
          // Manejo robusto de errores para backend spring
          if (err && (err.status === 401 || err.status === 403)) {
            this.errorMessage = '❌ Contraseña actual incorrecta.';
          } else if (err && err.status === 400 && err.message?.toLowerCase().includes('contraseña')) {
            this.errorMessage = '❌ ' + err.message;
          } else if (err && err.status === 500 && err.message?.toLowerCase().includes('bad credentials')) {
            this.errorMessage = '❌ Contraseña actual incorrecta.';
          } else if (err && err.status === 500 && err.message?.toLowerCase().includes('password')) {
            this.errorMessage = '❌ ' + err.message;
          } else {
            this.errorMessage = `❌ ${err.message || 'Error al actualizar el perfil'}`;
          }
          this.successMessage = '';
        },
      });
    }
  }

  clearControlErrors(controlName: string) {
    const control = this.profileForm.get(controlName);
    if (control) {
      control.setErrors(null);
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  togglePasswordChange() {
    this.showPasswordFields = !this.showPasswordFields;
    if (!this.showPasswordFields) {
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      });
      this.clearControlErrors('currentPassword');
      this.clearControlErrors('newPassword');
      this.clearControlErrors('repeatNewPassword');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}