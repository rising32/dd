import React from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskAssignState, TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import PlusButton from '../common/PlusButton';
import useRequest from '../../lib/hooks/useRequest';
import { sendDeveloperToTask, sendCreateDeliverable } from '../../lib/api';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { DeliverableState } from '../../modules/deliverable';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Client from './form/Client';
import Project from './form/Project';
import Task from './form/Task';
import Member from './form/Member';
import When from './form/When';
import TasksWithClient from './TasksWithClient';
import { removeLoading, showLoading } from '../../store/features/coreSlice';

export interface ITasksControlFormInput {
  client: ClientState | null;
  project: ProjectState | null;
  task: TaskState | null;
  deliverable: string;
  member: UserInfoState | null;
  when: Date | null;
}
interface Props {
  selectedWeek: number;
}
function TasksControl({ selectedWeek }: Props) {
  const { handleSubmit, control, reset, getValues } = useForm<ITasksControlFormInput>({
    defaultValues: {
      client: null,
      project: null,
      task: null,
      deliverable: '',
      member: null,
      when: null,
    },
  });

  const [_sendDeveloperToTask, , sendDeveloperToTaskRes] = useRequest(sendDeveloperToTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { admin_info } = useSelector((state: RootState) => state.companyInfo);
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ITasksControlFormInput> = data => {
    if (userInfo?.role_id === 3) return;
    if (userInfo && data.task?.task_id) {
      dispatch(showLoading());
      const newAssign: TaskAssignState = {
        assign_id: null,
        task_id: data.task.task_id,
        member_id: data.member?.user_id || userInfo.user_id,
        role_id: 3,
      };
      _sendDeveloperToTask(newAssign);
    }
  };
  React.useEffect(() => {
    if (sendDeveloperToTaskRes) {
      const deliverable = getValues('deliverable');
      const task_id = getValues('task.task_id');
      const member_id = getValues('member.user_id');
      const when = getValues('when');
      if (deliverable) {
        if (userInfo && task_id) {
          const newDeliverable: DeliverableState = {
            deliverable_id: null,
            deliverable_name: deliverable,
            user_id: member_id || userInfo.user_id,
            task_id: task_id,
            periority_id: null,
            budget: 50,
            planned_end_date: format(when || new Date(), 'yyyy-MM-dd'),
            end_date: null,
            is_completed: 0,
          };
          _sendCreateDeliverable(newDeliverable);
        }
      } else {
        dispatch(removeLoading());
        reset();
        toast.success('new task created successfully');
      }
    }
  }, [sendDeveloperToTaskRes]);
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      dispatch(removeLoading());
      reset();
      toast.success('new deliverable created successfully');
    }
  }, [sendCreateDeliverableRes]);

  return (
    <>
      <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 text-white'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller control={control} name='client' rules={{ required: true }} render={({ field }) => <Client field={field} />} />
          <Controller
            control={control}
            name='project'
            rules={{ required: true }}
            render={({ field }) => <Project control={control} field={field} />}
          />
          <Controller
            control={control}
            name='task'
            rules={{ required: true }}
            render={({ field }) => <Task control={control} field={field} />}
          />
          <Controller
            control={control}
            name='deliverable'
            rules={{ required: false }}
            render={({ field }) => (
              <label className='w-full flex items-center'>
                <span className='font-bold'>Deliverable:</span>
                <input
                  type='text'
                  autoComplete='off'
                  className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
                  placeholder='Enter Deliverable Name'
                  {...field}
                />
              </label>
            )}
          />
          <Controller control={control} name='member' rules={{ required: false }} render={({ field }) => <Member field={field} />} />
          <Controller control={control} name='when' rules={{ required: false }} render={({ field }) => <When field={field} />} />
          {(userInfo?.role_id === 1 || userInfo?.role_id === 2) && <PlusButton className='flex items-center justify-end my-4' />}
        </form>
      </SmallLayout>
      <TasksWithClient control={control} selectedWeek={selectedWeek} />
    </>
  );
}

export default TasksControl;
