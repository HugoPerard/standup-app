import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

import { SlideIn, Viewport } from '@/components';

import { useAuth } from './useAuth';

export const PageLogin = () => {
  const { currentUser, signInWithGoogle } = useAuth();

  return (
    <Viewport>
      <Center bg="gray.800" color="gray.200" flex={1}>
        <SlideIn>
          <Stack
            bg="gray.700"
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
              Cette application est réservée aux membres du BearStudio, veuillez
              vous connecter avec votre compte <strong>@bearstudio</strong> afin
              d'y accéder.
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
        </SlideIn>
      </Center>
    </Viewport>
  );
};
