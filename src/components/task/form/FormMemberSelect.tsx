import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendTeamMembers } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { UserInfoState } from '../../../modules/user';
import { RootState } from '../../../store';
import Select from 'react-select';
import { OnChangeValue, StylesConfig } from 'react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { ITaskFilterFormInput } from '../TaskFilter';

const memeberStyles: StylesConfig<UserInfoState> = {
  container: styles => ({ ...styles, width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', width: '100%', border: 'none', boxShadow: 'none' }),
  option: (styles, { isDisabled, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: styles => ({ ...styles, color: '#DD0000', textAlign: 'end' }),
};
interface Props {
  field: ControllerRenderProps<ITaskFilterFormInput, 'member'>;
}
function FormMemberSelect({ field }: Props) {
  const [teamMemberList, setTeamMemberList] = React.useState<UserInfoState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendTeamMembers, , sendTeamMembersRes] = useRequest(sendTeamMembers);

  React.useEffect(() => {
    setIsLoading(true);
    const owner_id = userInfo?.user_id;
    _sendTeamMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (sendTeamMembersRes) {
      setTeamMemberList(sendTeamMembersRes.member);

      setIsLoading(false);
    }
  }, [sendTeamMembersRes]);
  const handleChange = (newValue: OnChangeValue<UserInfoState, false>) => {
    field.onChange(newValue);
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='font-bold'>Who:</span>
      <Select<UserInfoState>
        isClearable
        name={field.name}
        ref={field.ref}
        isLoading={isLoading}
        options={teamMemberList}
        placeholder=''
        value={field.value}
        getOptionValue={option => option.user_id.toString()}
        getOptionLabel={option => option.display_name}
        styles={memeberStyles}
        onChange={handleChange}
      />
    </div>
  );
}

export default FormMemberSelect;
