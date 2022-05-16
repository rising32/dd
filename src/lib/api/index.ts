import axios from 'axios';
import { ClientState, UserClientState } from '../../modules/client';
import { CompanyInfoState, CompanyState } from '../../modules/company';
import { DeliverableInfoState, DeliverableState } from '../../modules/deliverable';
import { ClientProjectState, ProjectState, StatisticTableState } from '../../modules/project';
import { WorkSettingState } from '../../modules/setting';
import { CPMDState, TaskAssignState, TaskState } from '../../modules/task';
import { CompanyMemberState } from '../../modules/team';
import { UserInfoState } from '../../modules/user';
import { PriorityState } from '../../modules/weekPriority';
import { clientURL, companyURL, deliverableURL, priorityURL, projectURL, taskURL, userURL } from './URL';

const host = process.env.REACT_APP_API_HOST;
const apiClient = axios.create({
  baseURL: host,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

export default apiClient;

///////////////////////////////    User          ////////////////////////
export const sendUserAll = () => apiClient.get<UserInfoState[]>(userURL.allUsers);
export const sendUpdateUser = (params: UserInfoState) => apiClient.post<UserInfoState>(userURL.updateUser, params);
export const sendCompanyProfile = (member_id: number) =>
  apiClient.post<{ company: CompanyInfoState }>(userURL.companyProfile, { member_id });

export const sendCreateWorkSetting = (params: WorkSettingState[]) => apiClient.post<WorkSettingState[]>(userURL.createWorkSetting, params);
export const sendGetWorkSetting = (user_id: number) => apiClient.post<WorkSettingState[]>(userURL.getWorkSetting, { user_id });
export const sendUpdateWorkSetting = (params: WorkSettingState) => apiClient.post<WorkSettingState>(userURL.updateWorkSetting, params);

//////////////////////////////         Client            ///////////////
export const sendCreateClient = (client_name: string, is_active: boolean) =>
  apiClient.post<ClientState>(clientURL.createClient, { client_name, is_active });
export const sendGetMyClients = (user_id: number) =>
  apiClient.post<{
    user_id: number;
    clients: ClientState[];
  }>(clientURL.getMyClients, { user_id });

export const sendGetCompanyClients = (company_id: number) =>
  apiClient.post<{
    user_id: number;
    clients: ClientState[];
  }>(clientURL.getCompanyClients, { company_id });

export const sendRegisterMyClient = (user_id: number, client_id: number, is_active: boolean) =>
  apiClient.post<UserClientState>(clientURL.registerMyClient, { user_id, client_id, is_active });

export const sendUpdateClient = (params: ClientState) => apiClient.post<ClientState>(clientURL.updateClient, params);

/////////////////////            Project                ///////////////////////////////
export const sendCreateProject = (params: { creator_id: number; project_name: string; company_id: number }) =>
  apiClient.post<ProjectState>(projectURL.createProject, params);
export const sendUpdateProject = (params: ProjectState) => apiClient.post<ProjectState>(projectURL.updateProject, params);

export const sendMyProject = (user_id: number) =>
  apiClient.post<{
    project: ProjectState[];
  }>(projectURL.myProject, { user_id });
export const sendProjectOfCreater = (creator_id: number) =>
  apiClient.post<{
    project: ProjectState[];
  }>(projectURL.getUserProject, { creator_id });

export const sendProjectWithClientId = (company_id: number, client_id: number) =>
  apiClient.post<{
    project: ProjectState[];
  }>(projectURL.getProjectWithClientId, { company_id, client_id });

////////////////////////////////   Task  ///////////////////////////////////

export const sendCreateTask = (params: {
  task_id: null;
  creator_id: number;
  project_id?: number;
  task_name: string;
  description: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string;
  actual_end_date: string;
  hourly_rate: number;
  is_add_all: boolean;
  is_active: boolean;
  is_deleted: number;
  company_id: number;
}) => apiClient.post<{ task: TaskState }>(taskURL.createTask, params);

export const getUserTasks = (creator_id: number) => apiClient.post<{ task: TaskState[] }>(taskURL.getUserTask, { creator_id });
export const getMyTasks = (user_id: number) => apiClient.post<{ task: TaskState[] }>(taskURL.getMyTask, { user_id });

export const sendTaskWithProjectId = (company_id: number, project_id: number) =>
  apiClient.post<{ task: TaskState[] }>(taskURL.getTaskListWithProjectId, { company_id, project_id });

export const sendSetClient = (client_id: number, project_id: number) =>
  apiClient.post<ClientProjectState>(projectURL.setClient, { client_id, project_id });

export const sendUpdateTask = (params: {
  task_id: number | null;
  creator_id: number;
  project_id: number | null;
  task_name: string;
  description: string | null;
  planned_start_date: string | null;
  planned_end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  hourly_rate: number;
  is_add_all: boolean;
  is_active: boolean;
  is_deleted: number;
}) => apiClient.post<TaskState>(taskURL.updateTask, params);

interface UCTPParams {
  member_id?: number;
  client_id?: number;
  project_id?: number;
  planned_end_date?: Date;
}

export const sendTasksWithCPMD = (params: UCTPParams) => apiClient.post<CPMDState[]>(taskURL.getTasksWithCPMD, params);
export const sendDeveloperToTask = (params: TaskAssignState) => apiClient.post<{ task: TaskState }>(taskURL.setDeveloperToTask, params);

///////////////////// Priority     ///////////////////////
export const sendPriorityByWeek = (user_id: number, week: number) =>
  apiClient.post<{
    user_id: number;
    priority: PriorityState[];
  }>(priorityURL.getPriorityByWeek, { user_id, week });

export const sendCreatePriority = (params: PriorityState) => apiClient.post<PriorityState>(priorityURL.createPriority, params);
export const sendUpdatePriority = (params: {
  wp_id: number;
  user_id: number;
  week: number;
  priority: string;
  project_id?: number;
  goal: string;
  detail: string | null;
  is_completed: number;
  is_weekly: number;
  end_date: string;
}) => apiClient.post<PriorityState>(priorityURL.updatePriority, params);

export const sendPastNotAchievedPriorities = (user_id: number, week: number) =>
  apiClient.post<{
    user_id: number;
    priority: PriorityState[];
  }>(priorityURL.getPastNotAchievedPriorities, { user_id, week });

export const sendMyBeforePriorities = (user_id: number, week: number) =>
  apiClient.post<{
    user_id: number;
    priority: PriorityState[];
  }>(priorityURL.getMyBeforePriorities, { user_id, week });

////////////////////////////  Deliverable   ////////////////////////
export const sendCreateDeliverable = (params: DeliverableState) =>
  apiClient.post<DeliverableState>(deliverableURL.createDeliverable, params);
export const sendUpdateDeliverable = (params: DeliverableState) =>
  apiClient.post<DeliverableState>(deliverableURL.updateDeliverable, params);

export const sendDeliverableInfo = (deliverable_id: number) =>
  apiClient.post<{ data: DeliverableInfoState }>(deliverableURL.deliverableInfo, { deliverable_id });

export const sendDeliverablesWithPlanedDate = (user_id: number, planned_end_date: Date) =>
  apiClient.post<{
    user_id: number;
    deliverable: DeliverableState[];
  }>(deliverableURL.getDeliverablesWithPlanedDate, { user_id, planned_end_date });

/////////////////////////  Statistics     /////////////////////
export const sendWeekStaticsticsData = (user_id: number) =>
  apiClient.post<{ data: StatisticTableState[] }>(projectURL.getWeekStaticsticsData, { user_id });
export const sendMonthStaticsticsData = (user_id: number) =>
  apiClient.post<{ data: StatisticTableState[] }>(projectURL.getMonthStaticsticsData, { user_id });

///////////////////////////////    Company          ////////////////////////
export const sendUpdateCompany = (params: CompanyState) => apiClient.post<CompanyState>(companyURL.updateCompany, params);

export const sendCompanyMembers = (user_id: number) =>
  apiClient.post<{
    owner_id: number;
    member: CompanyMemberState[];
  }>(companyURL.getCompanyMembers, { user_id });

export const sendAddMember = (params: CompanyMemberState) => apiClient.post<CompanyMemberState>(companyURL.addCompanyMember, params);
export const sendUpdateCompanyMember = (params: CompanyMemberState) =>
  apiClient.post<CompanyMemberState>(companyURL.updateCompanyMember, params);
