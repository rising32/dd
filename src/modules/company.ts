import { UserInfoState } from './user';

export interface CompanyInfoState {
  admin_info: UserInfoState;
  client_count: number;
  company_id: number;
  company_name: string;
  currency: number;
  member_count: number;
  project_count: number;
  task_count: number;
  time_format: string;
}
