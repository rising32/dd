import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { sendCreatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import PlusButton from '../common/PlusButton';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

interface Props {
  selectedWeek: number;
  addPriority: (priority: PriorityState) => void;
}
function CreatePriority({ selectedWeek, addPriority }: Props) {
  const [priorityValue, setPriorityValue] = useState('');
  const [goalValue, setGoalValue] = useState('');

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
        is_weekly: 0,
        end_date: null,
      };
      _sendCreatePriority(priority);
    }
  };
  React.useEffect(() => {
    if (sendCreatePriorityRes) {
      addPriority(sendCreatePriorityRes);
      setPriorityValue('');
      setGoalValue('');
    }
  }, [sendCreatePriorityRes]);

  return (
    <>
      <label className='flex items-center mt-4 w-full'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue flex font-bold">Priority</span>
        <input
          type='text'
          name='priority'
          autoComplete='off'
          value={priorityValue}
          onChange={changePriorityValue}
          className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
          placeholder='Enter Priority Name'
        />
      </label>
      <label className='flex items-center w-full'>
        <span className='block font-bold'>Goal</span>
        <input
          type='text'
          name='goal'
          autoComplete='off'
          value={goalValue}
          onChange={changeGoalValue}
          className='ml-2 py-2 bg-transparent border-none focus:outline-none focus:border-none w-full'
          placeholder='Enter Goal'
        />
      </label>
      <PlusButton className='flex items-center justify-end my-4' onPlus={onCreateWeekPriority} />
    </>
  );
}

export default CreatePriority;
