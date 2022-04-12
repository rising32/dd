import axios from 'axios';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import { clientURL, projectURL, taskURL, teamURL } from './URL';

const host = process.env.REACT_APP_API_HOST;
const apiClient = axios.create({
  baseURL: host,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});

export default apiClient;

interface UserClientListState {
  user_id: number;
  clients: ClientState[];
}
export const sendGetMyClients = (user_id: number) =>
  apiClient.post<{
    user_id: number;
    clients: ClientState[];
  }>(clientURL.getMyClients, { user_id });

export const sendProjectOfCreater = (creator_id: number) =>
  apiClient.post<{
    project: ProjectState[];
  }>(projectURL.getUserProject, { creator_id });

export const sendProjectWithClientId = (creator_id: number, client_id: number) =>
  apiClient.post<{
    project: ProjectState[];
  }>(projectURL.getProjectWithClientId, { creator_id, client_id });

export const sendTaskWithProjectId = (creator_id: number, project_id: number) =>
  apiClient.post<{ task: TaskState[] }>(taskURL.getTaskListWithProjectId, { creator_id, project_id });

export const sendTeamMembers = (owner_id: number) =>
  apiClient.post<{
    owner_id: number;
    member: UserInfoState[];
  }>(teamURL.getTeamMember, { owner_id });
