import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { LoginResponse } from '../types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class MockLoginService {
  private users = [
    {
      email: 'teste@teste.com',
      password: '123456',
      name: 'Usuário Teste',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.test'
    },
    {
      email: 'admin@admin.com',
      password: 'admin123',
      name: 'Administrador',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.admin'
    }
  ];

  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.users.find(u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
        );

        if (user) {
          observer.next({
            name: user.name,
            token: user.token
          });
          observer.complete();
        } else {
          observer.error({
            status: 401,
            message: 'Email ou senha incorretos'
          });
        }
      }, 800);
    });
  }

  signup(name: string, email: string, password: string): Observable<LoginResponse> {
  return new Observable(observer => {
    setTimeout(() => {
      const userExists = this.users.find(u =>
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        observer.error({
          status: 400,
          message: 'Este email já está cadastrado'
        });
        return;
      }

      if (password.length < 6) {
        observer.error({
          status: 400,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
        return;
      }

      if (name.length < 3) {
        observer.error({
          status: 400,
          message: 'O nome deve ter pelo menos 3 caracteres'
        });
        return;
      }

      const newUser = {
        name,
        email,
        password,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.${Date.now()}`
      };

      this.users.push(newUser);
      this.saveToStorage();

      observer.next({
        name: newUser.name,
        token: newUser.token
      });
      observer.complete();

    }, 1000);
  });
}

  constructor() {
  this.loadFromStorage();
}

private loadFromStorage() {
  const savedUsers = localStorage.getItem('mockUsers');
  if (savedUsers) {
    this.users = JSON.parse(savedUsers);
  }
}

private saveToStorage() {
  localStorage.setItem('mockUsers', JSON.stringify(this.users));
}

clearMockData() {
  this.users = [
    {
      email: 'teste@teste.com',
      password: '123456',
      name: 'Usuário Teste',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token.test'
    }
  ];
  this.saveToStorage();
}
}
