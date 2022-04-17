import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { redDocumentThumbnail } from '../../assets/images';
import { BriefcaseSvg, ClickArrowSvg, EuroSvg, GroupSvg, HouseSvg, PersonSvg, SettingSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import { RootState } from '../../store';
import { onSignout } from '../../store/features/userSlice';
import ItemLayout from '../common/ItemLayout';
import Organization from '../items/Organization';
import UserNameAndEmail from '../items/UserNameAndEmail';

function UserProfile() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSignOut = async () => {
    if (!userInfo) return;
    try {
      await dispatch(onSignout({ user_id: userInfo?.user_id }));
    } catch (err) {
      console.log('error', `Fetch failed: `);
    }
  };
  return (
    <SmallLayout className='flex flex-1 flex-col mt-4 px-1 py-4 bg-white text-black'>
      <div className='text-lg font-bold uppercase pl-6'>profile</div>
      <UserNameAndEmail />

      <ItemLayout className='mt-2' onClick={() => navigate('/account/work-setting')}>
        <div className='w-10 flex items-center justify-center'>
          <BriefcaseSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>Work Setting</div>
          <div>
            <img src={redDocumentThumbnail} className='h-4 w-auto' />
          </div>
          <div className='text-rouge-blue'>AM/PM</div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <ItemLayout className='mt-2 text-link' onClick={onSignOut}>
        <span className='w-full text-center'>Sign Out</span>
      </ItemLayout>

      <div className='text-lg font-bold uppercase pl-6'>settings</div>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <SettingSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2 truncate'>Date, time and currency</div>
          <EuroSvg className='w-6 h-6 fill-rouge-blue' />
          <div className='text-rouge-blue'>AM/PM</div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <Organization />
      <ItemLayout className='mt-2 text-link'>
        <span className='w-full text-center'>View Terms & Privacy policy</span>
      </ItemLayout>

      <div className='text-lg font-bold uppercase pl-6'>Manage</div>
      <ItemLayout className='mt-2' onClick={() => navigate('/account/teams')}>
        <div className='w-10 flex items-center justify-center'>
          <GroupSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>2 Team member</div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
    </SmallLayout>
  );
}

export default UserProfile;
