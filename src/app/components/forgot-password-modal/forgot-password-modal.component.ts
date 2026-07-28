import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.scss'
})
export class ForgotPasswordModalComponent {
  @Output() close = new EventEmitter<void>();

  emailForm: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor(
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      if (this.emailForm.get('email')?.hasError('required')) {
        this.toastService.error('Email é obrigatório');
      } else if (this.emailForm.get('email')?.hasError('email')) {
        this.toastService.error('Email inválido');
      }
      return;
    }

    this.isLoading = true;
    this.loginService.forgotPassword(this.emailForm.value.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.emailSent = true;
        this.toastService.clear();
        setTimeout(() => {
          this.toastService.success('Link de recuperação enviado para seu email!');
        }, 100);
        console.log('Token:', response.token);
        console.log('Link:', response.resetLink);
        setTimeout(() => {
          this.close.emit();
          this.emailForm.reset();
          this.emailSent = false;
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error(error.error?.message || 'Erro ao enviar link de recuperação');
      }
    });
  }

  onClose() {
    this.emailForm.reset();
    this.emailSent = false;
    this.close.emit();
  }
}
