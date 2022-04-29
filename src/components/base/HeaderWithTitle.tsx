import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { onSignout } from '../../store/features/userSlice';

interface Props {
  title: string;
  isAccount?: boolean;
}
function HeaderWithTitle({ title, isAccount }: Props) {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignOut = async () => {
    if (!userInfo) return;
    try {
      await dispatch(onSignout({ user_id: userInfo?.user_id }));
    } catch (err) {
      console.log('error', `Fetch failed: `);
    }
  };
  return (
    <div className='flex flex-row w-full p-4 items-center justify-between bg-light-gray text-rouge-blue rounded-md'>
      {isAccount ? (
        <div className='text-sm font-normal' onClick={() => navigate('terms')}>
          Terms
        </div>
      ) : (
        <div />
      )}
      <div className='text-lg font-bold capitalize'>{title}</div>
      {isAccount ? (
        <div className='text-sm font-normal' onClick={onSignOut}>
          Sign Out
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default HeaderWithTitle;
