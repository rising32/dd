import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SmallLayout from '../../container/common/SmallLayout';
import useRequest from '../../lib/hooks/useRequest';
import { sendGetMyClients } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState, useAppDispatch } from '../../store';
import { removeLoading, showLoading } from '../../store/features/coreSlice';
import { PenSvg } from '../../assets/svg';
import ModalView from '../base/ModalView';
import CreateAndEditClientTemplate from './CreateAndEditClientTemplate';

function ClientsView() {
  const [myClientList, setMyClientList] = useState<ClientState[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { admin_info } = useSelector((state: RootState) => state.companyInfo);
  const [_sendGetMyClients, , getMyClientsRes] = useRequest(sendGetMyClients);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(showLoading());
    const user_id = admin_info?.user_id;
    _sendGetMyClients(user_id);
  }, []);
  React.useEffect(() => {
    if (getMyClientsRes) {
      setMyClientList(getMyClientsRes.clients);
      dispatch(removeLoading());
    }
  }, [getMyClientsRes]);
  const onSelectClient = (client: ClientState) => {
    if (selectedClient?.client_id === client.client_id) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
      setShowModal(true);
    }
  };
  const onSuccess = (client: ClientState) => {
    if (selectedClient) {
      const newMyClientList = myClientList.map(item => {
        if (item.client_id === client.client_id) {
          return client;
        } else {
          return item;
        }
      });
      setMyClientList(newMyClientList);
      setSelectedClient(null);
      onClose();
    } else {
      const newClientList = myClientList;
      newClientList.unshift(client);
      setMyClientList(newClientList);
      setSelectedClient(null);
      onClose();
    }
    dispatch(removeLoading());
  };

  const onClose = () => {
    setShowModal(false);
    setSelectedClient(null);
  };
  const onCreateClient = () => {
    setShowModal(true);
    setSelectedClient(null);
  };

  return (
    <>
      <SmallLayout className='flex flex-1 flex-col bg-white py-4 mt-4 text-black'>
        <div className='flex flex-row px-4 items-center justify-between pb-2'>
          <div className='font-bold'>Clients</div>
          {userInfo?.role_id === 1 && (
            <div className='text-blue' onClick={onCreateClient}>
              Create
            </div>
          )}
        </div>
        <ul role='list' className='p-4'>
          {myClientList.map(client => (
            <li key={client.client_id} className='flex rounded-md pb-2 items-center first:pt-0 last:pb-0'>
              <div className={`flex flex-1 uppercase truncate ${client.client_id === selectedClient?.client_id && 'text-rouge-blue'}`}>
                {client.client_name}
              </div>
              <PenSvg
                className={`w-4 h-4 ${client.client_id === selectedClient?.client_id && 'stroke-rouge-blue'}`}
                onClick={() => onSelectClient(client)}
              />
            </li>
          ))}
        </ul>
      </SmallLayout>
      <ModalView isOpen={showModal} onClose={onClose}>
        <CreateAndEditClientTemplate selectedClient={selectedClient} onCancel={onClose} onSuccess={onSuccess} />
      </ModalView>
    </>
  );
}

export default ClientsView;
