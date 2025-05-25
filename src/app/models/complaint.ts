import { ComplaintStatus } from '../enums/complaint-status';
import { ComplaintType } from '../enums/complaint-type';
import { Customer } from './customer';

export interface Complaint {
  id: number;
  customer: Customer;
  complaintType: ComplaintType;
  complaintStatus: ComplaintStatus;
  description: string;
}
