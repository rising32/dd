import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateProject } from '../../lib/api';
import { RootState, useAppDispatch } from '../../store';
import { changeProjectCount } from '../../store/features/companySlice';
import { ProjectState } from '../../modules/project';
import FullCalendar from '../../components/calendar/FullCalendar';
import { addDays, format } from 'date-fns';

interface Props {
  isEdit?: boolean;
  value?: string;
  selectedProject?: ProjectState;
  onCancel: () => void;
  onSuccess: (project: ProjectState) => void;
}

function CreateAndEditProjectTemplate({ isEdit, value, selectedProject, onCancel, onSuccess }: Props) {
  const [projectName, setProjectName] = useState('');
  const [projectDec, setProjectDec] = useState('');
  const [planStartDate, setPlanStartDate] = useState<Date>(new Date());
  const [planEndDate, setPlanEndDate] = useState<Date>(addDays(new Date(), 7));
  const [actualStartDate, setActualStartDate] = useState<Date>(new Date());
  const [actualEndDate, setActualEndDate] = useState<Date>(addDays(new Date(), 7));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState(0);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [_sendCreateProject, , sendCreateProjectRes] = useRequest(sendCreateProject);

  React.useEffect(() => {
    if (isEdit) {
      setProjectName(selectedProject?.project_name || '');
    } else {
      setProjectName(value || '');
    }
  }, [isEdit, value]);

  const onChangeName = (event: React.FormEvent<HTMLInputElement>) => {
    setProjectName(event.currentTarget.value);
  };
  const onChangeDec = (event: React.FormEvent<HTMLInputElement>) => {
    setProjectDec(event.currentTarget.value);
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
    if (isEdit) {
      //
    } else {
      if (userInfo) {
        const params = {
          project_id: null,
          creator_id: userInfo.user_id,
          project_name: projectName,
        };
        _sendCreateProject(params);
      }
    }
  };
  React.useEffect(() => {
    if (sendCreateProjectRes) {
      onSuccess(sendCreateProjectRes);
      dispatch(changeProjectCount());
    }
  }, [sendCreateProjectRes]);
  return (
    <div className='relative w-full space-y-4'>
      <div className='text-center font-bold'>{isEdit ? 'Edit this project' : 'Create a new project'}</div>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='projectName'
          autoComplete='off'
          value={projectName}
          onChange={onChangeName}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Name'
        />
      </label>
      <label className='block'>
        <span className='block text-sm font-medium'>DESCRIPTION</span>
        <input
          type='text'
          name='projectDec'
          autoComplete='off'
          value={projectDec || ''}
          onChange={onChangeDec}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Description'
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

export default CreateAndEditProjectTemplate;
