import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendCompanyMembers } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { UserInfoState } from '../../../modules/user';
import { RootState } from '../../../store';
import Select, { OnChangeValue, StylesConfig } from 'react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { ITasksControlFormInput } from '../TasksControl';

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
  field: ControllerRenderProps<ITasksControlFormInput, 'member'>;
}
function Member({ field }: Props) {
  const [memberList, setMemberList] = React.useState<UserInfoState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendCompanyMembers, , sendCompanyMembersRes] = useRequest(sendCompanyMembers);

  React.useEffect(() => {
    setIsLoading(true);
    const owner_id = userInfo?.user_id;
    _sendCompanyMembers(owner_id);
  }, []);
  React.useEffect(() => {
    if (sendCompanyMembersRes) {
      setMemberList(sendCompanyMembersRes.member);

      setIsLoading(false);
    }
  }, [sendCompanyMembersRes]);
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
        options={memberList}
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

export default Member;
