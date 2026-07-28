import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, data);
  }

  updateProfilePhoto(foto: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile/photo`, { foto });
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/change-password`, data);
  }
}
