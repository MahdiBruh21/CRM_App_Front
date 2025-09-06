import { ProspectStatus } from '../enums/prospect-status';
import { ProspectionType } from '../enums/prospection-type';

export interface Prospect {
  id: number;
  name: string;
  email: string | null;
  phoneNumber: string;
  prospectStatus: ProspectStatus;
  prospectionType: ProspectionType;
  prospectDetails: string;
}
