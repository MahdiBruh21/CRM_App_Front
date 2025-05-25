import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private get httpOptions() {
    return { withCredentials: true };
  }

  // Get all profiles
  getAll(): Observable<Profile[]> {
    return this.http.get<Profile[]>(
      `${this.baseUrl}/profiles`,
      this.httpOptions
    );
  }

  // Get a profile by id
  getById(id: number): Observable<Profile> {
    return this.http.get<Profile>(
      `${this.baseUrl}/profiles/${id}`,
      this.httpOptions
    );
  }

  // Create a new profile
  create(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(
      `${this.baseUrl}/profiles`,
      profile,
      this.httpOptions
    );
  }

  // Update an existing profile
  update(id: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(
      `${this.baseUrl}/profiles/${id}`,
      profile,
      this.httpOptions
    );
  }

  // Delete a profile by id
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/profiles/${id}`,
      this.httpOptions
    );
  }
}
