export interface TaskState {
  task_id: number | null;
  creator_id: number;
  project_id: number | null;
  task_name: string;
  description: string;
  planned_start_date: string | null;
  planned_end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  hourly_rate: number;
  is_add_all: boolean;
  is_active: boolean;
  is_deleted: number;
}

export interface PriorityTaskState {
  client_id: number;
  client_name: string;
  task: TaskState[];
}

export interface TaskAssignState {
  assign_id: number | null;
  task_id: number;
  member_id: number;
  role_id: number;
}
