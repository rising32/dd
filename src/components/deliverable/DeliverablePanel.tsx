import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { PriorityState } from '../../modules/weekPriority';
import useRequest from '../../lib/hooks/useRequest';
import { format } from 'date-fns';
import { sendCreateDeliverable, sendDeliverableInfo, sendUpdateDeliverable } from '../../lib/api';
import { DeliverableInfoState, DeliverableState } from '../../modules/deliverable';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import FormClientSelect from './form/FormClientSelect';
import FormProjectSelect from './form/FormProjectSelect';
import FormTaskSelect from './form/FormTaskSelect';
import { ClientState } from '../../modules/client';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import PlusButton from '../common/PlusButton';
import DeliverableTab from './DeliverableTab';
import SmallLayout from '../../container/common/SmallLayout';
import DeliverableOfDate from './DeliverableOfDate';
import { showLoading } from '../../store/features/coreSlice';
import BeforeWeeklyPriority from './BeforeWeeklyPriority';
import ModalView from '../base/ModalView';

export interface IDeliverableFormInput {
  client: ClientState | null;
  project: ProjectState | null;
  task: TaskState | null;
  deliverable: string;
}
interface Props {
  selectedDate: Date;
}

function DeliverablePanel({ selectedDate }: Props) {
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableState | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityState | null>(null);
  const [selectedDeliverableTab, setSelectedDeliverableTab] = useState<string>('');
  const [deliverableInfo, setDeliverableInfo] = useState<DeliverableInfoState | null>(null);
  const [selectablePriority, setSelectablePriority] = useState<PriorityState | null>(null);
  const [updatedPriority, setUpdatededPriority] = useState<PriorityState | null>(null);
  const [disabled, setDisabled] = useState(false);
  const { handleSubmit, control, reset, setValue, register } = useForm<IDeliverableFormInput>({
    defaultValues: {
      client: null,
      project: null,
      task: null,
      deliverable: '',
    },
  });

  const [_sendCreateDeliverable, , sendCreateDeliverableRes] = useRequest(sendCreateDeliverable);
  const [_sendDeliverableInfo, , sendDeliverableInfoRes] = useRequest(sendDeliverableInfo);
  const [_sendUpdateDeliverable, , sendUpdateDeliverableRes] = useRequest(sendUpdateDeliverable);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const onSelectDeliverable = (deliverable: DeliverableState | null) => {
    console.log(deliverable);
    if (deliverable && selectedDeliverable?.deliverable_id !== deliverable.deliverable_id) {
      setSelectedDeliverable(deliverable);
      setSelectedPriority(null);
      const deliverable_id = deliverable.deliverable_id;
      _sendDeliverableInfo(deliverable_id);
      setSelectedDeliverableTab('Details');
    } else {
      setSelectedDeliverable(null);
      reset();
      setDeliverableInfo(null);
      setSelectedDeliverableTab('');
    }
  };
  React.useEffect(() => {
    if (sendDeliverableInfoRes) {
      setDeliverableInfo(sendDeliverableInfoRes.data);
      setValue('deliverable', sendDeliverableInfoRes.data.deliverable_name);
    }
  }, [sendDeliverableInfoRes]);
  const onSelectDeliverableTab = (tab: string) => {
    setSelectedDeliverableTab(tab);
  };
  const onSelectPriority = (priority: PriorityState | null) => {
    if (priority && selectedPriority?.wp_id !== priority.wp_id) {
      setSelectablePriority(priority);
      setSelectedDeliverable(null);
    } else {
      setSelectedPriority(null);
      setSelectablePriority(null);
      setDisabled(false);
      reset();
    }
  };
  const onDeliverableFromPriority = () => {
    if (selectablePriority) {
      setDisabled(true);
      setSelectedPriority(selectablePriority);
      setValue('deliverable', selectablePriority.priority);
      setSelectablePriority(null);
    }
  };
  const onSubmit: SubmitHandler<IDeliverableFormInput> = data => {
    if (userInfo && data.task) {
      dispatch(showLoading());
      if (deliverableInfo && deliverableInfo.task_id === data.task.task_id) {
        _sendUpdateDeliverable({
          ...deliverableInfo,
          task_id: data.task.task_id,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          deliverable_name: data.deliverable,
        });
      }
      if (!deliverableInfo) {
        const deliverable: DeliverableState = {
          deliverable_id: null,
          deliverable_name: data.deliverable,
          user_id: userInfo.user_id,
          task_id: data.task.task_id,
          periority_id: selectedPriority && selectedPriority.wp_id ? selectedPriority.wp_id : null,
          budget: 50,
          planned_end_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: null,
          is_completed: 0,
        };
        _sendCreateDeliverable(deliverable);
      }
    }
  };

  return (
    <>
      <DeliverableOfDate
        selectedDate={selectedDate}
        selectedDeliverable={selectedDeliverable}
        onSelectDeliverable={onSelectDeliverable}
        newCreatedDeliverable={sendCreateDeliverableRes}
        updatedDeliverable={sendUpdateDeliverableRes}
        reset={reset}
      />
      <div className='text-white mt-4'>
        <div className='flex justify-center'>
          <span>At least 2 deliverable per day</span>
        </div>
        <SmallLayout className='p-4 bg-card-gray border-rouge-blue border-4 relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name='client'
              rules={{ required: true }}
              render={({ field }) => <FormClientSelect deliverableInfo={deliverableInfo} field={field} />}
            />
            <Controller
              control={control}
              name='project'
              rules={{ required: true }}
              render={({ field }) => <FormProjectSelect control={control} deliverableInfo={deliverableInfo} field={field} />}
            />
            <Controller
              control={control}
              name='task'
              rules={{ required: true }}
              render={({ field }) => <FormTaskSelect control={control} deliverableInfo={deliverableInfo} field={field} />}
            />
            <label className='w-full flex items-center'>
              <span className='font-bold'>Deliverable:</span>
              <input
                type='text'
                autoComplete='off'
                disabled={disabled}
                className='ml-2 py-2 bg-transparent focus:outline-none focus:border-none flex border-none w-full'
                placeholder='Enter Deliverable Name'
                {...register('deliverable', { required: true })}
              />
            </label>

            <DeliverableTab
              selectedDeliverableTab={selectedDeliverableTab}
              selectedDeliverable={selectedDeliverable}
              onSelectDeliverableTab={onSelectDeliverableTab}
            />
            <PlusButton className='flex items-center justify-end my-4' />
          </form>
        </SmallLayout>
      </div>
      <BeforeWeeklyPriority
        selectedDate={selectedDate}
        selectedPriority={selectedPriority}
        onSelectPriority={onSelectPriority}
        newCreatedDeliverable={sendCreateDeliverableRes}
      />
      <ModalView isOpen={selectablePriority !== null}>
        <div className='text-center'>Deliverable from priority?</div>
        <div className='flex flex-row'>
          <div className='font-bold pr-2'>Deliverable:</div>
          <div className='font-bold'>{selectablePriority?.priority}</div>
        </div>
        <div className='flex flex-row items-start justify-between w-full px-8 pt-4'>
          <div className='text-lg font-bold' onClick={() => setSelectablePriority(null)}>
            No
          </div>
          <div className='text-lg font-bold text-rouge-blue' onClick={onDeliverableFromPriority}>
            Yes
          </div>
        </div>
      </ModalView>
    </>
  );
}

export default DeliverablePanel;
