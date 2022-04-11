import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { controlThumbnail } from '../../assets/images';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import SmallLayout from '../../container/common/SmallLayout';
import MainResponsive from '../../container/MainResponsive';
import useAxiosPost from '../../lib/hooks/useAxios';
import { ClientState } from '../../modules/client';
import { RootState } from '../../store';

function Tasks() {
  const [showClient, setShowClient] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const onSelectDate = (date: Date) => {
    setSelectedDate(date);
  };
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

  const openClients = () => {
    if (showClient) {
      setShowClient(false);
    } else {
      setShowClient(true);
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { response, error, loaded } = useAxiosPost('/team/get_team_members', {
      owner_id: userInfo?.user_id,
    });
    console.log(response);
  };
  const onSelectClient = (client: ClientState) => {
    // if (selectedClient?.client_id === client.client_id) {
    //   setSelectedClient(null);
    //   resetSelectedValues();
    // } else {
    //   setSelectedClient(client);
    //   setSelectedProject(null);
    //   setSelectedTask(null);
    //   setDeliverableValue('');
    //   setSelectedUser(null);
    //   setSelectedDay(null);
    //   const creator_id = account?.user.user_id;
    //   const client_id = client.client_id;
    //   _sendProjectWithClientId(creator_id, client_id);
    // }
    // setShowClient(false);
  };

  return (
    <MainResponsive>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className='flex items-center p-4'>
        <span className='flex-1 font-bold truncate'>{new Date(selectedDate).toLocaleDateString(undefined, options)}</span>
        <span>On time: 90%</span>
      </div>
      <SmallLayout className='mx-4 p-4 border-rouge-blue border-4 bg-card-gray'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-white text-lg font-bold pr-2'>Client :</span>
          <div className='border-dotted border-b-4 border-white flex-1 self-end' />
          <div className='text-rouge-blue text-lg font-bold px-2'>{selectedClient?.client_name}</div>
          <div className='w-6 h-6 flex items-center justify-center outline outline-1 ml-2 bg-rouge-blue' onClick={openClients}>
            <img src={controlThumbnail} className='h-4 w-auto' />
          </div>
        </div>
      </SmallLayout>
    </MainResponsive>
  );
}

export default Tasks;
