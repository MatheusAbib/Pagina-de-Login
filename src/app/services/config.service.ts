import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getLogo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config/logo`);
  }

  updateLogo(logo: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/config/logo`, { logo });
  }
}
