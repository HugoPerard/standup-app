import React, { useContext } from 'react';

import { Box, Flex, Stack, useTheme } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

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

export const InternalBarItem = ({ to, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);
  return (
    <Flex
      as={RouterLink}
      to={to}
      position="relative"
      align="center"
      fontSize="sm"
      fontWeight="medium"
      px="3"
      color={isActive ? 'yellow.500' : undefined}
      transition="0.2s"
      _before={{
        content: '""',
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        transition: '0.2s',
        bg: isActive ? 'yellow.500' : undefined,
        h: '3px',
      }}
      {...rest}
    />
  );
};
