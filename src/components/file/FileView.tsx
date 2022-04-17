import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDownSvg,
  ClickArrowSvg,
  DownArrowSvg,
  FolderSvg,
  HomeSvg,
  LeftArrowSvg,
  MenuSvg,
  RightArrowSvg,
  SearchSvg,
} from '../../assets/svg';
import { sendGetMyClients } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';

function FileView() {
  const [myClientList, setMyClientList] = useState<ClientState[]>([]);

  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
  }, []);
  useEffect(() => {
    if (getMyClientsRes) {
      setMyClientList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  const defaultOptions = [
    {
      key: 'document',
      name: 'Document',
    },
    {
      key: 'photo',
      name: 'Photo',
    },
    {
      key: 'music',
      name: 'Music',
    },
  ];

  return (
    <>
      <div className='w-full flex flex-row justify-between items-center mt-4'>
        <LeftArrowSvg strokeWidth={4} className='w-6 h-6 text-svg' onClick={() => navigate(-1)} />
        <RightArrowSvg strokeWidth={4} className='w-6 h-6 text-svg' />
      </div>
      <div className='w-full flex flex-row justify-between items-center mt-4 px-4 text-white text-xl'>
        <div className='w-10 h-10 flex items-center justify-center relative'>
          <FolderSvg fill='#7C7272' className='w-10 h-10 text-[#7C7272] absolute top-0 left-0' />
          <HomeSvg strokeWidth={4} className='w-5 h-5 z-10 text-black' />
        </div>
        <div>Internal storage</div>
        <SearchSvg strokeWidth={4} className='w-6 h-6' />
      </div>
      <div className='w-full flex flex-row justify-between items-center mt-4 px-8 text-white text-xl'>
        <div className='flex flex-1'>All</div>
        <div className='flex flex-row justify-center items-center text-[#7C7272]'>
          <ArrowUpDownSvg strokeWidth={4} className='w-6 h-6 -mr-2' />
          <MenuSvg stroke='#7C7272' strokeWidth={4} className='w-6 h-6' />
          <DownArrowSvg strokeWidth={4} className='w-6 h-6' />
        </div>
      </div>
      <ul role='list' className='w-full'>
        {myClientList.map(client => (
          <li
            key={client.client_id}
            className='flex flex-row w-full items-center text-white bg-card-gray p-4 mb-4 rounded-2xl'
            // onClick={() => navigate('/deliverables/file-manager/screenshot')}
          >
            <div className='w-10 h-10 flex items-center justify-center bg-[#FF8A00] rounded-xl'>
              <FolderSvg fill='white' className='w-7 h-7 text-white' />
            </div>
            <div className='flex flex-1 justify-center uppercase'>{client.client_name}</div>
            <ClickArrowSvg className='w-8 h-8' />
          </li>
        ))}
      </ul>
      <ul role='list' className='w-full'>
        {defaultOptions.map(item => (
          <li key={item.key} className='flex flex-row w-full items-center text-white bg-card-gray p-4 mb-4 last:mb-0 rounded-2xl'>
            <div className='w-10 h-10 flex items-center justify-center bg-[#FF8A00] rounded-xl'>
              <FolderSvg fill='white' className='w-7 h-7 text-white' />
            </div>
            <div className='flex flex-1 justify-center uppercase'>{item.name}</div>
            <ClickArrowSvg className='w-8 h-8' />
          </li>
        ))}
      </ul>
    </>
  );
}

export default FileView;
