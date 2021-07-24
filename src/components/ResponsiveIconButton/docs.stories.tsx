import React from 'react';

import { Stack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { ResponsiveIconButton } from '.';

export default {
  title: 'components/ResponsiveIconButton',
};

export const Default = () => {
  return (
    <Stack spacing={5}>
      <ResponsiveIconButton
        hideTextBreakpoints={{
          base: true,
          sm: false,
          md: true,
          lg: false,
          xl: true,
        }}
        icon={<FiPlus />}
      >
        Nouvelle audience
      </ResponsiveIconButton>
    </Stack>
  );
};
