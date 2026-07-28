import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCards(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cards`);
  }

  createCard(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cards`, data);
  }

  updateCard(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cards/${id}`, data);
  }

  deleteCard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${id}`);
  }
}
