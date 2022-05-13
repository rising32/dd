import React, { useEffect, useState } from 'react';
import { sendAddMember, sendUpdateMember } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { CompanyMemberState } from '../../modules/team';
import { UserInfoState } from '../../modules/user';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import AnimatedView from '../common/AnimatedView';
import { changeMemberCount } from '../../store/features/companySlice';
import Checkbox from '../common/CheckBox';

interface Props {
  selectedMember: CompanyMemberState | null;
  filterUserList: UserInfoState[];
  onCancel: () => void;
  onSuccess: (member: UserInfoState) => void;
}
const TeamMemberSetting = ({ selectedMember, filterUserList, onCancel, onSuccess }: Props) => {
  const [memberName, setMemberName] = useState(selectedMember ? selectedMember.display_name : '');
  const [memberEmail, setMemberEmail] = useState(selectedMember ? selectedMember.email : '');
  const [hasFocus, setFocus] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfoState | null>(null);
  const [isManager, setIsManager] = useState(selectedMember?.role_id === 3 ? false : true);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { admin_info, company_id } = useSelector((state: RootState) => state.companyInfo);
  const dispatch = useAppDispatch();
  const [_sendAddMember, , sendAddMemberRes] = useRequest(sendAddMember);
  const [_sendUpdateMember, , sendUpdateMemberRes] = useRequest(sendUpdateMember);

  const onChangeMemberName = (event: React.FormEvent<HTMLInputElement>) => {
    setMemberName(event.currentTarget.value);
  };
  const onChangeMemberEmail = (event: React.FormEvent<HTMLInputElement>) => {
    setMemberEmail(event.currentTarget.value);
  };
  const onSelectUser = (user: UserInfoState) => {
    setMemberName(user.display_name);
    setMemberEmail(user.email);
    setSelectedUser(user);
    setFocus(false);
  };

  const onCreateOrEditClient = () => {
    if (!admin_info) return;
    if (selectedMember) {
      const params = {
        ...selectedMember,
        role_id: isManager ? 2 : 3,
      };
      _sendUpdateMember(params);
    } else {
      if (selectedUser) {
        const params = {
          cm_id: null,
          company_id,
          member_id: selectedUser.user_id,
          role_id: isManager ? 2 : 3,
        };
        _sendAddMember(params);
      }
    }
  };
  useEffect(() => {
    if (sendAddMemberRes && selectedUser) {
      onSuccess(selectedUser);
      dispatch(changeMemberCount());
    }
  }, [sendAddMemberRes]);
  useEffect(() => {
    if (sendUpdateMemberRes && selectedMember) {
      console.log(sendUpdateMemberRes);
      onSuccess({ ...selectedMember, role_id: sendUpdateMemberRes.role_id });
    }
  }, [sendUpdateMemberRes]);

  return (
    <div className='px-4 my-4 relative'>
      <label className='block'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='memberName'
          autoComplete='off'
          disabled={selectedMember !== null}
          value={memberName}
          onChange={onChangeMemberName}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Name'
        />
      </label>
      <AnimatedView show={hasFocus} className='max-h-32 overflow-scroll'>
        {filterUserList.map(user => (
          <div key={user.user_id} onClick={() => onSelectUser(user)}>
            {user.display_name} - {user.email}
          </div>
        ))}
      </AnimatedView>
      <label className='block mt-4'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">EMAIL</span>
        <input
          type='email'
          name='memberEmail'
          autoComplete='off'
          value={memberEmail}
          disabled={selectedMember !== null}
          onChange={onChangeMemberEmail}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter Email'
        />
      </label>
      <Checkbox checked={isManager} onChange={() => setIsManager(!isManager)} className='m-2'>
        Administrator
      </Checkbox>
      <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
        <div className='text-lg font-bold' onClick={onCancel}>
          Cancel
        </div>
        <div className='text-lg font-bold text-rouge-blue' onClick={onCreateOrEditClient}>
          {selectedMember ? 'Update' : 'Create'}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberSetting;
