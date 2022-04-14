import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClickArrowSvg, HouseSvg, PersonSvg } from '../../assets/svg';
import { sendUpdateUser } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { validateEmail } from '../../lib/utils';
import { UserInfoState } from '../../modules/user';
import { RootState } from '../../store';
import { updateUser } from '../../store/features/userSlice';
import AnimatedView from '../common/AnimatedView';
import ItemLayout from '../common/ItemLayout';

function Organization() {
  const [isEdit, setIsEdit] = useState(false);
  const [organizationName, setOrganizationName] = React.useState('');
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendUpdateUser, , sendUpdateUserRes] = useRequest(sendUpdateUser);
  const dispatch = useDispatch();

  const onEdit = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setOrganizationName('');
      setIsEdit(true);
    }
  };
  const changeOrganizationName = (event: React.FormEvent<HTMLInputElement>) => {
    setOrganizationName(event.currentTarget.value);
  };
  const onUserProfileUpdate = () => {
    if (!organizationName) {
      toast.error('name is empty!');
      return;
    }

    // if (userInfo) {
    //   const updateUser: UserInfoState = {
    //     ...userInfo,
    //     display_name: userName,
    //     email: userEmail,
    //   };
    //   _sendUpdateUser(updateUser);
    // }
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
      <ItemLayout className='mt-2' onClick={onEdit}>
        <div className='w-10 flex items-center justify-center'>
          <HouseSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1'>
          <div className='pr-2'>Organization</div>
          <div className='text-rouge-blue'>ID Logistics</div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <AnimatedView show={isEdit}>
        <div className='p-4 border-2 border-dark-gray text-black'>
          <div className='flex flex-row w-full p-4 items-center justify-between'>
            <div className='text-sm font-normal' onClick={onEdit}>
              Cancel
            </div>
            <div className='text-lg font-bold'>Organization</div>
            <div className='text-sm font-normal' onClick={onUserProfileUpdate}>
              Save
            </div>
          </div>
          <label className='block mt-4 w-full'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold uppercase">Name</span>
            <input
              type='text'
              name='organizationName'
              value={organizationName}
              onChange={changeOrganizationName}
              className='mt-1 px-3 py-2 bg-transparent border shadow-sm border-dark-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter Name'
            />
          </label>
        </div>
      </AnimatedView>
    </>
  );
}

export default Organization;
