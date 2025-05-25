/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.baseUrl}/data`);
  }
}
 */
