import React, { useState } from 'react';
import SmallLayout from '../../container/common/SmallLayout';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { CPMDState, TaskAssignState, TaskState } from '../../modules/task';
import { UserInfoState } from '../../modules/user';
import PlusButton from '../common/PlusButton';
import useRequest from '../../lib/hooks/useRequest';
import { sendTasksWithCPMD, sendDeveloperToTask, sendCreateDeliverable } from '../../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectedAndCompltedIcon from '../common/SelectedAndCompltedIcon';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { DeliverableState } from '../../modules/deliverable';
import MoreButton from '../common/MoreButton';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Client from './form/Client';
import Project from './form/Project';
import Task from './form/Task';
import Member from './form/Member';
import When from './form/When';

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
  const [weekTasks, setWeekTask] = useState<CPMDState[]>([]);
  const [loaded, setLoaded] = useState<string | null>(null);

  const { handleSubmit, control, reset, getValues, watch } = useForm<ITasksControlFormInput>({
    defaultValues: {
      client: null,
      project: null,
      task: null,
      deliverable: '',
      when: null,
    },
  });

  const [_sendTasksWithCPMD, , sendTasksWithCPMDRes] = useRequest(sendTasksWithCPMD);
  const [_sendDeveloperToTask, , sendDeveloperToTaskRes] = useRequest(sendDeveloperToTask);
  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    _sendTasksWithCPMD({ user_id: userInfo?.user_id });
  }, []);
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const params = {
        user_id: userInfo?.user_id,
        member_id: value.member?.user_id,
        client_id: value.client?.client_id,
        project_id: value.project?.project_id,
        planned_end_date: value.when || new Date(),
      };
      _sendTasksWithCPMD(params);
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  React.useEffect(() => {
    if (sendTasksWithCPMDRes) {
      setWeekTask(sendTasksWithCPMDRes);
    }
  }, [sendTasksWithCPMDRes]);

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
        reset();
        toast.success('new task created successfully');
        setLoaded('end');
      }
    }
  }, [sendDeveloperToTaskRes]);
  React.useEffect(() => {
    if (sendCreateDeliverableRes) {
      reset();
      toast.success('new deliverable created successfully');
      setLoaded('end');
    }
  }, [sendCreateDeliverableRes]);
  const onSubmit: SubmitHandler<ITasksControlFormInput> = data => {
    console.log(data);
    if (userInfo && data.task?.task_id) {
      setLoaded('start');
      const newAssign: TaskAssignState = {
        assign_id: null,
        task_id: data.task.task_id,
        member_id: data.member?.user_id || userInfo.user_id,
        role_id: 3,
      };
      _sendDeveloperToTask(newAssign);
    }
  };

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
          <PlusButton className='flex items-center justify-end my-4' />
        </form>
      </SmallLayout>
      <div className='mt-4 text-center'>{'Tasks Week ' + selectedWeek}</div>
      <SmallLayout className='p-4 bg-card-gray text-white'>
        {weekTasks.map(item => (
          <div key={item.client_id} className='flex flex-col mb-3'>
            <span className='font-bold mb-2 text-center'>{item.client_name}</span>
            {item.task.map(task => (
              <div key={task.task_id} className='flex items-center'>
                <SelectedAndCompltedIcon isSelected={false} isCompleted={false} />
                <span className='pl-2 truncate'>{task.member_name + '-' + 'W' + selectedWeek + ' : ' + task.task_name}</span>
              </div>
            ))}
          </div>
        ))}
        <MoreButton className='flex items-center justify-end mt-4' onMore={() => navigate('/tasks/taskList')} />
      </SmallLayout>
    </>
  );
}

export default TasksControl;
