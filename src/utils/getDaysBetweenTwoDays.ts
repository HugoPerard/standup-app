import { Dayjs } from 'dayjs';

export const getDaysBetweenTwoDays = (begin: Dayjs, end: Dayjs): Dayjs[] => {
  if (begin.isAfter(end)) {
    return null;
  }
  const result = [];
  let i = 0;
  while (begin.add(i, 'day').isSameOrBefore(end)) {
    result.push(begin.add(i, 'day'));
    i += 1;
  }
  return result;
};
