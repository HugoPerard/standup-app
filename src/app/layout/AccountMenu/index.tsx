import React from 'react';

import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Flex,
  Text,
  useClipboard,
  Portal,
  useColorMode,
} from '@chakra-ui/react';
import { FiCheck, FiCopy, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

import appBuild from '@/../app-build.json';
import { useAuth } from '@/app/auth/useAuth';
import { Icon } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

const AppVersion = ({ ...rest }) => {
  const { colorModeValue } = useDarkMode();
  const { hasCopied, onCopy } = useClipboard(JSON.stringify(appBuild, null, 2));

  if (!appBuild?.version) {
    return null;
  }

  return (
    <>
      <MenuDivider />
      <Flex
        role="group"
        as="button"
        position="relative"
        w="full"
        textAlign="left"
        py="2"
        px="3"
        my="-2"
        fontSize="0.7rem"
        fontWeight="medium"
        color={colorModeValue('gray.500', 'gray.200')}
        outline="none"
        _hover={{ bg: colorModeValue('gray.50', 'gray.800') }}
        _focus={{ bg: colorModeValue('gray.50', 'gray.800') }}
        onClick={onCopy}
        {...rest}
      >
        <Flex
          d={hasCopied ? 'flex' : 'none'}
          position="absolute"
          align="center"
          top="0"
          left="0"
          right="0"
          bottom="0"
          py="2"
          px="3"
          fontWeight="bold"
          bg={colorModeValue('gray.50', 'gray.800')}
          color={
            hasCopied ? colorModeValue('success.500', 'success.300') : undefined
          }
          transition="0.2s"
          _groupHover={{ d: 'flex' }}
        >
          <Icon icon={hasCopied ? FiCheck : FiCopy} mr="2" fontSize="sm" />
          {hasCopied ? 'Version copiée' : 'Copier la version'}
        </Flex>
        <Text as="span" noOfLines={2}>
          Version <strong>{appBuild?.display ?? appBuild?.version}</strong>
        </Text>
      </Flex>
    </>
  );
};

export const AccountMenu = ({ ...rest }) => {
  const { colorModeValue } = useDarkMode();
  const { colorMode, toggleColorMode } = useColorMode();

  const { currentUser, signOut } = useAuth();

  return (
    <Menu placement="bottom-end" {...rest}>
      <MenuButton borderRadius="full" _focus={{ shadow: 'outline' }}>
        {currentUser && (
          <Avatar
            size="sm"
            name={currentUser?.displayName}
            src={currentUser?.photoURL}
          />
        )}
      </MenuButton>
      <Portal>
        <MenuList
          color={colorModeValue('gray.800', 'white')}
          maxW="12rem"
          overflow="hidden"
          zIndex="10"
        >
          <MenuGroup title={currentUser?.displayName} pb={1} />
          <MenuItem
            icon={
              <Icon
                icon={colorMode === 'dark' ? FiSun : FiMoon}
                fontSize="lg"
                color="gray.400"
              />
            }
            onClick={() => toggleColorMode()}
          >
            Passer en mode {colorMode === 'dark' ? 'lumineux' : 'sombre'}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<Icon icon={FiLogOut} fontSize="lg" color="gray.400" />}
            onClick={() => signOut()}
          >
            Se déconnecter
          </MenuItem>
          <AppVersion />
        </MenuList>
      </Portal>
    </Menu>
  );
};
