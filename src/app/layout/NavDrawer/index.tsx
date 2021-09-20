import React from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import { MainMenu, useLayoutContext } from '@/app/layout';
import { Logo } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

export const NavDrawer = ({ ...rest }) => {
  const { colorModeValue } = useDarkMode();
  const { navIsOpen, navOnClose } = useLayoutContext();
  return (
    <Drawer
      isOpen={navIsOpen}
      placement="left"
      onClose={() => navOnClose?.()}
      {...rest}
    >
      <DrawerOverlay>
        <DrawerContent
          bg={colorModeValue('gray.50', 'gray.800')}
          pt="safe-top"
          pb="safe-bottom"
        >
          <DrawerCloseButton mt="safe-top" />
          <DrawerHeader>
            <Logo />
          </DrawerHeader>
          <DrawerBody p="2">
            <MainMenu direction="column" />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
