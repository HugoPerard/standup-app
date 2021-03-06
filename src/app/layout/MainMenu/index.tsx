import React from 'react';

import { Stack, Box } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useLayoutContext } from '@/app/layout';
import { Routes } from '@/app/routes';

const MainMenuItem = ({ to, ...rest }: any) => {
  const { navOnClose } = useLayoutContext();
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);
  return (
    <Box
      as={RouterLink}
      to={to}
      bg="transparent"
      justifyContent="flex-start"
      position="relative"
      opacity={isActive ? 1 : 0.8}
      fontWeight="bold"
      borderRadius="md"
      px="4"
      py="2"
      _active={{ bg: 'gray.700' }}
      _hover={{
        bg: 'gray.900',
        _after: {
          opacity: 1,
          w: '2rem',
        },
      }}
      _focus={{
        outline: 'none',
        bg: 'gray.900',
        _after: {
          opacity: 1,
          w: '2rem',
        },
      }}
      _after={{
        opacity: isActive ? 1 : 0,
        content: '""',
        position: 'absolute',
        left: { base: 8, md: '50%' },
        bottom: '0.2em',
        transform: 'translateX(-50%)',
        transition: '0.2s',
        w: isActive ? '2rem' : 0,
        h: '2px',
        borderRadius: 'full',
        bg: 'currentColor',
      }}
      onClick={navOnClose}
      {...rest}
    />
  );
};

export const MainMenu = ({ ...rest }) => {
  return (
    <Stack direction="row" spacing="1" {...rest}>
      <MainMenuItem to={Routes.STANDUP}>Stand-up</MainMenuItem>
      <MainMenuItem to={Routes.OFFICES}>Bureaux</MainMenuItem>
      <MainMenuItem to={Routes.CRA}>CRA</MainMenuItem>
      <MainMenuItem to={Routes.ADMINISTRATIVE}>Administratif</MainMenuItem>
    </Stack>
  );
};
