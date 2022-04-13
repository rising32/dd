import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SmallLayout from '../../container/common/SmallLayout';
import { sendCreatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import PlusButton from '../common/PlusButton';
import AchievedPriorityTab from './AchievedPriorityTab';

interface Props {
  selectedWeek: number;
  addWeekPriority: (priority: PriorityState) => void;
}
function AchievedPriority({ selectedWeek, addWeekPriority }: Props) {
  const [priorityValue, setPriorityValue] = useState('');
  const [goalValue, setGoalValue] = useState('');
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<string>('');

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendCreatePriority, , sendCreatePriorityRes] = useRequest(sendCreatePriority);

  const changePriorityValue = (event: React.FormEvent<HTMLInputElement>) => {
    setPriorityValue(event.currentTarget.value);
  };
  const changeGoalValue = (event: React.FormEvent<HTMLInputElement>) => {
    setGoalValue(event.currentTarget.value);
  };
  const onCreateWeekPriority = () => {
    if (!priorityValue) {
      toast.error('priority is not empty!');
      return;
    }
    if (userInfo) {
      const priority: PriorityState = {
        wp_id: null,
        user_id: userInfo?.user_id,
        week: selectedWeek,
        priority: priorityValue,
        goal: goalValue,
        detail: '',
        is_completed: 0,
        is_weekly: null,
        end_date: null,
      };
      _sendCreatePriority(priority);
    }
  };
  React.useEffect(() => {
    if (sendCreatePriorityRes) {
      addWeekPriority(sendCreatePriorityRes);
      setPriorityValue('');
      setGoalValue('');
    }
  }, [sendCreatePriorityRes]);
  const onSelectPriorityTab = (tab: string) => {
    setSelectedPriorityTab(preSelectedProject => (preSelectedProject === tab ? '' : tab));
  };
  return (
    <div className='text-white mt-4'>
      <div className='flex justify-center'>
        <span className='text-base'>Priority achieved this week with clear goal defined</span>
      </div>
      <SmallLayout className='w-full rounded-md flex flex-col border-rouge-blue border-4 p-4 relative'>
        <label className='block mt-4 w-full'>
          <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold">Priority</span>
          <input
            type='text'
            name='priority'
            value={priorityValue}
            onChange={changePriorityValue}
            className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
            placeholder='Enter Rate'
          />
        </label>
        <label className='block mt-4 w-full'>
          <span className='block font-bold'>Goal</span>
          <input
            type='text'
            name='goal'
            value={goalValue}
            onChange={changeGoalValue}
            className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
            placeholder='Enter Rate'
          />
        </label>
        <PlusButton className='flex items-center justify-end my-4' onPlus={onCreateWeekPriority} />
        <AchievedPriorityTab selectedPriorityTab={selectedPriorityTab} onSelectPriorityTab={onSelectPriorityTab} />
      </SmallLayout>
    </div>
  );
}

export default AchievedPriority;
