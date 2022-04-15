import React, { useState } from 'react';
import { sendCreateTask, sendUpdateTask } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { addDays, format } from 'date-fns';
import { DownSvg } from '../../assets/svg';
import { TaskState } from '../../modules/task';
import FullCalendar from '../calendar/FullCalendar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Props {
  selectedTask: TaskState | null;
  onCancel: () => void;
  onSuccess: (task: TaskState) => void;
}
const TaskSetting = ({ selectedTask, onCancel, onSuccess }: Props) => {
  const [taskName, setTaskName] = useState(selectedTask ? selectedTask.task_name : '');
  const [taskRate, setTaskRate] = useState(selectedTask ? selectedTask.hourly_rate : 30);
  const [planStartDate, setPlanStartDate] = useState<Date>(
    selectedTask && selectedTask.planned_start_date ? new Date(selectedTask.planned_start_date) : new Date(),
  );
  const [planEndDate, setPlanEndDate] = useState<Date>(
    selectedTask && selectedTask.planned_end_date ? new Date(selectedTask.planned_end_date) : addDays(new Date(), 7),
  );
  const [actualStartDate, setActualStartDate] = useState<Date>(
    selectedTask && selectedTask.actual_start_date ? new Date(selectedTask.actual_start_date) : new Date(),
  );
  const [actualEndDate, setActualEndDate] = useState<Date>(
    selectedTask && selectedTask.actual_end_date ? new Date(selectedTask.actual_end_date) : addDays(new Date(), 7),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState(0);
  const [isAddAll, setIsAddAll] = useState(selectedTask ? selectedTask.is_add_all : true);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendCreateTask, , createTaskRes] = useRequest(sendCreateTask);
  const [_sendUpdateTask, , sendUpdateTaskRes] = useRequest(sendUpdateTask);

  const onChangeClientName = (event: React.FormEvent<HTMLInputElement>) => {
    setTaskName(event.currentTarget.value);
  };
  const onChangeClientRate = (event: React.FormEvent<HTMLInputElement>) => {
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
  const onCreateOrEditClient = () => {
    if (!userInfo) return;
    if (selectedTask) {
      const newTask: TaskState = {
        task_id: selectedTask.task_id,
        creator_id: userInfo.user_id,
        project_id: selectedTask.project_id,
        task_name: taskName,
        description: selectedTask.description,
        planned_start_date: format(planStartDate, 'yyyy-MM-dd'),
        planned_end_date: format(planEndDate, 'yyyy-MM-dd'),
        actual_start_date: format(actualStartDate, 'yyyy-MM-dd'),
        actual_end_date: format(actualEndDate, 'yyyy-MM-dd'),
        hourly_rate: taskRate,
        is_add_all: selectedTask.is_add_all,
        is_active: selectedTask.is_active,
        is_deleted: selectedTask.is_deleted,
      };
      _sendUpdateTask(newTask);
    } else {
      const newTask: TaskState = {
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
    }
  }, [createTaskRes]);
  React.useEffect(() => {
    if (sendUpdateTaskRes) {
      onSuccess(sendUpdateTaskRes);
    }
  }, [sendUpdateTaskRes]);

  return (
    <div className='px-4 my-4 relative'>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='taskName'
          value={taskName}
          onChange={onChangeClientName}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Name'
        />
      </label>
      <label className='block mt-4'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">HOURLY RATE</span>
        <input
          type='text'
          name='taskRate'
          value={taskRate}
          onChange={onChangeClientRate}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Rate'
        />
      </label>
      <label className='block mt-4'>
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
      <label className='block mt-4'>
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
        <div className='w-full bg-white absolute bottom-1/3 left-0 outline outline-1'>
          <FullCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </div>
      )}
      <div className='flex flex-row mt-4 items-center' onClick={() => setIsAddAll(!isAddAll)}>
        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${isAddAll ? 'bg-rouge-blue' : 'bg-card-gray'}`}>
          {isAddAll ? <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' /> : null}
        </div>
        <div className='text-center truncate'>ADD TO ALL NEWS PROJETS</div>
      </div>
      <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
        <div className='text-lg font-bold' onClick={onCancel}>
          Cancel
        </div>
        <div className='text-lg font-bold text-rouge-blue' onClick={onCreateOrEditClient}>
          {selectedTask ? 'Update' : 'Create'}
        </div>
      </div>
    </div>
  );
};

export default TaskSetting;
