import { getWeek } from 'date-fns';

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

export function getLocalDataString(date: Date) {
  return new Date(date).toLocaleDateString(undefined, dateTimeFormatOptions);
}

export function getWeekNumber(date: Date) {
  return getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 });
}
