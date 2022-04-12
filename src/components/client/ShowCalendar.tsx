import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendGetMyClients } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';
import FullCalendar from '../calendar/FullCalendar';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

interface Props {
  selectedWhen: Date | null;
  onSelectWhen: (date: Date) => void;
}
function ShowCalendar({ selectedWhen, onSelectWhen }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [clientList, setClientList] = useState<ClientState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  const openCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const onClickWhen = (date: Date) => {
    onSelectWhen(date);
    setShowCalendar(false);
  };

  return (
    <>
      <div className='flex justify-between items-center py-1'>
        <span className='text-white text-lg font-bold pr-2'>Client :</span>
        <div className='border-dotted border-b-4 border-white flex-1 self-end' />
        <div className='text-rouge-blue text-lg font-bold px-2'>{selectedWhen?.toDateString()}</div>
        <div className='w-6 h-6 flex items-center justify-center' onClick={openCalendar}>
          <DownUpIcon isShow={showCalendar} />
        </div>
      </div>
      <AnimatedView show={showCalendar}>
        <div className='flex justify-between items-center bg-white text-black'>
          <FullCalendar selectedDate={selectedWhen || new Date()} onSelectDate={onClickWhen} />
        </div>
      </AnimatedView>
    </>
  );
}

export default ShowCalendar;
