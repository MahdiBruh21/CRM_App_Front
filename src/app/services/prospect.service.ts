import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prospect } from '../models/prospect';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(`${this.baseUrl}/prospects`, {
      withCredentials: true,
    });
  }

  getById(id: number): Observable<Prospect> {
    return this.http.get<Prospect>(`${this.baseUrl}/prospects/${id}`, {
      withCredentials: true,
    });
  }

  create(prospect: Prospect): Observable<Prospect> {
    return this.http.post<Prospect>(`${this.baseUrl}/prospects`, prospect, {
      withCredentials: true,
    });
  }

  update(id: number, prospect: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(
      `${this.baseUrl}/prospects/${id}`,
      prospect,
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/prospects/${id}`, {
      withCredentials: true,
    });
  }
}
