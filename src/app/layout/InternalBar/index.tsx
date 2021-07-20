import React, { useContext } from 'react';

import { Box, Stack, useTheme } from '@chakra-ui/react';

import { LayoutContext } from '@/app/layout';

export const InternalBar = ({ ...rest }) => {
  const { isFocusMode, hasSideBar } = useContext(LayoutContext);
  const theme = useTheme();

  if (isFocusMode) {
    return null;
  }

  return (
    <>
      <Stack
        zIndex="2"
        position="fixed"
        top={theme.layout.topBar.height}
        left={!hasSideBar ? 0 : theme.layout.sideBar.width}
        right="0"
        h={theme.layout.internalBar.height}
        w="full"
        boxShadow="lg"
        direction="row"
        bg="gray.800"
        color="gray.100"
        spacing="4"
        px="5"
        overflowY="hidden"
        overflowX="auto"
        {...rest}
      />
      <Box h={theme.layout.internalBar.height} />
    </>
  );
};
