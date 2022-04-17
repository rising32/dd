import React, { useEffect, useState } from 'react';
import HeaderWithTitle from '../base/HeaderWithTitle';
import { redDocumentThumbnail } from '../../assets/images';
import {
  BriefcaseSvg,
  ClickArrowSvg,
  EuroSvg,
  GroupSvg,
  HouseSvg,
  PersonSvg,
  SettingSvg,
  HomeSvg,
  PenSvg,
  ProjectSvg,
  TaskSvg,
  DollarSvg,
} from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import ItemLayout from '../common/ItemLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import useRequest from '../../lib/hooks/useRequest';
import { sendCompanyProfile } from '../../lib/api';
import { CompanyInfoState } from '../../modules/company';
import AccountSetting from '../items/AccountSetting';

function AccountView() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoState>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [_sendCompanyProfile, , sendCompanyProfileRes] = useRequest(sendCompanyProfile);

  useEffect(() => {
    const member_id = userInfo?.user_id;
    _sendCompanyProfile(member_id);
  }, [userInfo]);
  useEffect(() => {
    if (sendCompanyProfileRes) {
      console.log(sendCompanyProfileRes);
      setCompanyInfo(sendCompanyProfileRes.company);
    }
  }, [sendCompanyProfileRes]);

  return (
    <>
      <HeaderWithTitle title='Your Account' isAccount />
      <SmallLayout className='mt-4 px-1 py-4 bg-white text-black' onClick={() => navigate('/account/user')}>
        <div className='text-lg font-bold uppercase text-center'>company profile</div>
        <ItemLayout>
          <div className='w-10 flex items-center justify-center'>
            <PersonSvg className='w-6 h-6 fill-card-gray' />
          </div>
          <div className='font-bold pr-2'>{companyInfo?.admin_info.display_name}</div>
          <div className='flex flex-1 truncate'>{companyInfo?.admin_info.email}</div>
        </ItemLayout>
        <ItemLayout className='mt-2'>
          <div className='w-10 flex items-center justify-center'>
            <HouseSvg className='w-6 h-6' />
          </div>
          <div className='flex flex-1'>
            <div className='pr-2'>Organization</div>
            <div className='text-rouge-blue'>{companyInfo?.company_name}</div>
          </div>
          <ClickArrowSvg className='w-6 h-6' />
        </ItemLayout>
        <ItemLayout className='mt-2'>
          <div className='w-10 flex items-center justify-center'>
            <BriefcaseSvg className='w-6 h-6' />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div className='pr-2'>Work Setting</div>
            <img src={redDocumentThumbnail} className='h-4 w-auto' />
            <div className='text-rouge-blue'>{companyInfo?.time_format === '12' ? 'AM/PM' : '24 Hour  '}</div>
          </div>
          <ClickArrowSvg className='w-6 h-6' />
        </ItemLayout>
        <ItemLayout className='mt-2'>
          <div className='w-10 flex items-center justify-center'>
            <SettingSvg className='w-6 h-6' />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div className='pr-2 truncate'>Date, time and currency</div>
            <img src={redDocumentThumbnail} className='h-4 w-auto' />
            {companyInfo?.currency === 0 && <EuroSvg className='w-6 h-6 fill-rouge-blue' />}
            {companyInfo?.currency === 1 && <DollarSvg className='w-6 h-6 fill-rouge-blue' />}
          </div>
          <ClickArrowSvg className='w-6 h-6' />
        </ItemLayout>
        <ItemLayout className='mt-2'>
          <div className='w-10 flex items-center justify-center'>
            <GroupSvg className='w-6 h-6' />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div className='pr-2'>{companyInfo?.member_count + ' Team member'}</div>
          </div>
          <ClickArrowSvg className='w-6 h-6' />
        </ItemLayout>
      </SmallLayout>
      <SmallLayout className='mt-4 px-1 py-4 bg-dark-gray text-black relative'>
        <div className='text-lg font-bold uppercase text-center'>MEMBER PROFILE</div>
        <ItemLayout onClick={() => navigate('/account/user')}>
          <div className='w-10 flex items-center justify-center'>
            <PersonSvg className='w-6 h-6 fill-rouge-blue' />
          </div>
          <div className='font-bold pr-2'>{userInfo?.display_name}</div>
          <div className='flex flex-1 truncate'>{userInfo?.email}</div>
        </ItemLayout>
        <ItemLayout className='mt-2' onClick={() => navigate('clients')}>
          <div className='w-10 flex items-center justify-center'>
            <HomeSvg className='w-6 h-6 fill-rouge-blue' />
          </div>
          <div className='flex flex-1'>
            <div className='pr-2'>{companyInfo?.client_count + ' Clients'}</div>
          </div>
        </ItemLayout>
        <ItemLayout className='mt-2' onClick={() => navigate('projects')}>
          <div className='w-10 flex items-center justify-center'>
            <ProjectSvg className='w-6 h-6 fill-rouge-blue' />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div className='pr-2'>{companyInfo?.project_count + ' Projects'}</div>
          </div>
        </ItemLayout>
        <ItemLayout className='mt-2' onClick={() => navigate('tasks')}>
          <div className='w-10 flex items-center justify-center'>
            <TaskSvg className='w-6 h-6 fill-rouge-blue' />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div className='pr-2'>{companyInfo?.task_count + ' Tasks'}</div>
          </div>
        </ItemLayout>
        <div className='absolute top-4 right-4' onClick={() => navigate('/account/user')}>
          <PenSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
      </SmallLayout>
    </>
  );
}

export default AccountView;
