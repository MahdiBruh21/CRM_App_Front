import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile';
import { Complaint } from '../models/complaint';
import { Order } from '../models/order';

export interface Customer {
  id: number;
  name: string;
  email: string;
  profile: Profile;
  address: string;
  customerType: string;
  complaints: Complaint[];
  orders: Order[];
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(`${this.baseUrl}/customers`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        })
      );
  }

  getById(id: number): Observable<Customer> {
    return this.http
      .get<Customer>(`${this.baseUrl}/customers/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customer by ID:', error);
          return throwError(() => error);
        })
      );
  }

  create(customer: Customer): Observable<Customer> {
    return this.http
      .post<Customer>(`${this.baseUrl}/customers`, customer, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error creating customer:', error);
          return throwError(() => error);
        })
      );
  }

  update(customer: Customer): Observable<Customer> {
    return this.http
      .put<Customer>(`${this.baseUrl}/customers/${customer.id}`, customer, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating customer:', error);
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/customers/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting customer:', error);
          return throwError(() => error);
        })
      );
  }
}
