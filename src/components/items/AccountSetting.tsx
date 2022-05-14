import React, { useState } from 'react';
import { ClickArrowSvg, DollarSvg, DownSvg, EuroSvg, SettingSvg } from '../../assets/svg';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import AnimatedView from '../common/AnimatedView';
import { redDocumentThumbnail } from '../../assets/images';
import ItemLayout from '../common/ItemLayout';
import ReactModal from 'react-modal';
import { currencyFormatOptions, dateFormatOptions, decimalSeparatorOptions, timeFormatOptions } from '../../modules/setting';
import { AccountSettingState, createAccountSetting, updateAccountSetting } from '../../store/features/userSlice';

const AccountSetting = () => {
  const { userInfo, accountSetting } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [showDateFormat, setShowDateFormat] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [selectedDateFormat, setSelectedDateFormat] = useState(accountSetting.date_format);
  const [selectedTimeFormat, setSelectedTimeFormat] = useState(accountSetting.time_format);
  const [selectedCurrency, setSelectedCurrency] = useState(accountSetting.currency);
  const [selectedDecimal, setSelectedDecimal] = useState(accountSetting.decimal_seperator);

  const onShowDateFormat = () => {
    if (showDateFormat) {
      setShowDateFormat(false);
    } else {
      setShowDateFormat(true);
    }
  };
  const onShowCurrency = () => {
    if (showCurrency) {
      setShowCurrency(false);
    } else {
      setShowCurrency(true);
    }
  };

  const onEdit = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  };
  const onSelectDateFormate = (index: number) => {
    setSelectedDateFormat(index);
    onShowDateFormat();
  };
  const onSelectCurrencyFormate = (index: number) => {
    setSelectedCurrency(index);
    onShowCurrency();
  };
  const onSelectTimeFormate = (index: number) => {
    setSelectedTimeFormat(index);
  };
  const onSelectDecimal = (index: number) => {
    setSelectedDecimal(index);
  };
  const createAndUpdate = () => {
    if (userInfo) {
      if (accountSetting.as_id) {
        const setting: AccountSettingState = {
          as_id: accountSetting.as_id,
          date_format: selectedDateFormat,
          time_format: selectedTimeFormat,
          currency: selectedCurrency,
          decimal_seperator: selectedDecimal,
        };
        const user_id = userInfo.user_id;
        dispatch(updateAccountSetting({ ...setting, user_id }))
          .unwrap()
          .then(() => {
            onEdit();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        const setting: AccountSettingState = {
          as_id: null,
          date_format: selectedDateFormat,
          time_format: selectedTimeFormat,
          currency: selectedCurrency,
          decimal_seperator: selectedDecimal,
        };
        const user_id = userInfo.user_id;
        console.log('-------------', user_id);
        dispatch(createAccountSetting({ ...setting, user_id }))
          .unwrap()
          .then(() => {
            onEdit();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  return (
    <>
      <ItemLayout className='mt-2' onClick={onEdit}>
        <div className='w-10 flex items-center justify-center'>
          <SettingSvg className='w-6 h-6' />
        </div>
        <div className='flex flex-1 items-center justify-between'>
          <div className='pr-2 truncate'>Date, time and currency</div>
          <img src={redDocumentThumbnail} className='h-4 w-auto' />
          {accountSetting.currency === 0 && <EuroSvg className='w-6 h-6 fill-rouge-blue' />}
          {accountSetting.currency === 1 && <DollarSvg className='w-6 h-6 fill-rouge-blue' />}
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <AnimatedView show={isEdit} className='p-4 border-2 border-dark-gray text-black'>
        <div className='flex p-4 items-center justify-between'>
          <span onClick={onEdit}>Cancel</span>
          <span className='text-lg font-bold'>Account Setting</span>
          <span onClick={createAndUpdate}>{accountSetting.as_id ? 'Save' : 'Create'}</span>
        </div>
        <div>
          <div className='relative mt-2'>
            <div className='font-bold'>DATE FORMAT</div>
            <div className='bg-light-gray flex items-center justify-between p-2 mt-1 rounded-md' onClick={onShowDateFormat}>
              <div className='truncate'>{dateFormatOptions[selectedDateFormat]}</div>
              <DownSvg strokeWidth={4} className='h-4 w-4 stroke-black rotate-90' />
            </div>
            <ReactModal
              isOpen={showDateFormat}
              onRequestClose={onShowDateFormat}
              className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
              style={{
                overlay: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <div className='text-center font-bold'>DATE FORMAT</div>
              <ul role='list' className='p-4 z-10'>
                {dateFormatOptions.map((item, index) => (
                  <li
                    key={item}
                    onClick={() => onSelectDateFormate(index)}
                    className={`flex py-1 first:pt-0 last:pb-0 ${selectedDateFormat === index && 'text-rouge-blue'}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </ReactModal>
          </div>
          <div className='relative mt-4'>
            <div className='font-bold'>CURRENCY</div>
            <div className='bg-light-gray flex items-center justify-between p-2 mt-1 rounded-md' onClick={onShowCurrency}>
              <div className='truncate'>{currencyFormatOptions[selectedCurrency]}</div>
              <DownSvg strokeWidth={4} className='h-4 w-4 stroke-black rotate-90' />
            </div>
            <ReactModal
              isOpen={showCurrency}
              onRequestClose={onShowCurrency}
              className='w-4/5 max-h-96 bg-white p-4 overflow-auto rounded-sm flex flex-col items-center justify-center'
              style={{
                overlay: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <div className='text-center font-bold'>CURRENCY</div>
              <ul role='list' className='p-4 z-10'>
                {currencyFormatOptions.map((item, index) => (
                  <li
                    key={item}
                    onClick={() => onSelectCurrencyFormate(index)}
                    className={`flex py-1 first:pt-0 last:pb-0 ${selectedCurrency === index && 'text-rouge-blue'}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </ReactModal>
          </div>
          <div className='mt-4'>
            <div className='font-bold'>TIME FORMAT</div>
            <ul role='list'>
              {timeFormatOptions.map((item, index) => (
                <li key={item} className='flex items-center pl-4 py-1 first:pt-0 last:pb-0' onClick={() => onSelectTimeFormate(index)}>
                  <div
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedTimeFormat === index ? 'bg-rouge-blue' : 'bg-card-gray'
                    }`}
                  >
                    {selectedTimeFormat === index && <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />}
                  </div>
                  <div className='text-center truncate'>{item}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className='relative mt-4'>
            <div className='font-bold'>TIME FORMAT</div>
            <ul role='list'>
              {decimalSeparatorOptions.map((item, index) => (
                <li key={item} className='flex items-center pl-4 py-1 first:pt-0 last:pb-0' onClick={() => onSelectDecimal(index)}>
                  <div
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedDecimal === index ? 'bg-button-blue' : 'bg-card-gray'
                    }`}
                  >
                    {selectedDecimal === index && <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />}
                  </div>
                  <div className='text-center truncate'>{item}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedView>
    </>
  );
};

export default AccountSetting;
