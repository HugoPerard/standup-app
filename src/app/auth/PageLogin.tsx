import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Head from 'next/head';
import { FiMoon, FiSun } from 'react-icons/fi';

import { Icon, SlideIn, Viewport } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { useAuth } from './useAuth';

export const PageLogin = () => {
  const { colorModeValue } = useDarkMode();
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, signInWithGoogle } = useAuth();

  return (
    <>
      <Head>
        <title>BS | Login</title>
      </Head>
      <Viewport>
        <Center bg={colorModeValue('white', 'gray.800')} flex={1}>
          <SlideIn>
            <Stack
              bg={colorModeValue('gray.300', 'gray.700')}
              color={colorModeValue('gray.700', 'gray.200')}
              p={6}
              m={6}
              borderRadius="md"
              alignSelf="center"
              justifySelf="center"
              spacing={5}
              maxW="25rem"
              shadow="md"
            >
              <Stack alignItems="center">
                <Heading size="4xl">🐻</Heading>
                <Heading justifyContent="center">BearStudio App</Heading>
              </Stack>
              <Text>
                Cette application est réservée aux membres du BearStudio,
                veuillez vous connecter avec votre compte{' '}
                <strong>@bearstudio</strong> afin d'y accéder.
              </Text>

              {currentUser && (
                <Alert status="error" borderRadius="md" bg="red.500">
                  <AlertIcon color="gray.200" />
                  <AlertDescription fontSize="sm">
                    <strong>Adresse non-autorisée.</strong> Veuillez vous
                    connecter avec votre adresse Bearstudio.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant="@primary"
                onClick={() => signInWithGoogle()}
                size="sm"
                width="fit-content"
                alignSelf="center"
              >
                Se connecter avec Google
              </Button>
            </Stack>
            <IconButton
              aria-label={`Passer en mode ${
                colorMode === 'dark' ? 'lumineux' : 'sombre'
              }`}
              icon={<Icon icon={colorMode === 'dark' ? FiSun : FiMoon} />}
              variant="@ghost"
              color={colorModeValue('gray.700', 'gray.200')}
              onClick={() => toggleColorMode()}
              width="fit-content"
              alignSelf="center"
            />
          </SlideIn>
        </Center>
      </Viewport>
    </>
  );
};
