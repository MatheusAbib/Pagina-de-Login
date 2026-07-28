import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordModalComponent } from '../../components/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    ForgotPasswordModalComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  showForgotPasswordModal = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(){
    if (this.loginForm.invalid) {
      const errors = [];

      if (this.loginForm.get('email')?.invalid) {
        errors.push('Email inválido');
      }
      if (this.loginForm.get('password')?.invalid) {
        errors.push('Senha deve ter no mínimo 6 caracteres');
      }

      errors.forEach(error => {
        this.toastService.error(error);
      });
      return;
    }

    this.isLoading = true;

    this.loginService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: () => {
        this.toastService.success("Login realizado com sucesso!", "Bem-vindo!", {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
        setTimeout(() => {
          this.loginForm.reset();
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.toastService.error("Email ou senha inválidos! Tente novamente.");
        } else if (error.status === 400) {
          this.toastService.error("Preencha todos os campos corretamente!");
        } else if (error.status === 500) {
          this.toastService.error("Erro no servidor! Tente novamente.");
        } else {
          this.toastService.error("Erro ao fazer login! Verifique sua conexão.");
        }

        console.error('Erro no login:', error);
      }
    });
  }

  navigate(){
    this.router.navigate(["/signup"]);
  }

  openForgotPassword() {
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.get('email')?.setValue('');
    this.loginForm.get('password')?.setValue('');
    this.showForgotPasswordModal = true;
  }

  closeForgotPassword() {
    this.showForgotPasswordModal = false;
  }
}
