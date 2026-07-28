import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses`);
  }

  createAddress(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addresses`, data);
  }

  updateAddress(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/addresses/${id}`, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${id}`);
  }
}
