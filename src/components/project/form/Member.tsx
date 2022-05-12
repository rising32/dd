import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendCompanyMembers } from '../../../lib/api';
import useRequest from '../../../lib/hooks/useRequest';
import { UserInfoState } from '../../../modules/user';
import { RootState } from '../../../store';
import Select, { OnChangeValue } from 'react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { IProjectControlFormInput } from '../CreateAndEditProjectTemplate';
import { ProjectState } from '../../../modules/project';

interface Props {
  field: ControllerRenderProps<IProjectControlFormInput, 'member'>;
  selectedProject?: ProjectState | null;
}
function Member({ field, selectedProject }: Props) {
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [memberList, setMemberList] = React.useState<UserInfoState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [_sendCompanyMembers, , sendCompanyMembersRes] = useRequest(sendCompanyMembers);

  React.useEffect(() => {
    setIsLoading(true);
    const user_id = userInfo?.user_id;
    _sendCompanyMembers(user_id);
  }, []);
  React.useEffect(() => {
    if (userInfo && sendCompanyMembersRes) {
      const newList = [];
      newList.push(userInfo);
      const newMemberList = newList.concat(sendCompanyMembersRes.member);
      setMemberList(newMemberList);

      if (selectedProject) {
        const manager = newMemberList.find(member => member.user_id === selectedProject.creator_id);
        field.onChange(manager);
      }

      setIsLoading(false);
    }
  }, [sendCompanyMembersRes]);
  const handleChange = (newValue: OnChangeValue<UserInfoState, false>) => {
    field.onChange(newValue);
  };

  return (
    <label className='block w-full mt-4'>
      <span className='block text-sm font-medium mb-1'>PROJECT MANAGER</span>
      <Select<UserInfoState>
        isClearable
        name={field.name}
        ref={field.ref}
        isLoading={isLoading}
        options={memberList}
        defaultValue={memberList[0]}
        placeholder='Enter Manager'
        value={field.value}
        getOptionValue={option => option.user_id.toString()}
        getOptionLabel={option => option.display_name}
        onChange={handleChange}
      />
    </label>
  );
}

export default Member;
