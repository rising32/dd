import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { sendCreatePriority } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { PriorityState } from '../../modules/weekPriority';
import { RootState } from '../../store';
import PlusButton from '../common/PlusButton';
import { useForm, SubmitHandler } from 'react-hook-form';
interface IFormInput {
  priority: string;
  goal: string;
}

interface Props {
  selectedWeek: number;
  addPriority: (priority: PriorityState) => void;
}
function CreatePriority({ selectedWeek, addPriority }: Props) {
  const { register, reset, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      priority: '',
      goal: '',
    },
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendCreatePriority, , sendCreatePriorityRes] = useRequest(sendCreatePriority);

  const onSubmit: SubmitHandler<IFormInput> = data => {
    if (!data.priority) {
      toast.error('priority is not empty!');
      return;
    }
    if (userInfo) {
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
  };

  React.useEffect(() => {
    if (sendCreatePriorityRes) {
      addPriority(sendCreatePriorityRes);
      reset({
        priority: '',
        goal: '',
      });
    }
  }, [sendCreatePriorityRes]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className='flex items-center mt-4 w-full'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue flex font-bold">Priority</span>
        <input
          autoComplete='off'
          className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
          placeholder='Enter Priority Name'
          enterKeyHint='next'
          {...register('priority', { required: true })}
        />
      </label>
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

      <PlusButton className='flex items-center justify-end my-4' />
    </form>
  );
}

export default CreatePriority;
