import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendCreatePriority, sendUpdatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState, useAppDispatch } from '../../store';
import PlusButton from '../common/PlusButton';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import SmallLayout from '../../container/common/SmallLayout';
import PriorityTab from './PriorityTab';
import WeeklyPriorities from './WeeklyPriorities';
import { showLoading } from '../../store/features/coreSlice';
import PastNotAchievedPriority from './PastNotAchievedPriority';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import Project from './form/Project';
import Client from './form/Client';
import { format } from 'date-fns';

export interface IPriorityFormInput {
  priority: string;
  goal: string;
  weekly: number;
  client: ClientState | null;
  project: ProjectState | null;
}
interface Props {
  selectedWeek: number;
}
function PriorityPanel({ selectedWeek }: Props) {
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<string>('');
  const { register, reset, setValue, control, handleSubmit } = useForm<IPriorityFormInput>({
    defaultValues: {
      priority: '',
      goal: '',
      weekly: 1,
      client: null,
      project: null,
    },
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [_sendCreatePriority, , sendCreatePriorityRes] = useRequest(sendCreatePriority);
  const [_sendUpdatePriority, , sendUpdatePriorityRes] = useRequest(sendUpdatePriority);

  const onSelectPriorityTab = (tab: string) => {
    setSelectedPriorityTab(tab);
  };

  const onSelectPriority = (priority: PriorityState | null) => {
    if (priority && selectedPriority?.wp_id !== priority.wp_id) {
      setSelectedPriority(priority);
      setValue('priority', priority.priority);
      setValue('goal', priority.goal);
      setValue('weekly', priority.is_weekly || 1);
      setSelectedPriorityTab('Details');
    } else {
      setSelectedPriority(null);
      reset();
      setSelectedPriorityTab('');
    }
  };

  const onSubmit: SubmitHandler<IPriorityFormInput> = data => {
    dispatch(showLoading());
    if (userInfo) {
      if (selectedPriority) {
        _sendUpdatePriority({
          wp_id: selectedPriority.wp_id,
          user_id: selectedPriority.user_id,
          week: selectedPriority.week,
          priority: data.priority,
          project_id: data.project?.project_id,
          goal: data.goal,
          detail: selectedPriority.detail,
          is_completed: 1,
          is_weekly: data.weekly,
          end_date: format(selectedPriority.end_date ? new Date(selectedPriority.end_date) : new Date(), 'yyyy-MM-dd'),
        });
      } else {
        const priority: PriorityState = {
          wp_id: null,
          user_id: userInfo?.user_id,
          week: selectedWeek,
          priority: data.priority,
          goal: data.goal,
          detail: '',
          is_completed: 0,
          is_weekly: 0,
          end_date: null,
        };
        _sendCreatePriority(priority);
      }
    }
  };

  return (
    <>
      <WeeklyPriorities
        selectedWeek={selectedWeek}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        newCreatedWeekPriority={sendCreatePriorityRes}
        updatedPriority={sendUpdatePriorityRes}
        reset={reset}
      />
      <div className='text-white mt-4'>
        <div className='flex justify-center'>
          <span className='text-center'>Priority achieved this week with clear goal defined</span>
        </div>
        <SmallLayout className='w-full bg-card-gray rounded-md flex flex-col border-rouge-blue border-4 p-4 relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name='priority'
              rules={{ required: true }}
              render={({ field }) => (
                <label className='flex items-center mt-4 w-full'>
                  <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue flex font-bold">Priority</span>
                  <input
                    autoComplete='off'
                    className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
                    placeholder='Enter Priority Name'
                    enterKeyHint='next'
                    {...field}
                  />
                </label>
              )}
            />

            <label className='flex items-center w-full'>
              <span className='block font-bold'>Goal</span>
              <input
                autoComplete='off'
                className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
                placeholder='Enter Goal'
                enterKeyHint='done'
                {...register('goal')}
              />
            </label>

            {selectedPriorityTab !== '' && (
              <Controller
                control={control}
                name='weekly'
                rules={{ required: true }}
                render={({ field }) => (
                  <div className='flex mt-2'>
                    <span className='block font-bold'>Detail :</span>
                    <div className='flex flex-col pl-8'>
                      <div className={`${field.value === 1 ? 'text-rouge-blue' : 'text-white'}`} onClick={() => field.onChange(1)}>
                        A. Weely Priority
                      </div>
                      <div className={`${field.value === 2 ? 'text-rouge-blue' : 'text-white'}`} onClick={() => field.onChange(2)}>
                        B. Monthly Priority
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
            {selectedPriorityTab === 'Project' && (
              <>
                <Controller control={control} name='client' render={({ field }) => <Client field={field} />} />
                <Controller control={control} name='project' render={({ field }) => <Project control={control} field={field} />} />
              </>
            )}

            <PlusButton className='flex items-center justify-end my-4' />
            <PriorityTab
              selectedPriorityTab={selectedPriorityTab}
              selectedPriority={selectedPriority}
              onSelectPriorityTab={onSelectPriorityTab}
            />
          </form>
        </SmallLayout>
      </div>
      <PastNotAchievedPriority selectedWeek={selectedWeek} />
    </>
  );
}

export default PriorityPanel;
