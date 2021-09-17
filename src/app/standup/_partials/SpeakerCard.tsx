import { forwardRef, useState } from 'react';

import {
  Flex,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Stack,
  StackProps,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';
import { Formiz } from '@formiz/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiTrash, FiWatch, FiUserX, FiUserCheck } from 'react-icons/fi';
import { useStopwatch } from 'react-timer-hook';

import {
  useSpeakerDelete,
  useSpeakerUpdate,
} from '@/app/standup/standup.firebase';
import { Speaker } from '@/app/standup/standup.types';
import {
  ConfirmMenuItem,
  EmptyItem,
  FieldInput,
  MenuItem,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

interface SpeakerCardProps extends StackProps {
  speaker: Speaker;
  index: number;
}
export const SpeakerCard = forwardRef<HTMLDivElement, SpeakerCardProps>(
  ({ speaker, index, ...rest }, ref) => {
    const { colorModeValue } = useDarkMode();
    const toastSuccess = useToastSuccess();
    const { isOpen, onClose } = useDisclosure();

    const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({
      autoStart: false,
    });
    const [isSpeaked, setIsSpeaked] = useState(false);
    const [isDisabled, setIsDisabled] = useState(speaker.isAbsent);
    const controlStopWatch = () => {
      if (isDisabled) {
        return;
      }
      if (isRunning) {
        pause();
        setIsSpeaked(true);
      } else {
        start();
      }
    };
    const resetStopwatch = () => {
      setIsDisabled(false);
      reset();
      setIsSpeaked(false);
      pause();
    };
    const handleAbsent = () => {
      updateSpeaker({
        id: speaker.id,
        payload: { isAbsent: !speaker.isAbsent },
      });
      setIsDisabled(!speaker.isAbsent);
    };

    const { mutate: deleteSpeaker } = useSpeakerDelete();
    const { mutate: updateSpeaker } = useSpeakerUpdate();

    const handleDeleteSpeaker = () => {
      deleteSpeaker(speaker?.id, {
        onSuccess: async () =>
          toastSuccess({
            title: `${speaker?.name} a été supprimé avec succès`,
          }),
      });
    };

    const handleUpdateUsername = (values) => {
      const name = values.speaker.name;
      updateSpeaker({ id: speaker?.id, payload: { name } });
      onClose();
    };

    return (
      <>
        <Stack
          ref={ref}
          id={speaker?.id}
          direction="row"
          spacing={3}
          alignItems="center"
          bg={colorModeValue('gray.200', 'gray.600')}
          p={2}
          borderRadius="md"
          opacity={isSpeaked && isDisabled && '0.5'}
          {...(isRunning
            ? {
                border: '1 solid',
                borderColor: 'yellow.500',
              }
            : {})}
          {...rest}
        >
          <Flex
            onClick={() => {
              pause();
              setIsSpeaked(true);
            }}
          >
            <Checkbox
              isIndeterminate={isRunning}
              isChecked={isSpeaked}
              borderColor={colorModeValue('gray.400', undefined)}
            />
          </Flex>
          <Stack
            onClick={controlStopWatch}
            direction="row"
            spacing={3}
            cursor="pointer"
            flex="1"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="medium" fontSize="sm">
              {speaker?.name}
            </Text>
            <Text w={45}>
              {minutes?.toString()?.length === 1 ? `0${minutes}` : minutes}:
              {seconds?.toString()?.length === 1 ? `0${seconds}` : seconds}
            </Text>
          </Stack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical />}
              variant="@link"
              size="xs"
            />
            <Portal>
              <MenuList color="gray.700" bg="gray.200">
                <MenuItem
                  _hover={{ bg: 'gray.300' }}
                  _focus={{ bg: 'gray.400' }}
                  icon={<FiWatch />}
                  onClick={() => resetStopwatch()}
                >
                  Réinitialiser
                </MenuItem>
                <ConfirmMenuItem
                  _hover={{ bg: 'gray.300' }}
                  _focus={{ bg: 'gray.400' }}
                  icon={<FiTrash />}
                  confirmContent="Confirmer la suppression"
                  onClick={() => handleDeleteSpeaker()}
                >
                  Supprimer
                </ConfirmMenuItem>
                <MenuItem
                  _hover={{ bg: 'gray.300' }}
                  _focus={{ bg: 'gray.400' }}
                  icon={
                    speaker.isAbsent ? (
                      <FiUserX color="red" />
                    ) : (
                      <FiUserCheck color="green " />
                    )
                  }
                  onClick={() => handleAbsent()}
                >
                  absent
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader />
            <ModalCloseButton />
            <Formiz autoForm onValidSubmit={handleUpdateUsername}>
              <ModalBody>
                <FieldInput
                  label="Nom de la personne"
                  name="speaker.name"
                  required="Le nom de la personne est requis"
                  defaultValue={speaker.name}
                />
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose} variant="ghost">
                  Annuler
                </Button>
                <Spacer />
                <Button type="submit" color="white">
                  Valider
                </Button>
              </ModalFooter>
            </Formiz>
          </ModalContent>
        </Modal>
      </>
    );
  }
);
export const EmptySpeakerCard = (props) => {
  return <EmptyItem fontSize="xs" fontWeight="medium" {...props} />;
};
