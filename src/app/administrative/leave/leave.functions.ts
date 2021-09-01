// Leave Google Form
import {
  CraFormValues,
  LeaveAppFormValues,
  LeaveGoogleFormValues,
} from './PageLeave';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfVEFq1HJ6cKphUeDquxk3x3BW9UiE4oGkeF8Kp0yVn0PjgLA/viewform';

export const LEAVE_FORM_ENTRIES_LAST_NAME = '468366344';
export const LEAVE_FORM_ENTRIES_FIRST_NAME = '1650320565';
export const LEAVE_FORM_ENTRIES_DATE_BEGIN = '998597328';
export const LEAVE_FORM_ENTRIES_DATE_BEGIN_DAY = '998597328_day';
export const LEAVE_FORM_ENTRIES_DATE_BEGIN_MONTH = '998597328_month';
export const LEAVE_FORM_ENTRIES_DATE_BEGIN_YEAR = '998597328_year';
export const LEAVE_FORM_ENTRIES_DATE_END = '1229261647';
export const LEAVE_FORM_ENTRIES_DATE_END_DAY = '1229261647_day';
export const LEAVE_FORM_ENTRIES_DATE_END_MONTH = '1229261647_month';
export const LEAVE_FORM_ENTRIES_DATE_END_YEAR = '1229261647_year';
export const LEAVE_FORM_ENTRIES_TYPE = '790184327';

export const LEAVE_FORM_ENTRIES_TYPE_OPTIONS = [
  { value: 'Matinée seulement' },
  { value: 'Après-midi seulement' },
  { value: 'Toute la journée' },
];

export const buildGoogleFormUrl = (values: LeaveGoogleFormValues) =>
  `${GOOGLE_FORM_URL}?${Object.entries(values)
    ?.map(([key, value]) => `entry.${key}=${value}`)
    .join('&')}`;

// Google Agenda

const GOOGLE_AGENDA_URL =
  'https://www.google.com/calendar/render?action=TEMPLATE';

export const buildGoogleAgendaUrl = (values: LeaveAppFormValues) =>
  `${GOOGLE_AGENDA_URL}&text=${values[LEAVE_FORM_ENTRIES_LAST_NAME]} ${
    values[LEAVE_FORM_ENTRIES_FIRST_NAME]
  } congés&dates=${values[LEAVE_FORM_ENTRIES_DATE_BEGIN].format(
    'YYYYMMDD'
  )}%2F${values[LEAVE_FORM_ENTRIES_DATE_END].add(1, 'day').format('YYYYMMDD')}`;

// CRA

const CRA_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdKSfsX8l-OGQHZe0N-4kVwB2dP26q8cNkvoZZwXih3u1iS4Q/formResponse';

export const CRA_FORM_ENTRIES_DATE_DAY = '1870443831_day';
export const CRA_FORM_ENTRIES_DATE_MONTH = '1870443831_month';
export const CRA_FORM_ENTRIES_DATE_YEAR = '1870443831_year';
export const CRA_FORM_ENTRIES_REMARK = '1524584432';
export const CRA_FORM_ENTRIES_PROJECT_1_CODE = '1606233044';
export const CRA_FORM_ENTRIES_PROJECT_1_TIME = '1836148051';

export const buildCraUrl = (values: CraFormValues) =>
  `${CRA_FORM_URL}?${Object.entries(values)
    ?.map(([key, value]) => `entry.${key}=${value}`)
    .join('&')}`;
