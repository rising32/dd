import React from 'react';
import { PersonSvg, HomeSvg, PenSvg, ProjectSvg, TaskSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import ItemLayout from '../common/ItemLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { client_count, project_count, task_count } = useSelector((state: RootState) => state.companyInfo);
  const navigate = useNavigate();

  return (
    <SmallLayout className='mt-4 px-1 py-4 bg-dark-gray text-black relative'>
      <div className='text-lg font-bold uppercase text-center'>MEMBER PROFILE</div>
      <ItemLayout onClick={() => navigate('/account/user')}>
        <div className='w-10 flex items-center justify-center'>
          <PersonSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='font-bold pr-2'>{userInfo?.display_name}</div>
        <div className='flex flex-1 truncate'>{userInfo?.email}</div>
      </ItemLayout>
      <ItemLayout className='mt-2' onClick={() => navigate('clients')}>
        <div className='w-10 flex items-center justify-center'>
          <HomeSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='flex flex-1'>
          <div className='pr-2'>
            {client_count}
            {' Clients'}
          </div>
        </div>
      </ItemLayout>
      <ItemLayout className='mt-2' onClick={() => navigate('projects')}>
        <div className='w-10 flex items-center justify-center'>
          <ProjectSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>
            {project_count}
            {' Projects'}
          </div>
        </div>
      </ItemLayout>
      <ItemLayout className='mt-2' onClick={() => navigate('tasks')}>
        <div className='w-10 flex items-center justify-center'>
          <TaskSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>
            {task_count || 0}
            {' Tasks'}
          </div>
        </div>
      </ItemLayout>
      <div className='absolute top-4 right-4' onClick={() => navigate('/account/user')}>
        <PenSvg className='w-6 h-6 fill-rouge-blue' />
      </div>
    </SmallLayout>
  );
}

export default UserInfo;
