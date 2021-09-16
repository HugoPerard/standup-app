import dayjs from 'dayjs';

const capitalizeFirstLetter = (string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getDayPickerTranslationsOptions = () => ({
  locale: 'fr',
  months: dayjs.localeData().months().map(capitalizeFirstLetter),
  weekdaysLong: dayjs.localeData().weekdays().map(capitalizeFirstLetter),
  weekdaysShort: dayjs.localeData().weekdaysMin().map(capitalizeFirstLetter),
  firstDayOfWeek: dayjs.localeData().firstDayOfWeek(),
});
