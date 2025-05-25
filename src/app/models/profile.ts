import { Customer } from './customer';

export interface Profile {
  id: number;
  facebookLink: string;
  instagramLink: string;
  customer: Customer;
}
