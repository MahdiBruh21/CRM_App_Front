import { ProspectionStatus } from '../enums/prospection-status';
import { Prospect } from './prospect';

export interface Prospection {
  id: number;
  prospect: Prospect;
  prospectionStatus: ProspectionStatus;
  prospectionDetails: string;
}
