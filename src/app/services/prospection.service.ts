import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prospection } from '../models/prospection';

@Injectable({
  providedIn: 'root',
})
export class ProspectionService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prospection[]> {
    return this.http.get<Prospection[]>(`${this.baseUrl}/prospections`, {
      withCredentials: true,
    });
  }

  getById(id: number): Observable<Prospection> {
    return this.http.get<Prospection>(`${this.baseUrl}/prospections/${id}`, {
      withCredentials: true,
    });
  }

  create(prospection: Prospection): Observable<Prospection> {
    return this.http.post<Prospection>(
      `${this.baseUrl}/prospections`,
      prospection,
      { withCredentials: true }
    );
  }

  update(id: number, prospection: Prospection): Observable<Prospection> {
    return this.http.put<Prospection>(
      `${this.baseUrl}/prospections/${id}`,
      prospection,
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/prospections/${id}`, {
      withCredentials: true,
    });
  }
}
