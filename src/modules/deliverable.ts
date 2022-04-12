import { CarSvg, FlightSvg, TrainSvg, BusSvg, MealSvg, HotelSvg, InvitationSvg, OtherSvg } from '../assets/svg';

export interface DeliverableState {
  deliverable_id?: number | null;
  user_id: number;
  deliverable_name: string;
  task_id: number;
  periority_id: number | null;
  budget: number;
  planned_end_date: string;
  end_date: Date | null;
  is_completed: number;
}

export interface DeliverableInfoState {
  deliverable_id?: number;
  user_id: number;
  deliverable_name: string;
  task_id: number;
  task_name: string;
  periority_id: number;
  budget: number;
  planned_end_date: string;
  end_date: Date | null;
  is_completed: number;
  client_id: number;
  client_name: string;
  project_id: number;
  project_name: string;
}

export const deliverablesExpenseKind = [
  {
    key: 'car',
    name: 'Car',
    icon: CarSvg,
  },
  {
    key: 'flight',
    name: 'Flight',
    icon: FlightSvg,
  },
  {
    key: 'train',
    name: 'Train',
    icon: TrainSvg,
  },
  {
    key: 'bus',
    name: 'Bus',
    icon: BusSvg,
  },
  {
    key: 'meal',
    name: 'Meal',
    icon: MealSvg,
  },
  {
    key: 'hotel',
    name: 'Hotel',
    icon: HotelSvg,
  },
  {
    key: 'invitation',
    name: 'Invitation',
    icon: InvitationSvg,
  },
  {
    key: 'other',
    name: 'Other',
    icon: OtherSvg,
  },
];
