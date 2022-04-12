export interface PriorityState {
  wp_id?: number | null;
  user_id: number;
  week: number;
  priority: string;
  goal: string;
  detail: string | null;
  is_completed: number;
  is_weekly: null;
  end_date: Date | null;
}
