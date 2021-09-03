import {
  CraFormValues,
  CRA_FORM_URL,
  GOOGLE_AGENDA_URL,
  GOOGLE_FORM_URL,
  LeaveAppFormValues,
  LeaveFormTypeOptions,
  LeaveGoogleFormValues,
  LEAVE_FORM_ENTRIES_DATE_BEGIN,
  LEAVE_FORM_ENTRIES_DATE_END,
  LEAVE_FORM_ENTRIES_FIRST_NAME,
  LEAVE_FORM_ENTRIES_LAST_NAME,
  LEAVE_FORM_ENTRIES_TYPE,
} from './leave.types';

export const buildGoogleFormUrl = (values: LeaveGoogleFormValues) =>
  `${GOOGLE_FORM_URL}?${Object.entries(values)
    ?.map(([key, value]) => `entry.${key}=${value}`)
    .join('&')}`;

const defineHourBegin = (type: LeaveFormTypeOptions) => {
  switch (type) {
    case 'Matinée seulement':
      return '0900';
    case 'Après-midi seulement':
      return '1400';
    case 'Toute la journée':
      return null;
    default:
      return null;
  }
};

const defineHourEnd = (type: LeaveFormTypeOptions) => {
  switch (type) {
    case 'Matinée seulement':
      return '1200';
    case 'Après-midi seulement':
      return '1800';
    case 'Toute la journée':
      return null;
    default:
      return null;
  }
};

export const buildGoogleAgendaUrl = (values: LeaveAppFormValues) =>
  `${GOOGLE_AGENDA_URL}&text=${values[LEAVE_FORM_ENTRIES_FIRST_NAME]} ${
    values[LEAVE_FORM_ENTRIES_LAST_NAME]
  } congés&dates=${values[LEAVE_FORM_ENTRIES_DATE_BEGIN].format('YYYYMMDD')}${
    values[LEAVE_FORM_ENTRIES_TYPE] !== 'Toute la journée'
      ? `T${defineHourBegin(values[LEAVE_FORM_ENTRIES_TYPE])}`
      : ''
  }%2F${values[LEAVE_FORM_ENTRIES_DATE_END].add(1, 'day').format('YYYYMMDD')}${
    values[LEAVE_FORM_ENTRIES_TYPE] !== 'Toute la journée'
      ? `T${defineHourEnd(values[LEAVE_FORM_ENTRIES_TYPE])}`
      : ''
  }`;

export const buildCraUrl = (values: CraFormValues) =>
  `${CRA_FORM_URL}?${Object.entries(values)
    ?.map(([key, value]) => `entry.${key}=${value}`)
    .join('&')}`;
