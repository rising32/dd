import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendTeamMembers } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { UserInfoState } from '../../modules/user';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

interface Props {
  selectedMember: UserInfoState | null;
  onSelectMember: (member: UserInfoState) => void;
}
function ShowTeamMemberList({ selectedMember, onSelectMember }: Props) {
  const [showMemberList, setShowMemberList] = useState(false);
  const [teamMemberList, setTeamMemberList] = React.useState<UserInfoState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTeamMembers, , sendTeamMembersRes] = useRequest(sendTeamMembers);

  const openMemberList = () => {
    setShowMemberList(!showMemberList);
  };
  React.useEffect(() => {
    const owner_id = userInfo?.user_id;
    _sendTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (sendTeamMembersRes) {
      setTeamMemberList(sendTeamMembersRes.member);
    }
  }, [sendTeamMembersRes]);
  const onClickMember = (member: UserInfoState) => {
    onSelectMember(member);
    setShowMemberList(false);
  };

  return (
    <>
      <div className='flex justify-between items-center py-1'>
        <span className='text-white text-lg font-bold pr-2'>Who :</span>
        <div className='border-dotted border-b-4 border-white flex-1 self-end' />
        <div className='text-rouge-blue text-lg font-bold px-2'>{selectedMember?.display_name}</div>
        <div className='w-6 h-6 flex items-center justify-center' onClick={openMemberList}>
          <DownUpIcon isShow={showMemberList} />
        </div>
      </div>
      <AnimatedView show={showMemberList}>
        <ul role='list' className='p-6'>
          {teamMemberList.map(member => (
            <li key={member.user_id} className='flex items-center py-2 first:pt-0 last:pb-0' onClick={() => onClickMember(member)}>
              <div className='flex flex-1 overflow-hidden'>
                <p className='font-medium text-slate-900'>{member.display_name}</p>
              </div>
              {selectedMember?.user_id === member.user_id && <CheckSvg strokeWidth={2} className='w-6 h-6 stroke-rouge-blue' />}
            </li>
          ))}
        </ul>
      </AnimatedView>
    </>
  );
}

export default ShowTeamMemberList;
