import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Adicione esta linha
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface SignupForm{
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    FooterComponent
  ],
  providers: [
    LoginService
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
  ){
    this.signupForm = new FormGroup({
      name: new FormControl('',  [Validators.required, Validators.minLength(3)]),
      email: new FormControl('',  [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl ('', [Validators.required, Validators.minLength(6)])
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const passwordConfirm = formGroup.get('passwordConfirm')?.value;

      return password === passwordConfirm ? null : { passwordMismatch: true };
    };
  }

 submit(){
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });

      if (this.signupForm.hasError('passwordMismatch')) {
        this.toastService.error("As senhas não coincidem!");
      } else {
        this.toastService.error("Preencha todos os campos corretamente!");
      }
      return;
    }

    // ATIVA O SPINNER
    this.isLoading = true;

    this.loginService.signup(
      this.signupForm.value.name!,
      this.signupForm.value.email!,
      this.signupForm.value.password!
    ).subscribe({
      next: () => {
        this.toastService.success("Cadastrado com sucesso!");

        setTimeout(() => {
          this.router.navigate(["login"]);
          this.isLoading = false;
        }, 1500);

        this.signupForm.reset();
        Object.keys(this.signupForm.controls).forEach(key => {
          const control = this.signupForm.get(key);
          control?.markAsUntouched();
          control?.markAsPristine();
        });
      },
      error: (error) => {
        console.error('Erro no cadastro:', error);
        this.isLoading = false;

        if (error.status === 400) {
          this.toastService.error("Email já cadastrado!");
        } else {
          this.toastService.error("Erro! Tente novamente");
        }
      }
    });
  }

  navigate(){
    this.router.navigate(["login"]);
  }
}
