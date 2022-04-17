import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { sendUserAll, sendAddMember, sendTeamMembers } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';
import HeaderWithTitle from '../base/HeaderWithTitle';
import ReactModal from 'react-modal';
import { UserInfoState } from '../../modules/user';
import { DefaultUserSvg } from '../../assets/svg';
import { toast } from 'react-toastify';
import TeamMemberSetting from './TeamMemberSetting';

function TeamsList() {
  const [myTeamMemberList, setMyTeamMemberList] = useState<UserInfoState[]>([]);
  const [selectedMember, setSelectedMember] = useState<UserInfoState | null>(null);
  const [selectableTeam, setSelectableTeam] = useState<UserInfoState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState<UserInfoState[]>([]);
  const [filterUserList, setFilterUserList] = useState<UserInfoState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendUserAll, , sendUserAllRes] = useRequest(sendUserAll);
  const [_sendAddMember, , sendAddMemberRes] = useRequest(sendAddMember);
  const [_sendTeamMembers, , sendTeamMembersRes] = useRequest(sendTeamMembers);

  React.useEffect(() => {
    const owner_id = userInfo?.user_id;
    _sendTeamMembers(owner_id);
    _sendUserAll();
  }, []);
  React.useEffect(() => {
    if (sendTeamMembersRes) {
      setMyTeamMemberList(sendTeamMembersRes.member);
    }
  }, [sendTeamMembersRes]);
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
  const onSelectMember = (member: UserInfoState) => {
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
          return member;
        } else {
          return item;
        }
      });
      toast.success('member updated successfully!');
      setMyTeamMemberList(newMyTeamMemberList);
      onSelectMember(member);
    } else {
      const newMyTeamMemberList = myTeamMemberList;
      newMyTeamMemberList.unshift(member);
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
          <div className='text-lg text-black font-bold'>Team Members</div>
          <div className='text-base text-blue' onClick={onOpenAndCloseModal}>
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
              <div className='flex rounded-md p-2 items-center' onClick={() => onSelectMember(member)}>
                <DefaultUserSvg className='w-6 h-6 rounded-full mr-2' />
                <div
                  className={`flex flex-1 text-lg capitalize truncate ${member.user_id === selectedMember?.user_id && 'text-rouge-blue'}`}
                >
                  {member.display_name}
                </div>
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
