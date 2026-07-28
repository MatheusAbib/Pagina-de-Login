import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, senha: password })
      .pipe(
        tap((response: any) => this.saveSession(response))
      );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  private saveSession(response: any) {
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
  }

  updateUser(user: any) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any | null {
    try {
      const user = localStorage.getItem('user');
      if (user && user !== 'undefined' && user !== 'null') {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error('Erro ao parsear usuário:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
