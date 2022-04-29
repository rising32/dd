import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PersonSvg } from '../../assets/svg';
import { sendUpdateUser } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { validateEmail } from '../../lib/utils';
import { UserInfoState } from '../../modules/user';
import { RootState } from '../../store';
import { updateUser } from '../../store/features/userSlice';
import AnimatedView from '../common/AnimatedView';
import ItemLayout from '../common/ItemLayout';

function UserNameAndEmail() {
  const [isEdit, setIsEdit] = useState(false);
  const [userName, setUserName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendUpdateUser, , sendUpdateUserRes] = useRequest(sendUpdateUser);
  const dispatch = useDispatch();

  const onEdit = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setUserName(userInfo ? userInfo.display_name : '');
      setUserEmail(userInfo ? userInfo.email : '');
      setIsEdit(true);
    }
  };
  const handleUserNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };
  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserEmail(event.currentTarget.value);
  };
  const onUserProfileUpdate = () => {
    if (!userName) {
      toast.error('name is empty!');
      return;
    }
    if (!userEmail) {
      toast.error('email is empty!');
      return;
    }
    if (!validateEmail(userEmail)) {
      toast.error('email invalid!');
      return;
    }

    if (userInfo) {
      const updateUser: UserInfoState = {
        ...userInfo,
        display_name: userName,
        email: userEmail,
      };
      _sendUpdateUser(updateUser);
    }
  };
  React.useEffect(() => {
    if (sendUpdateUserRes) {
      dispatch(updateUser(sendUpdateUserRes));
      toast.success('profile update successed!');
      onEdit();
    }
  }, [sendUpdateUserRes]);
  return (
    <>
      <ItemLayout onClick={onEdit}>
        <div className='w-10 flex items-center justify-center'>
          <PersonSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <div className='font-bold pr-2'>{userInfo?.display_name}</div>
        <div className='flex flex-1 truncate'>{userInfo?.email}</div>
      </ItemLayout>
      <AnimatedView show={isEdit}>
        <div className='p-4 border-2 border-dark-gray text-black'>
          <div className='flex flex-row w-full p-4 items-center justify-between'>
            <div className='text-sm font-normal' onClick={onEdit}>
              Cancel
            </div>
            <div className='text-lg font-bold'>Edit Profile</div>
            <div className='text-sm font-normal' onClick={onUserProfileUpdate}>
              Save
            </div>
          </div>
          <label className='block mt-4 w-full'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold uppercase">Name</span>
            <input
              type='text'
              name='name'
              autoComplete='off'
              value={userName}
              onChange={handleUserNameChange}
              className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter Name'
            />
          </label>
          <label className='block mt-4 w-full'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold uppercase">Email</span>
            <input
              type='email'
              name='email'
              autoComplete='off'
              value={userEmail}
              onChange={handleEmailChange}
              className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter Name'
            />
          </label>
        </div>
      </AnimatedView>
    </>
  );
}

export default UserNameAndEmail;
