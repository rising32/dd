import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { controlThumbnail } from '../../assets/images';
import WeekCalendar from '../../components/calendar/WeekCalendar';
import Task from '../../components/task/Task';
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
      <Task />
    </MainResponsive>
  );
}

export default Tasks;
