import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private apiUrl = `${environment.baseUrl}/complaints`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(complaint: Complaint): Observable<Complaint> {
    if (!complaint.customer?.id) {
      throw new Error('Customer ID is required');
    }
    return this.http.post<Complaint>(
      this.apiUrl,
      {
        customerId: complaint.customer.id,
        complaintType: complaint.complaintType,
        complaintStatus: complaint.complaintStatus,
        description: complaint.description,
      },
      { withCredentials: true }
    );
  }

  update(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(
      `${this.apiUrl}/${id}`,
      {
        customerId: complaint.customer?.id,
        complaintType: complaint.complaintType,
        complaintStatus: complaint.complaintStatus,
        description: complaint.description,
      },
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
