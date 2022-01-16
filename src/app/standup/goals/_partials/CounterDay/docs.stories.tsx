import { DarkMode, LightMode, Stack } from '@chakra-ui/react';

import { CounterDay } from '.';

export default {
  title: 'Components/CounterDay',
};

export const Default = () => (
  <Stack spacing="6">
    <LightMode>
      <CounterDay numberOfDay={1} />
    </LightMode>
    <DarkMode>
      <CounterDay numberOfDay={1} />
    </DarkMode>
  </Stack>
);
