import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordModalComponent } from '../../components/change-password-modal/change-password-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangePasswordModalComponent,
    FooterComponent,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  user: any;
  showChangePassword = false;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.user = this.loginService.getUser();
    this.profileForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      genero: new FormControl(''),
      data_nascimento: new FormControl(''),
      cpf: new FormControl(''),
      telefone: new FormControl('')
    });
  }

  ngOnInit() {
    if (this.user) {
      this.profileForm.patchValue({
        nome: this.user.nome || '',
        email: this.user.email || '',
        genero: this.user.genero || '',
        data_nascimento: this.user.data_nascimento || '',
        cpf: this.user.cpf || '',
        telefone: this.user.telefone || ''
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.toastService.error('Preencha todos os campos corretamente');
      return;
    }

    this.isLoading = true;
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.toastService.success('Perfil atualizado com sucesso!');
        this.loginService.updateUser(response.user);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error(error.error?.message || 'Erro ao atualizar perfil!');
        this.isLoading = false;
      }
    });
  }

  openChangePassword() {
    this.showChangePassword = true;
  }

  closeChangePassword() {
    this.showChangePassword = false;
  }

  onPasswordChanged() {
    this.toastService.success('Senha alterada com sucesso!');
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
