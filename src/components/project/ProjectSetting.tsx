import React, { useState } from 'react';
import { sendUpdateProject } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { addDays, format } from 'date-fns';
import FullCalendar from '../calendar/FullCalendar';
import { ProjectState } from '../../modules/project';

interface Props {
  selectedProject: ProjectState | null;
  onCancel: () => void;
  onSuccess: (project: ProjectState) => void;
}
const ProjectSetting = ({ selectedProject, onCancel, onSuccess }: Props) => {
  const [projectName, setProjectName] = useState(selectedProject ? selectedProject.project_name : '');
  const [projectDec, setProjectDec] = useState(selectedProject ? selectedProject.description : '');
  const [planStartDate, setPlanStartDate] = useState<Date>(
    selectedProject && selectedProject.planned_start_date ? new Date(selectedProject.planned_start_date) : new Date(),
  );
  const [planEndDate, setPlanEndDate] = useState<Date>(
    selectedProject && selectedProject.planned_end_date ? new Date(selectedProject.planned_end_date) : addDays(new Date(), 7),
  );
  const [actualStartDate, setActualStartDate] = useState<Date>(
    selectedProject && selectedProject.actual_start_date ? new Date(selectedProject.actual_start_date) : new Date(),
  );
  const [actualEndDate, setActualEndDate] = useState<Date>(
    selectedProject && selectedProject.actual_end_date ? new Date(selectedProject.actual_end_date) : addDays(new Date(), 7),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState(0);

  const [_sendUpdateProject, , sendUpdateProjectRes] = useRequest(sendUpdateProject);

  const handleProjectNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setProjectName(event.currentTarget.value);
  };
  const handleProjectDecChange = (event: React.FormEvent<HTMLInputElement>) => {
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
  const onUpdateProject = () => {
    if (selectedProject) {
      const updateProject: ProjectState = {
        project_id: selectedProject?.project_id,
        creator_id: selectedProject.creator_id,
        project_name: projectName,
        planned_start_date: format(planStartDate, 'yyyy-MM-dd'),
        planned_end_date: format(planEndDate, 'yyyy-MM-dd'),
        actual_start_date: format(actualStartDate, 'yyyy-MM-dd'),
        actual_end_date: format(actualEndDate, 'yyyy-MM-dd'),
        description: projectDec,
      };
      _sendUpdateProject(updateProject);
    }
  };
  React.useEffect(() => {
    if (sendUpdateProjectRes) {
      onSuccess(sendUpdateProjectRes);
    }
  }, [sendUpdateProjectRes]);

  return (
    <div className='px-4 my-4 relative'>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='projectName'
          value={projectName}
          onChange={handleProjectNameChange}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Name'
        />
      </label>
      <label className='block mt-4'>
        <span className='block text-sm font-medium'>DESCRIPTION</span>
        <input
          type='text'
          name='projectName'
          value={projectDec || ''}
          onChange={handleProjectDecChange}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Description'
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
      <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
        <div className='text-lg font-bold' onClick={onCancel}>
          Cancel
        </div>
        <div className='text-lg font-bold text-rouge-blue' onClick={onUpdateProject}>
          Update
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;
