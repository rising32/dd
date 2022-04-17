import React from 'react';
import { redDocumentThumbnail } from '../../assets/images';
import { BriefcaseSvg, ClickArrowSvg, EuroSvg, GroupSvg, HouseSvg, PersonSvg, SettingSvg } from '../../assets/svg';
import SmallLayout from '../../container/common/SmallLayout';
import ItemLayout from '../common/ItemLayout';

function CompanyProfile() {
  return (
    <SmallLayout className='mt-4 px-1 py-4 bg-white text-black'>
      <div className='text-lg font-bold uppercase text-center'>company profile</div>
      <ItemLayout>
        <div className='w-10 flex items-center justify-center'>
          <PersonSvg className='w-6 h-6 fill-card-gray' />
        </div>
        <div className='font-bold pr-2'>Loubeyre</div>
        <div className='flex flex-1 truncate'>jf.loubeyre@gmail.com</div>
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <HouseSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1'>
          <div className='pr-2'>Organization</div>
          <div className='text-rouge-blue'>ID Logistics</div>
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
          <div className='text-rouge-blue'>AM/PM</div>
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
          <EuroSvg className='w-6 h-6 fill-rouge-blue' />
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <ItemLayout className='mt-2'>
        <div className='w-10 flex items-center justify-center'>
          <GroupSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2'>2 Team member</div>
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
    </SmallLayout>
  );
}

export default CompanyProfile;
