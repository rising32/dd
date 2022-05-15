import React from 'react';
import { AdminSvg, ManagerSvg, UserSvg } from '../../assets/svg';
import { UserInfoState } from '../../modules/user';

interface Props {
  user: UserInfoState;
}

function UserType({ user }: Props): JSX.Element {
  return (
    <>
      {user.role_id === 1 && <AdminSvg className='w-4 h-4 mr-2' />}
      {user.role_id === 2 && <ManagerSvg className='w-4 h-4 mr-2' />}
      {user.role_id === 3 && <UserSvg className='w-4 h-4 mr-2' />}
    </>
  );
}

export default UserType;
