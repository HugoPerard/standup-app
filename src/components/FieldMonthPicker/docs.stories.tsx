import { Stack } from '@chakra-ui/react';
import { Formiz } from '@formiz/core';

import { FieldMonthPicker } from './index';

export default {
  title: 'Fields/FieldMonthPicker',
};
export const Default = () => (
  <Formiz>
    <Stack spacing={6} minHeight="47rem">
      <FieldMonthPicker
        name="month"
        label="Month exemple"
        placeholder="select your month"
        helper="This is an helper"
        required="Month is required"
      />
    </Stack>
  </Formiz>
);
