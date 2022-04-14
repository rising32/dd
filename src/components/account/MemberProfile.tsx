import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HomeSvg, PenSvg, PersonSvg, ProjectSvg, TaskSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import { RootState } from '../../store';
import ItemLayout from '../common/ItemLayout';

function MemberProfile() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  return (
    <SmallLayout className='mt-4 px-1 py-4 bg-dark-gray text-black relative'>
      <div className='text-lg font-bold uppercase text-center'>MEMBER PROFILE</div>
      <ItemLayout>
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
          <div className='pr-2'>4 Clients</div>
        </div>
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <ProjectSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>4 Projects</div>
        </div>
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <TaskSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>5 Tasks</div>
        </div>
      </ItemLayout>
      <div className='absolute top-4 right-4' onClick={() => navigate('/account/user')}>
        <PenSvg className='w-6 h-6 fill-rouge-blue' />
      </div>
    </SmallLayout>
  );
}

export default MemberProfile;
