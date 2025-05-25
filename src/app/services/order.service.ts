import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.baseUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, {
      withCredentials: true,
    });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(orderData: {
    customerId: number;
    orderDate: string;
    price: number;
    orderStatus: string;
    orderDetails: string;
  }): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderData, {
      withCredentials: true,
    });
  }

  update(
    id: number,
    orderData: {
      customerId: number;
      orderDate: string;
      price: number;
      orderStatus: string;
      orderDetails: string;
    }
  ): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, orderData, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
