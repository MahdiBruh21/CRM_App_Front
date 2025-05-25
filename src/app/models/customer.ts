import { Complaint } from './complaint';
import { Order } from './order';
import { Profile } from './profile';

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
