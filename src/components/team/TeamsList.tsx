import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { sendUserAll, sendCompanyMembers } from '../../lib/api';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { UserInfoState } from '../../modules/user';
import { toast } from 'react-toastify';
import TeamMemberSetting from './TeamMemberSetting';
import UserType from '../common/UserType';
import LazyImage from '../common/LazyImage';
import { CompanyMemberState } from '../../modules/team';

function TeamsList() {
  const [myTeamMemberList, setMyTeamMemberList] = useState<CompanyMemberState[]>([]);
  const [selectedMember, setSelectedMember] = useState<CompanyMemberState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState<UserInfoState[]>([]);
  const [filterUserList, setFilterUserList] = useState<UserInfoState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendUserAll, , sendUserAllRes] = useRequest(sendUserAll);
  const [_sendCompanyMembers, , sendCompanyMembersRes] = useRequest(sendCompanyMembers);

  React.useEffect(() => {
    const user_id = userInfo?.user_id;
    _sendCompanyMembers(user_id);
    _sendUserAll();
  }, []);
  React.useEffect(() => {
    if (sendCompanyMembersRes) {
      console.log(sendCompanyMembersRes);
      setMyTeamMemberList(sendCompanyMembersRes.member);
    }
  }, [sendCompanyMembersRes]);
  React.useEffect(() => {
    if (sendUserAllRes) {
      setAllUsers(sendUserAllRes);
    }
  }, [sendUserAllRes]);
  React.useEffect(() => {
    if (showModal) {
      const newFilterUserList: UserInfoState[] = [];
      allUsers.map(user => {
        let isIncluded = false;
        myTeamMemberList.map(member => {
          if (member.user_id === user.user_id) {
            isIncluded = true;
          }
        });
        if (user.user_id === userInfo?.user_id) {
          isIncluded = true;
        }
        if (!isIncluded) {
          newFilterUserList.push(user);
        }
      });
      setFilterUserList(newFilterUserList);
    }
  }, [showModal]);
  const onOpenAndCloseModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
    setSelectedMember(null);
  };
  const onSelectMember = (member: CompanyMemberState) => {
    if (selectedMember?.user_id === member.user_id) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
      setShowModal(false);
    }
  };
  const onSuccess = (member: UserInfoState) => {
    if (selectedMember) {
      const newMyTeamMemberList = myTeamMemberList.map(item => {
        if (item.user_id === member.user_id) {
          return member as CompanyMemberState;
        } else {
          return item as CompanyMemberState;
        }
      });
      toast.success('member updated successfully!');
      setMyTeamMemberList(newMyTeamMemberList);
      onSelectMember(member as CompanyMemberState);
    } else {
      const newMyTeamMemberList = myTeamMemberList;
      newMyTeamMemberList.unshift(member as CompanyMemberState);
      toast.success('task created successfully!');
      setMyTeamMemberList(newMyTeamMemberList);
      onOpenAndCloseModal();
    }
  };

  return (
    <>
      <HeaderWithTitle title='Manage Teams' />
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='font-bold'>Team Members</div>
          <div className='text-blue' onClick={onOpenAndCloseModal}>
            Invite
          </div>
        </div>
        {showModal && (
          <TeamMemberSetting
            selectedMember={selectedMember}
            filterUserList={filterUserList}
            onCancel={onOpenAndCloseModal}
            onSuccess={onSuccess}
          />
        )}
        <ul role='list' className='p-4'>
          {myTeamMemberList.map(member => (
            <li key={member.user_id} className='py-1 first:pt-0 last:pb-0'>
              <div className='flex rounded-md items-center' onClick={() => onSelectMember(member)}>
                <LazyImage
                  className='w-6 h-6 rounded-full'
                  placeholderImg='https://via.placeholder.com/400x200.png?text=This+Will+Be+Shown+Before+Load'
                  src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
                />
                <div className={`flex flex-1 ml-2 capitalize truncate ${member.user_id === selectedMember?.user_id && 'text-rouge-blue'}`}>
                  {member.display_name}
                </div>
                <UserType user={member} />
              </div>
              {selectedMember && selectedMember.user_id === member.user_id && (
                <TeamMemberSetting
                  selectedMember={selectedMember}
                  filterUserList={filterUserList}
                  onCancel={() => onSelectMember(member)}
                  onSuccess={onSuccess}
                />
              )}
            </li>
          ))}
        </ul>
      </SmallLayout>
    </>
  );
}

export default TeamsList;
