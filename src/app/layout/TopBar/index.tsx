import React from 'react';

import {
  Box,
  Flex,
  SlideFade,
  IconButton,
  useTheme,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

import {
  AccountMenu,
  MainMenu,
  NavDrawer,
  useLayoutContext,
} from '@/app/layout';
import { Logo } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

const MenuButton = (props) => {
  const { colorModeValue } = useDarkMode();
  const { navOnOpen } = useLayoutContext();
  return (
    <IconButton
      aria-label="Navigation"
      icon={<FiMenu size="1.5em" />}
      onClick={navOnOpen}
      bg="transparent"
      color="gray.300"
      _active={{ bg: colorModeValue('gray.2OO', 'gray.700') }}
      _hover={{ bg: colorModeValue('gray.400', 'gray.900') }}
      {...props}
    />
  );
};

export const TopBar = () => {
  const theme = useTheme();
  const showDrawer = useBreakpointValue({
    base: true,
    [theme.layout.breakpoints.desktop]: false,
  });

  return (
    <>
      <SlideFade in offsetY={-40} style={{ zIndex: 2 }}>
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bg="gray.800"
          color="gray.50"
          align="center"
          pt="safe-top"
          px="4"
          h={theme.layout.topBar.height}
        >
          <MenuButton display={{ base: 'flex', md: 'none' }} ml="-0.5rem" />
          <Box
            as={RouterLink}
            to="/"
            mx={{ base: 'auto', [theme.layout.breakpoints.desktop]: 0 }}
          >
            <Logo />
          </Box>
          <MainMenu mr="auto" ml="4" display={{ base: 'none', md: 'flex' }} />
          <AccountMenu />
        </Flex>
      </SlideFade>
      <Box h={theme.layout.topBar.height} />
      {showDrawer && <NavDrawer />}
    </>
  );
};
