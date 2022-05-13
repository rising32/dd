import React from 'react';
import { redDocumentThumbnail } from '../../assets/images';
import { BriefcaseSvg, ClickArrowSvg, EuroSvg, GroupSvg, HouseSvg, PersonSvg, SettingSvg, DollarSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import ItemLayout from '../common/ItemLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

function CompanyInfo() {
  const { accountSetting } = useSelector((state: RootState) => state.user);
  const { admin_info, company_name, member_count } = useSelector((state: RootState) => state.companyInfo);
  const navigate = useNavigate();

  if (admin_info === null) {
    return <div />;
  }

  return (
    <SmallLayout className='mt-4 px-1 py-4 bg-white text-black' onClick={() => navigate('/account/user')}>
      <div className='text-lg font-bold uppercase text-center'>company profile</div>
      <ItemLayout>
        <div className='w-10 flex items-center justify-center'>
          <PersonSvg className='w-6 h-6 fill-card-gray' />
        </div>
        <div className='font-bold pr-2'>{admin_info?.display_name}</div>
        <div className='flex flex-1 truncate'>{admin_info?.email}</div>
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <HouseSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1'>
          <div className='pr-2'>Organization</div>
          <div className='text-rouge-blue'>{company_name}</div>
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
          <div className='text-rouge-blue'>{accountSetting.date_format === 0 ? 'AM/PM' : '24 Hour  '}</div>
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
          {accountSetting.currency === 0 && <EuroSvg className='w-6 h-6 fill-rouge-blue' />}
          {accountSetting.currency === 1 && <DollarSvg className='w-6 h-6 fill-rouge-blue' />}
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <GroupSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>
            {member_count}
            {' Company Member'}
          </div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
    </SmallLayout>
  );
}

export default CompanyInfo;
