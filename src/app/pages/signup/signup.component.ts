import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface SignupForm {
  nome: FormControl;
  email: FormControl;
  genero: FormControl;
  data_nascimento: FormControl;
  cpf: FormControl;
  telefone: FormControl;
  senha: FormControl;
  senhaConfirm: FormControl;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    NgxMaskDirective
  ],
  providers: [
    LoginService,
    provideNgxMask()
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup<SignupForm>;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      genero: new FormControl('', [Validators.required]),
      data_nascimento: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      senhaConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup;
      const senha = formGroup.get('senha')?.value;
      const senhaConfirm = formGroup.get('senhaConfirm')?.value;
      return senha === senhaConfirm ? null : { passwordMismatch: true };
    };
  }

  submit() {
    if (this.signupForm.invalid) {
      const errors = [];

      if (this.signupForm.get('nome')?.invalid) errors.push('Nome é obrigatório (mínimo 3 caracteres)');
      if (this.signupForm.get('email')?.invalid) errors.push('Email inválido');
      if (this.signupForm.get('genero')?.invalid) errors.push('Selecione um gênero');
      if (this.signupForm.get('data_nascimento')?.invalid) errors.push('Data de nascimento é obrigatória');
      if (this.signupForm.get('cpf')?.invalid) errors.push('CPF inválido (formato: 000.000.000-00)');
      if (this.signupForm.get('telefone')?.invalid) errors.push('Telefone é obrigatório');
      if (this.signupForm.get('senha')?.invalid) errors.push('Senha deve ter no mínimo 6 caracteres');
      if (this.signupForm.get('senhaConfirm')?.invalid) errors.push('Confirme sua senha (mínimo 6 caracteres)');
      if (this.signupForm.errors?.['passwordMismatch']) errors.push('As senhas não coincidem!');

      errors.forEach(error => {
        this.toastService.error(error);
      });
      return;
    }

    const formData = {
      nome: this.signupForm.value.nome,
      email: this.signupForm.value.email,
      genero: this.signupForm.value.genero,
      data_nascimento: this.signupForm.value.data_nascimento,
      cpf: this.signupForm.value.cpf,
      telefone: this.signupForm.value.telefone,
      senha: this.signupForm.value.senha
    };

    this.isLoading = true;

    this.loginService.signup(formData).subscribe({
      next: (response) => {
        this.toastService.success("Cadastro realizado com sucesso!", "Sucesso", {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.isLoading = false;
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400) {
          if (error.error?.message) {
            this.toastService.error(error.error.message);
          } else {
            this.toastService.error("Dados inválidos! Verifique os campos.");
          }
        } else if (error.status === 500) {
          this.toastService.error("Erro no servidor! Tente novamente.");
        } else {
          this.toastService.error("Erro ao cadastrar! Verifique sua conexão.");
        }

        console.error('Erro no cadastro:', error);
      }
    });
  }

  navigate() {
    this.router.navigate(["login"]);
  }
}
