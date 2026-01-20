import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm!: FormGroup;
  isLoading: boolean = false;

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
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      this.toastService.error("Preencha todos os campos corretamente!");
      return;
    }

    this.isLoading = true;

    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        this.toastService.success("Login feito com sucesso!");

        setTimeout(() => {
          this.loginForm.reset();
          this.isLoading = false;
        }, 1500);
      },
      error: () => {
        this.toastService.error("Erro! Tente novamente");
        this.isLoading = false;
      }
    });
  }

  navigate(){
    this.router.navigate(["/signup"]);
  }
}
