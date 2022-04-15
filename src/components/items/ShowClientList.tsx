import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckSvg } from '../../assets/svg';
import { sendGetMyClients } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { ClientState } from '../../modules/client';
import { DeliverableInfoState } from '../../modules/deliverable';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import DownUpIcon from '../common/DownUpIcon';

interface Props {
  selectedClient: ClientState | null;
  onSelectClient: (client: ClientState) => void;
  deliverableInfo?: DeliverableInfoState | null;
}
function ShowClientList({ selectedClient, deliverableInfo, onSelectClient }: Props) {
  const [showClient, setShowClient] = useState(false);
  const [clientList, setClientList] = useState<ClientState[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);

  React.useEffect(() => {
    if (deliverableInfo) {
      getMyClients();
    } else {
      // onSelectClient(client);
    }
  }, [deliverableInfo]);
  const openClients = () => {
    if (showClient) {
      setShowClient(false);
    } else {
      if (deliverableInfo) {
        setShowClient(true);
      } else {
        getMyClients();
      }
    }
  };
  const getMyClients = () => {
    const user_id = userInfo?.user_id;
    _sendGetMyClients(user_id);
  };
  React.useEffect(() => {
    if (getMyClientsRes) {
      setClientList(getMyClientsRes.clients);
      if (deliverableInfo) {
        getMyClientsRes.clients.map(client => {
          if (client.client_id === deliverableInfo.client_id) {
            onClickClient(client);
          }
        });
      } else {
        setShowClient(true);
      }
    }
  }, [getMyClientsRes]);
  const onClickClient = (client: ClientState) => {
    onSelectClient(client);
    setShowClient(false);
  };

  return (
    <>
      <div className='flex justify-between items-center py-1'>
        <span className='text-white text-lg font-bold pr-2'>Client :</span>
        <div className='border-dotted border-b-4 border-white flex-1 self-end' />
        <div className='text-rouge-blue text-lg font-bold px-2'>{selectedClient?.client_name}</div>
        <div className='w-6 h-6 flex items-center justify-center' onClick={openClients}>
          <DownUpIcon isShow={showClient} />
        </div>
      </div>
      <AnimatedView show={showClient}>
        <ul role='list' className='p-6'>
          {clientList.map(client => (
            <li key={client.client_id} className='flex items-center py-2 first:pt-0 last:pb-0' onClick={() => onClickClient(client)}>
              <div className='flex flex-1 overflow-hidden'>
                <p className='font-medium text-slate-900'>{client.client_name}</p>
              </div>
              {selectedClient?.client_id === client.client_id && <CheckSvg strokeWidth={2} className='w-6 h-6 stroke-rouge-blue' />}
            </li>
          ))}
        </ul>
      </AnimatedView>
    </>
  );
}

export default ShowClientList;
