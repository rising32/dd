export type DateTimeCurrencyType = {
  dtc_id: number | null;
  user_id: number | undefined;
  date_format: string;
  time_format: string;
  currency: number;
  decimal_seperator: number;
};

export interface KeyValueState {
  key: number;
  value: string;
}

export const dateFormatOptions: KeyValueState[] = [
  {
    key: 1,
    value: 'YYYY-MM-DD',
  },
  {
    key: 2,
    value: 'YYYY-MM-D',
  },
  {
    key: 3,
    value: 'YYYY-MM-DDD',
  },
];
export const currencyOptions: KeyValueState[] = [
  {
    key: 1,
    value: 'Euro (€)',
  },
  {
    key: 2,
    value: 'Dollar ($)',
  },
];

export const timeFormatOptions: KeyValueState[] = [
  {
    key: 1,
    value: '12-Hour',
  },
  {
    key: 2,
    value: '24-Hour',
  },
];
export const decimalSeparatorOptions: KeyValueState[] = [
  {
    key: 1,
    value: 'Point',
  },
  {
    key: 2,
    value: 'Comma',
  },
];
