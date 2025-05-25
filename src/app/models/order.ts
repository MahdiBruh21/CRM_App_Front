import { OrderStatus } from '../enums/order-status';
import { Customer } from './customer';

export interface Order {
  id: number;
  customer: Customer;
  price: number;
  orderDate: string;
  orderStatus: OrderStatus;
  orderDetails: string;
}
