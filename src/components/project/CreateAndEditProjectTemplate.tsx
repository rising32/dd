import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateProject, sendUpdateProject } from '../../lib/api';
import { RootState, useAppDispatch } from '../../store';
import { changeProjectCount } from '../../store/features/companySlice';
import { ProjectState } from '../../modules/project';
import { addDays, format } from 'date-fns';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { showLoading } from '../../store/features/coreSlice';
import DateSelect from './form/DateSelect';
import { UserInfoState } from '../../modules/user';
import Member from './form/Member';

export interface IProjectControlFormInput {
  name: string;
  description: string;
  member: UserInfoState;
  planStartDate: Date;
  planEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
}
interface Props {
  value?: string;
  selectedProject?: ProjectState | null;
  onCancel: () => void;
  onSuccess: (project: ProjectState) => void;
}

function CreateAndEditProjectTemplate({ value, selectedProject, onCancel, onSuccess }: Props) {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const { handleSubmit, control, register } = useForm<IProjectControlFormInput>({
    defaultValues: {
      name: value || selectedProject?.project_name || '',
      description: selectedProject?.description || '',
      planStartDate: selectedProject && selectedProject.planned_start_date ? new Date(selectedProject.planned_start_date) : new Date(),
      planEndDate:
        selectedProject && selectedProject.planned_end_date ? new Date(selectedProject.planned_end_date) : addDays(new Date(), 7),
      actualStartDate: selectedProject && selectedProject.actual_start_date ? new Date(selectedProject.actual_start_date) : new Date(),
      actualEndDate:
        selectedProject && selectedProject.actual_end_date ? new Date(selectedProject.actual_end_date) : addDays(new Date(), 7),
    },
  });

  const [_sendCreateProject, , sendCreateProjectRes] = useRequest(sendCreateProject);
  const [_sendUpdateProject, , sendUpdateProjectRes] = useRequest(sendUpdateProject);

  React.useEffect(() => {
    if (sendCreateProjectRes) {
      onSuccess(sendCreateProjectRes);
      dispatch(changeProjectCount());
    }
  }, [sendCreateProjectRes]);
  React.useEffect(() => {
    if (sendUpdateProjectRes) {
      onSuccess(sendUpdateProjectRes);
    }
  }, [sendUpdateProjectRes]);

  const onSubmit: SubmitHandler<IProjectControlFormInput> = data => {
    if (userInfo) {
      dispatch(showLoading());
      if (selectedProject) {
        const updateProject: ProjectState = {
          project_id: selectedProject?.project_id,
          creator_id: data.member.user_id,
          project_name: data.name,
          planned_start_date: format(data.planStartDate, 'yyyy-MM-dd'),
          planned_end_date: format(data.planEndDate, 'yyyy-MM-dd'),
          actual_start_date: format(data.actualStartDate, 'yyyy-MM-dd'),
          actual_end_date: format(data.actualEndDate, 'yyyy-MM-dd'),
          description: data.description,
        };
        _sendUpdateProject(updateProject);
      } else {
        const params = {
          project_id: null,
          creator_id: data.member?.user_id,
          project_name: data.name,
        };
        _sendCreateProject(params);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative w-full space-y-4'>
      <div className='text-center font-bold'>{selectedProject ? 'Edit this project' : 'Create a new project'}</div>
      <Controller
        control={control}
        name='name'
        rules={{ required: true }}
        render={({ field }) => (
          <label className='block w-full mt-4'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
            <input
              type='text'
              autoComplete='off'
              className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter Project Name'
              {...field}
            />
          </label>
        )}
      />
      <Controller
        control={control}
        name='member'
        rules={{ required: true }}
        render={({ field }) => <Member selectedProject={selectedProject} field={field} />}
      />
      <label className='block w-full mt-4'>
        <span className='block text-sm font-medium'>DESCRIPTION</span>
        <input
          type='text'
          autoComplete='off'
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Description'
          {...register('description')}
        />
      </label>
      <label className='block mt-4'>
        <span className='block text-sm font-medium'>PLAN DATE</span>
        <div className='flex mt-2'>
          <Controller
            control={control}
            name='planStartDate'
            rules={{ required: true }}
            render={({ field }) => <DateSelect field={field} />}
          />
          <div className='mx-2'>:</div>
          <Controller
            control={control}
            name='planEndDate'
            rules={{ required: true }}
            render={({ field }) => <DateSelect field={field} />}
          />
        </div>
      </label>
      <label className='block mt-4'>
        <span className='block text-sm font-medium'>ACTUAL DATE</span>
        <div className='flex mt-2'>
          <Controller
            control={control}
            name='actualStartDate'
            rules={{ required: true }}
            render={({ field }) => <DateSelect field={field} />}
          />
          <div className='mx-2'>:</div>
          <Controller
            control={control}
            name='actualEndDate'
            rules={{ required: true }}
            render={({ field }) => <DateSelect field={field} />}
          />
        </div>
      </label>
      <div className='flex justify-between w-full px-8 text-lg font-bold'>
        <div onClick={onCancel}>No</div>
        <button type='submit' className='text-lg font-bold text-rouge-blue'>
          Yes
        </button>
      </div>
    </form>
  );
}

export default CreateAndEditProjectTemplate;
