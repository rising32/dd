import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ClickArrowSvg, HouseSvg } from '../../assets/svg';
import { sendUpdateCompany } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { RootState, useAppDispatch } from '../../store';
import { updateCompanyName } from '../../store/features/companySlice';
import AnimatedView from '../common/AnimatedView';
import ItemLayout from '../common/ItemLayout';

function Organization() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { company_name, company_id } = useSelector((state: RootState) => state.companyInfo);
  const [isEdit, setIsEdit] = useState(false);
  const [organizationName, setOrganizationName] = React.useState(company_name);

  const [_sendUpdateCompany, , sendUpdateCompanyRes] = useRequest(sendUpdateCompany);

  const onEdit = () => {
    if (userInfo && userInfo.role_id !== 1) {
      toast.error('Only Admin could control!');
    } else {
      if (isEdit) {
        setIsEdit(false);
      } else {
        setOrganizationName(company_name);
        setIsEdit(true);
      }
    }
  };
  const changeOrganizationName = (event: React.FormEvent<HTMLInputElement>) => {
    setOrganizationName(event.currentTarget.value);
  };
  const onOrganizationUpdate = () => {
    if (!organizationName) {
      toast.error('name is empty!');
      return;
    }
    _sendUpdateCompany({ company_id, company_name: organizationName });
  };
  React.useEffect(() => {
    if (sendUpdateCompanyRes) {
      dispatch(updateCompanyName(sendUpdateCompanyRes));
      onEdit();
    }
  }, [sendUpdateCompanyRes]);
  return (
    <>
      <ItemLayout className='mt-2' onClick={onEdit}>
        <div className='w-10 flex items-center justify-center'>
          <HouseSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1'>
          <div className='pr-2'>Organization</div>
          <div className='text-rouge-blue'>{company_name}</div>
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
            <div className='text-sm font-normal' onClick={onOrganizationUpdate}>
              Save
            </div>
          </div>
          <label className='block mt-4 w-full'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block font-bold uppercase">Name</span>
            <input
              type='text'
              name='organizationName'
              autoComplete='off'
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
