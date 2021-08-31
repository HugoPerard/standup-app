import dayjs, { ConfigType, Dayjs } from 'dayjs';

export const parseInputToDate = (input: ConfigType): Dayjs => {
  return dayjs(input, ['DD', 'DDMM', 'DDMMYY', 'DD/MM/YYYY'], 'fr', true);
};
