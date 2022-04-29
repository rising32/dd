import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateClient, sendRegisterMyClient, sendUpdateClient } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState, useAppDispatch } from '../../store';
import { changeClientCount } from '../../store/features/companySlice';

interface Props {
  isEdit?: boolean;
  value?: string;
  selectedClient?: ClientState;
  onCancel: () => void;
  onSuccess: (client: ClientState) => void;
}

function CreateAndEditClientTemplate({ isEdit, value, selectedClient, onCancel, onSuccess }: Props) {
  const [clientName, setClientName] = useState('');
  const [selectableClient, setSelectableClient] = useState<ClientState | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [_sendCreateClient, , createClientRes] = useRequest(sendCreateClient);
  const [_sendRegisterMyClient, , sendRegisterMyClientRes] = useRequest(sendRegisterMyClient);
  const [_sendUpdateClient, , sendUpdateClientRes] = useRequest(sendUpdateClient);

  React.useEffect(() => {
    if (isEdit) {
      setClientName(selectedClient?.client_name || '');
    } else {
      setClientName(value || '');
    }
  }, [isEdit, value]);

  const onChangeClientName = (event: React.FormEvent<HTMLInputElement>) => {
    setClientName(event.currentTarget.value);
  };
  const onOk = () => {
    if (isEdit) {
      //
    } else {
      const client_name = clientName;
      const is_active = true;
      _sendCreateClient(client_name, is_active);
    }
  };
  React.useEffect(() => {
    if (createClientRes) {
      const user_id = userInfo?.user_id;
      const client_id = createClientRes.client_id;
      const is_active = createClientRes.is_active;
      _sendRegisterMyClient(user_id, client_id, is_active);
      setSelectableClient(createClientRes);
    }
  }, [createClientRes]);
  React.useEffect(() => {
    if (sendRegisterMyClientRes && selectableClient) {
      onSuccess(selectableClient);
      dispatch(changeClientCount());
    }
  }, [sendRegisterMyClientRes]);

  return (
    <>
      <div className='text-center font-bold'>{isEdit ? 'Edit this client' : 'Create a new client'}</div>
      <label className='block w-full mt-4'>
        <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
        <input
          type='text'
          name='name'
          autoComplete='off'
          value={clientName}
          onChange={onChangeClientName}
          className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
          placeholder='Enter client name'
        />
      </label>
      <div className='flex justify-between w-full px-8 pt-4 text-lg font-bold'>
        <div onClick={onCancel}>No</div>
        <div className='text-rouge-blue' onClick={onOk}>
          Yes
        </div>
      </div>
    </>
  );
}

export default CreateAndEditClientTemplate;
