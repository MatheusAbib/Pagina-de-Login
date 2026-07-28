import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<void>();

  isLoading = false;
  passwordForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastService: ToastrService
  ) {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.toastService.error('Preencha todos os campos corretamente');
      return;
    }

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.toastService.error('As senhas não coincidem');
      return;
    }

    console.log('Enviando requisição para trocar senha...');
    console.log('Dados:', {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    });

    this.isLoading = true;
    this.userService.changePassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    }).subscribe({
      next: (response) => {
        console.log('Resposta do servidor:', response);
        this.toastService.success('Senha alterada com sucesso!');
        this.isLoading = false;
        this.passwordChanged.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
        this.toastService.error(error.error?.message || 'Erro ao alterar senha!');
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
