import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateTask } from '../../lib/api';
import { RootState, useAppDispatch } from '../../store';
import { changeTaskCount } from '../../store/features/companySlice';
import { TaskState } from '../../modules/task';
import { addDays, format } from 'date-fns';
import FullCalendar from '../../components/calendar/FullCalendar';

interface Props {
  isEdit?: boolean;
  value?: string;
  selectedTask?: TaskState;
  onCancel: () => void;
  onSuccess: (task: TaskState) => void;
}

function CreateAndEidtTaskTempleate({ isEdit, value, selectedTask, onCancel, onSuccess }: Props) {
  const [taskName, setTaskName] = useState('');
  const [taskRate, setTaskRate] = useState(30);
  const [planStartDate, setPlanStartDate] = useState<Date>(new Date());
  const [planEndDate, setPlanEndDate] = useState<Date>(addDays(new Date(), 7));
  const [actualStartDate, setActualStartDate] = useState<Date>(new Date());
  const [actualEndDate, setActualEndDate] = useState<Date>(addDays(new Date(), 7));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState(0);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);

  React.useEffect(() => {
    if (isEdit) {
      setTaskName(selectedTask?.task_name || '');
    } else {
      setTaskName(value || '');
    }
  }, [isEdit, value]);

  const onChangeName = (event: React.FormEvent<HTMLInputElement>) => {
    setTaskName(event.currentTarget.value);
  };
  const onChangeRate = (event: React.FormEvent<HTMLInputElement>) => {
    setTaskRate(parseInt(event.currentTarget.value));
  };
  const onSelectDate = (date: Date) => {
    switch (calendarType) {
      case 1:
        setPlanStartDate(date);
        break;
      case 2:
        setPlanEndDate(date);
        break;
      case 3:
        setActualStartDate(date);
        break;
      case 4:
        setActualEndDate(date);
        break;
      default:
        console.log('error');
    }

    setShowCalendar(false);
  };
  const onShowCalendar = (type: number) => {
    if (showCalendar) {
      setShowCalendar(false);
    } else {
      setCalendarType(type);

      switch (type) {
        case 1:
          setSelectedDate(planStartDate);
          break;
        case 2:
          setSelectedDate(planEndDate);
          break;
        case 3:
          setSelectedDate(actualStartDate);
          break;
        case 4:
          setSelectedDate(actualEndDate);
          break;
        default:
          console.log('error');
      }
      setShowCalendar(true);
    }
  };
  const onOk = () => {
    if (!userInfo) return;
    if (isEdit) {
      //
    } else {
      const newTask = {
        task_id: null,
        creator_id: userInfo.user_id,
        project_id: null,
        task_name: taskName,
        description: '',
        planned_start_date: format(planStartDate, 'yyyy-MM-dd'),
        planned_end_date: format(planEndDate, 'yyyy-MM-dd'),
        actual_start_date: format(actualStartDate, 'yyyy-MM-dd'),
        actual_end_date: format(actualEndDate, 'yyyy-MM-dd'),
        hourly_rate: taskRate,
        is_add_all: false,
        is_active: true,
        is_deleted: 0,
      };
      _sendCreateTask(newTask);
    }
  };
  React.useEffect(() => {
    if (createTaskRes) {
      onSuccess(createTaskRes.task);
      dispatch(changeTaskCount());
    }
  }, [createTaskRes]);
  return (
    <div className='relative w-full space-y-4'>
      <div className='text-center font-bold'>{isEdit ? 'Edit this task' : 'Create a new task'}</div>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='taskName'
          value={taskName}
          autoComplete='off'
          onChange={onChangeName}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Name'
        />
      </label>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">HOURLY RATE</span>
        <input
          type='text'
          name='taskRate'
          autoComplete='off'
          value={taskRate}
          onChange={onChangeRate}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Rate'
        />
      </label>
      <label className='block'>
        <span className='block text-sm font-medium'>PLAN DATE</span>
        <div className='flex mt-2'>
          <div className='flex flex-1 justify-center bg-dark-gray rounded-md py-1 text-rouge-blue' onClick={() => onShowCalendar(1)}>
            {format(planStartDate, 'yyyy-MM-dd')}
          </div>
          <div className='mx-2'>:</div>
          <div className='flex flex-1 justify-center bg-dark-gray rounded-md py-1 text-rouge-blue' onClick={() => onShowCalendar(2)}>
            {format(planEndDate, 'yyyy-MM-dd')}
          </div>
        </div>
      </label>
      <label className='block'>
        <span className='block text-sm font-medium'>ACTUAL DATE</span>
        <div className='flex mt-2'>
          <div className='flex flex-1 justify-center bg-dark-gray rounded-md py-1 text-rouge-blue' onClick={() => onShowCalendar(3)}>
            {format(actualStartDate, 'yyyy-MM-dd')}
          </div>
          <div className='mx-2'>:</div>
          <div className='flex flex-1 justify-center bg-dark-gray rounded-md py-1 text-rouge-blue' onClick={() => onShowCalendar(4)}>
            {format(actualEndDate, 'yyyy-MM-dd')}
          </div>
        </div>
      </label>
      {showCalendar && (
        <div className='w-full bg-white absolute bottom-0 left-0 outline outline-1'>
          <FullCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </div>
      )}
      <div className='flex justify-between w-full px-8 text-lg font-bold'>
        <div onClick={onCancel}>No</div>
        <div className='text-rouge-blue' onClick={onOk}>
          Yes
        </div>
      </div>
    </div>
  );
}

export default CreateAndEidtTaskTempleate;
