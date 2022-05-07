import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useRequest from '../../lib/hooks/useRequest';
import { sendCreateClient, sendRegisterMyClient, sendUpdateClient } from '../../lib/api';
import { ClientState } from '../../modules/client';
import { RootState, useAppDispatch } from '../../store';
import { changeClientCount } from '../../store/features/companySlice';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { showLoading } from '../../store/features/coreSlice';

interface IClientControlFormInput {
  name: string;
}
interface Props {
  value?: string;
  selectedClient?: ClientState | null;
  onCancel: () => void;
  onSuccess: (client: ClientState) => void;
}

function CreateAndEditClientTemplate({ value, selectedClient, onCancel, onSuccess }: Props) {
  const [selectableClient, setSelectableClient] = useState<ClientState | null>(null);

  const { handleSubmit, control } = useForm<IClientControlFormInput>({
    defaultValues: {
      name: value || selectedClient?.client_name,
    },
  });

  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [_sendCreateClient, , createClientRes] = useRequest(sendCreateClient);
  const [_sendRegisterMyClient, , sendRegisterMyClientRes] = useRequest(sendRegisterMyClient);
  const [_sendUpdateClient, , sendUpdateClientRes] = useRequest(sendUpdateClient);

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
    if (sendUpdateClientRes && selectedClient) {
      onSuccess(sendUpdateClientRes);
    }
  }, [sendUpdateClientRes]);
  React.useEffect(() => {
    if (sendRegisterMyClientRes && selectableClient) {
      onSuccess(selectableClient);
      dispatch(changeClientCount());
    }
  }, [sendRegisterMyClientRes]);
  const onSubmit: SubmitHandler<IClientControlFormInput> = data => {
    dispatch(showLoading());
    if (selectedClient) {
      _sendUpdateClient({ ...selectedClient, client_name: data.name });
    } else {
      console.log(data);
      const client_name = data.name;
      const is_active = true;
      _sendCreateClient(client_name, is_active);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='text-center font-bold'>{selectedClient ? 'Edit this client' : 'Create a new client'}</div>
      <Controller
        control={control}
        name='name'
        rules={{ required: true }}
        render={({ field }) => (
          <label className='block w-full mt-4'>
            <span className="after:content-['*'] after:ml-0.5 after:text-rouge-blue block text-sm font-medium">NAME</span>
            <input
              type='text'
              autoComplete='off'
              className='mt-1 px-3 py-2 bg-white border shadow-sm border-dark-gray placeholder-card-gray focus:outline-none focus:border-rouge-blue block w-full rounded-md sm:text-sm focus:ring-1'
              placeholder='Enter client Name'
              {...field}
            />
          </label>
        )}
      />
      <div className='flex justify-between w-full px-8 pt-4 text-lg font-bold'>
        <div onClick={onCancel}>No</div>
        <button type='submit' className='text-lg font-bold text-rouge-blue'>
          Yes
        </button>
      </div>
    </form>
  );
}

export default CreateAndEditClientTemplate;
