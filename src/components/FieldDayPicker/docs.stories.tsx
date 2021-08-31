import { Stack } from '@chakra-ui/react';
import { Formiz } from '@formiz/core';
import dayjs from 'dayjs';

import { FieldDayPicker } from './index';

export default {
  title: 'Fields/FieldDayPicker',
};
export const Default = () => (
  <Formiz>
    <Stack spacing={6} minHeight="47rem">
      <FieldDayPicker
        name="date"
        label="Date exemple"
        placeholder="select your date"
        helper="This is an helper"
        required="Date is required"
      />
      <FieldDayPicker
        name="date2"
        label="Date 2 exemple"
        placeholder="select your date"
        defaultValue={dayjs()}
        helper="This is an helper"
        required="Date is required"
      />
      <FieldDayPicker
        name="date3"
        label="Date 3 exemple"
        placeholder="select your date"
        defaultValue={dayjs()}
        helper="This is an helper"
        required="Date is required"
        isDisabled
      />
      <FieldDayPicker
        name="date4"
        label="Date 4 exemple"
        placeholder="select your date"
        helper="This is an helper"
        required="Date is required"
        dayPickerProps={{
          disabledDays: [{ daysOfWeek: [0, 6] }, { before: new Date() }],
        }}
      />
    </Stack>
  </Formiz>
);
