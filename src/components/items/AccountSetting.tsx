import React, { useState } from 'react';
import { sendDateTimeCurrencyCreate, sendDateTimeCurrencyUpdate, sendDateTimeCurrency } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';

import {
  currencyOptions,
  dateFormatOptions,
  DateTimeCurrencyType,
  decimalSeparatorOptions,
  KeyValueState,
  timeFormatOptions,
} from '../../modules/dateTimeCurrency';
import { ClickArrowSvg, DollarSvg, DownSvg, EuroSvg, SettingSvg } from '../../assets/svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AnimatedView from '../common/AnimatedView';
import { redDocumentThumbnail } from '../../assets/images';
import ItemLayout from '../common/ItemLayout';

interface Props {
  currency: number;
}
const AccountSetting = ({ currency }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [showDateFormat, setShowDateFormat] = useState(false);
  const [selectedDateFormat, setSelectedDateFormat] = useState<KeyValueState | null>(null);
  const [showCurrency, setShowCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<KeyValueState | null>(null);
  const [selectedTimeFormat, setSelectedTimeFormat] = useState<KeyValueState | null>(null);
  const [selectedDecimalSeparator, setSelectedDecimalSeparator] = useState<KeyValueState | null>(null);
  const [dtcData, setDTCData] = useState<DateTimeCurrencyType | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [_sendDateTimeCurrencyCreate, , dateTimeCurrencyCreateRes] = useRequest(sendDateTimeCurrencyCreate);
  const [_sendDateTimeCurrencyUpdate, , dateTimeCurrencyUpdateRes] = useRequest(sendDateTimeCurrencyUpdate);
  const [_sendDateTimeCurrency, , sendDateTimeCurrencyRes] = useRequest(sendDateTimeCurrency);

  React.useEffect(() => {
    const user_id = userInfo?.user_id;
    user_id && _sendDateTimeCurrency(user_id);
  }, []);
  React.useEffect(() => {
    if (sendDateTimeCurrencyRes) {
      setDTCData(sendDateTimeCurrencyRes);
      dateFormatOptions.map(item => {
        if (item.value === sendDateTimeCurrencyRes.date_format) {
          setSelectedDateFormat(item);
        }
      });
      currencyOptions.map(item => {
        if (item.key === sendDateTimeCurrencyRes.currency) {
          setSelectedCurrency(item);
        }
      });
      timeFormatOptions.map(item => {
        if (item.value === sendDateTimeCurrencyRes.time_format) {
          setSelectedTimeFormat(item);
        }
      });
      decimalSeparatorOptions.map(item => {
        if (item.key === sendDateTimeCurrencyRes.decimal_seperator) {
          setSelectedDecimalSeparator(item);
        }
      });
    }
  }, [sendDateTimeCurrencyRes]);
  const onShowDateFormat = () => {
    if (showDateFormat) {
      setShowDateFormat(false);
    } else {
      setShowDateFormat(true);
    }
  };
  const onSelectedDateFormat = (item: KeyValueState) => {
    setSelectedDateFormat(item);
    onShowDateFormat();
  };
  const onShowCurrency = () => {
    if (showCurrency) {
      setShowCurrency(false);
    } else {
      setShowCurrency(true);
    }
  };
  const onSelectedCurrency = (item: KeyValueState) => {
    setSelectedCurrency(item);
    onShowCurrency();
  };
  const onSelectedTimeFormat = (item: KeyValueState) => {
    setSelectedTimeFormat(item);
  };
  const onSelectedDecimalSeparator = (item: KeyValueState) => {
    setSelectedDecimalSeparator(item);
  };
  const onDateTimeCurrencyUpdate = () => {
    if (userInfo && selectedDateFormat && selectedTimeFormat && selectedCurrency && selectedDecimalSeparator) {
      if (dtcData) {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: dtcData?.dtc_id,
          user_id: dtcData.user_id,
          date_format: selectedDateFormat?.value,
          time_format: selectedTimeFormat?.value,
          currency: selectedCurrency?.key,
          decimal_seperator: selectedDecimalSeparator?.key,
        };
        _sendDateTimeCurrencyUpdate(dateTimeCurrency);
      } else {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: null,
          user_id: userInfo?.user_id,
          date_format: selectedDateFormat?.value,
          time_format: selectedTimeFormat?.value,
          currency: selectedCurrency?.key,
          decimal_seperator: selectedDecimalSeparator?.key,
        };
        _sendDateTimeCurrencyCreate(dateTimeCurrency);
      }
    }
  };
  React.useEffect(() => {
    if (dateTimeCurrencyCreateRes) {
      toast.success('Date, Time, Currency created!');
      onEdit();
    }
  }, [dateTimeCurrencyCreateRes]);
  React.useEffect(() => {
    if (dateTimeCurrencyUpdateRes) {
      toast.success('Date, Time, Currency updated!');
      onEdit();
    }
  }, [dateTimeCurrencyUpdateRes]);
  const onEdit = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
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
          {currency === 0 && <EuroSvg className='w-6 h-6 fill-rouge-blue' />}
          {currency === 1 && <DollarSvg className='w-6 h-6 fill-rouge-blue' />}
        </div>
        <ClickArrowSvg className='w-6 h-6' />
      </ItemLayout>
      <AnimatedView show={isEdit} className='p-4 border-2 border-dark-gray'>
        <div className='flex flex-row w-full p-4 items-center justify-between'>
          <div className='text-sm text-black font-normal' onClick={onEdit}>
            Cancel
          </div>
          <div className='text-lg text-black font-bold'>Account Setting</div>
          <div className='text-sm text-black font-normal' onClick={onDateTimeCurrencyUpdate}>
            Save
          </div>
        </div>
        <div className='my-4 flex flex-row'>
          <div className='w-1/2 pr-4 flex flex-col justify-between'>
            <div className='relative'>
              <div className='text-sm text-black font-bold text-center'>DATE FORMAT</div>
              <div
                className='bg-light-gray flex flex-row items-center justify-between px-2 py-1 rounded-md my-4'
                onClick={onShowDateFormat}
              >
                <div className='truncate'>{selectedDateFormat && selectedDateFormat.value ? selectedDateFormat.value : 'Select ...'}</div>
                <DownSvg strokeWidth={4} className='h-4 w-4 stroke-black rotate-90' />
              </div>
              {showDateFormat && (
                <div className='absolute top-full bg-white w-full py-4 text-lg z-10 border-2 border-light-gray'>
                  {dateFormatOptions.map(item => (
                    <div key={item.key} onClick={() => onSelectedDateFormat(item)}>
                      <div className='text-center truncate'>{item.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className='text-sm text-black font-bold text-center'>CURRENCY</div>
              <div className='relative'>
                <div
                  className='bg-light-gray flex flex-row items-center justify-between px-2 py-1 rounded-md my-4'
                  onClick={onShowCurrency}
                >
                  <div className='truncate'>{selectedCurrency && selectedCurrency.value ? selectedCurrency.value : 'Select ...'}</div>
                  <DownSvg strokeWidth={4} className='h-4 w-4 stroke-black rotate-90' />
                </div>
                {showCurrency && (
                  <div className='absolute bottom-full bg-white w-full py-4 text-lg z-10 border-2 border-light-gray'>
                    {currencyOptions.map(item => (
                      <div key={item.key} onClick={() => onSelectedCurrency(item)}>
                        <div className='text-center truncate'>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='w-1/2'>
            <div className='text-sm text-black font-bold truncate text-center'>TIME FORMAT</div>
            <div className='w-full py-4 text-lg'>
              {timeFormatOptions.map(item => (
                <div key={item.key} className='flex flex-row items-center pl-4' onClick={() => onSelectedTimeFormat(item)}>
                  <div
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedTimeFormat && selectedTimeFormat.key === item.key ? 'bg-rouge-blue' : 'bg-card-gray'
                    }`}
                  >
                    {selectedTimeFormat && selectedTimeFormat.key === item.key && (
                      <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />
                    )}
                  </div>
                  <div className='text-center truncate'>{item.value}</div>
                </div>
              ))}
            </div>
            <div className='text-sm text-black font-bold truncate text-center'>DECIMAL SEPARATOR</div>
            <div className='w-full py-4 text-lg'>
              {decimalSeparatorOptions.map(item => (
                <div key={item.key} className='flex flex-row items-center pl-4' onClick={() => onSelectedDecimalSeparator(item)}>
                  <div
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedDecimalSeparator && selectedDecimalSeparator.key === item.key ? 'bg-button-blue' : 'bg-card-gray'
                    }`}
                  >
                    {selectedDecimalSeparator && selectedDecimalSeparator.key === item.key && (
                      <DownSvg stroke='white' strokeWidth={3} className='w-4 h-4 rotate-90' />
                    )}
                  </div>
                  <div className='text-center truncate'>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedView>
    </>
  );
};

export default AccountSetting;
