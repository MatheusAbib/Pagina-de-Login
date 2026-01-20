import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap, catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockLoginService } from './mock-login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(
    private httpClient: HttpClient,
    private mockService: MockLoginService
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    if (environment.useMock) {
      return this.mockService.login(email, password).pipe(
        tap((value) => {
          this.saveSession(value);
        })
      );
    }

    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        this.saveSession(value);
      }),
      catchError((error) => {
        console.warn('API falhou, usando mock:', error);
        return this.mockService.login(email, password).pipe(
          tap((value) => {
            this.saveSession(value);
          })
        );
      })
    );
  }

  signup(name: string, email: string, password: string): Observable<LoginResponse> {
    if (environment.useMock) {
      return this.mockService.signup(name, email, password).pipe(
        tap((value) => {
          this.saveSession(value);
        })
      );
    }

    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password }).pipe(
      tap((value) => {
        this.saveSession(value);
      }),
      catchError((error) => {
        console.warn('API falhou, usando mock:', error);
        return this.mockService.signup(name, email, password).pipe(
          tap((value) => {
            this.saveSession(value);
          })
        );
      })
    );
  }

  private saveSession(value: LoginResponse) {
    sessionStorage.setItem("auth-token", value.token);
    sessionStorage.setItem("username", value.name);
  }
}
