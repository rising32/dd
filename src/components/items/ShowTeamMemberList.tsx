import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendTeamMembers } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { UserInfoState } from '../../modules/user';
import { RootState } from '../../store';
import Select, { SingleValue } from 'react-select';
import { SelectOpionState } from '../../modules/common';
import { colourStyles } from '../../lib/utils/style';

interface Props {
  selectedMember: UserInfoState | null;
  onSelectMember: (member: UserInfoState | null) => void;
}
function ShowTeamMemberList({ selectedMember, onSelectMember }: Props) {
  const [teamMemberList, setTeamMemberList] = React.useState<UserInfoState[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOpionState[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOpionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTeamMembers, , sendTeamMembersRes] = useRequest(sendTeamMembers);

  React.useEffect(() => {
    if (selectedMember) {
      setSelectedOption({ label: selectedMember.display_name, value: selectedMember.user_id });
    } else {
      setSelectedOption(null);
    }
  }, [selectedMember]);
  React.useEffect(() => {
    setIsLoading(true);
    const owner_id = userInfo?.user_id;
    _sendTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (sendTeamMembersRes) {
      setTeamMemberList(sendTeamMembersRes.member);

      const options: SelectOpionState[] = sendTeamMembersRes.member.map(member => ({
        value: member.user_id,
        label: member.display_name,
      }));
      setSelectOptions(options);

      setIsLoading(false);
    }
  }, [sendTeamMembersRes]);
  const handleChange = (option: SingleValue<SelectOpionState>) => {
    if (option) {
      teamMemberList.map(member => {
        if (member.user_id === option?.value) {
          onSelectMember(member);
        }
      });
    } else {
      onSelectMember(null);
    }
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold'>Who:</span>
      <Select<SelectOpionState>
        isClearable
        isLoading={isLoading}
        options={selectOptions}
        placeholder=''
        value={selectedOption}
        styles={colourStyles}
        onChange={handleChange}
      />
    </div>
  );
}

export default ShowTeamMemberList;
