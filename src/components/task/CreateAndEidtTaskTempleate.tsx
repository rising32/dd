import React from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateTask, sendUpdateTask } from '../../lib/api';
import { RootState, useAppDispatch } from '../../store';
import { changeProjectCount } from '../../store/features/companySlice';
import { addDays, format } from 'date-fns';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { showLoading } from '../../store/features/coreSlice';
import { TaskState } from '../../modules/task';

export interface IProjectControlFormInput {
  name: string;
  rate: number;
  planStartDate: Date;
  planEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
}
interface Props {
  value?: string;
  selectedTask?: TaskState | null;
  onCancel: () => void;
  onSuccess: (task: TaskState) => void;
}

function CreateAndEidtTaskTempleate({ value, selectedTask, onCancel, onSuccess }: Props) {
  const { handleSubmit, control, register } = useForm<IProjectControlFormInput>({
    defaultValues: {
      name: value || selectedTask?.task_name || '',
      rate: selectedTask?.hourly_rate || 30,
      planStartDate: selectedTask && selectedTask.planned_start_date ? new Date(selectedTask.planned_start_date) : new Date(),
      planEndDate: selectedTask && selectedTask.planned_end_date ? new Date(selectedTask.planned_end_date) : addDays(new Date(), 7),
      actualStartDate: selectedTask && selectedTask.actual_start_date ? new Date(selectedTask.actual_start_date) : new Date(),
      actualEndDate: selectedTask && selectedTask.actual_end_date ? new Date(selectedTask.actual_end_date) : addDays(new Date(), 7),
    },
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { company_id } = useSelector((state: RootState) => state.companyInfo);
  const dispatch = useAppDispatch();

  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);

  React.useEffect(() => {
    if (createTaskRes) {
      onSuccess(createTaskRes.task);
      dispatch(changeProjectCount());
    }
  }, [createTaskRes]);
  React.useEffect(() => {
    if (sendUpdateTaskRes) {
      onSuccess(sendUpdateTaskRes);
    }
  }, [sendUpdateTaskRes]);

  const onSubmit: SubmitHandler<IProjectControlFormInput> = data => {
    if (userInfo) {
      dispatch(showLoading());
      if (selectedTask) {
        const newTask = {
          task_id: selectedTask.task_id,
          creator_id: userInfo.user_id,
          project_id: selectedTask.project_id,
          task_name: data.name,
          description: selectedTask.description,
          planned_start_date: format(data.planStartDate, 'yyyy-MM-dd'),
          planned_end_date: format(data.planEndDate, 'yyyy-MM-dd'),
          actual_start_date: format(data.actualStartDate, 'yyyy-MM-dd'),
          actual_end_date: format(data.actualEndDate, 'yyyy-MM-dd'),
          hourly_rate: data.rate,
          is_add_all: selectedTask.is_add_all,
          is_active: selectedTask.is_active,
          is_deleted: selectedTask.is_deleted,
        };
        _sendUpdateTask(newTask);
      } else {
        const newTask = {
          task_id: null,
          creator_id: userInfo.user_id,
          project_id: null,
          task_name: data.name,
          description: '',
          planned_start_date: format(data.planStartDate, 'yyyy-MM-dd'),
          planned_end_date: format(data.planEndDate, 'yyyy-MM-dd'),
          actual_start_date: format(data.actualStartDate, 'yyyy-MM-dd'),
          actual_end_date: format(data.actualEndDate, 'yyyy-MM-dd'),
          hourly_rate: data.rate,
          is_add_all: false,
          is_active: true,
          is_deleted: 0,
          company_id: company_id,
        };
        _sendCreateTask(newTask);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative w-full space-y-4'>
      <div className='text-center font-bold'>{selectedTask ? 'Edit this project' : 'Create a new project'}</div>
      <Controller
        control={control}
        name='name'
        rules={{ required: true }}
        render={({ field }) => (
          <label className='block w-full mt-4'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
            <input
              type='text'
              autoComplete='off'
              className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter Client Name'
              {...field}
            />
          </label>
        )}
      />
      <label className='block w-full mt-4'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">DESCRIPTION</span>
        <input
          type='text'
          autoComplete='off'
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Hourly Rate'
          {...register('rate')}
        />
      </label>
      <div className='flex justify-between w-full px-8 text-lg font-bold'>
        <div onClick={onCancel}>No</div>
        <button type='submit' className='text-lg font-bold text-rouge-blue'>
          Yes
        </button>
      </div>
    </form>
  );
}

export default CreateAndEidtTaskTempleate;
