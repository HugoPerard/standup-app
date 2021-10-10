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
import {
  FiTrash2,
  FiWatch,
  FiUserX,
  FiUserCheck,
  FiEdit,
} from 'react-icons/fi';
import { useStopwatch } from 'react-timer-hook';

import {
  useSpeakerDelete,
  useSpeakerUpdate,
} from '@/app/standup/standup/standup.firebase';
import { Speaker } from '@/app/standup/standup/standup.types';
import {
  ConfirmMenuItem,
  EmptyItem,
  FieldInput,
  Icon,
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
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({
      autoStart: false,
    });
    const [isSpeaked, setIsSpeaked] = useState(false);

    const isAbsent = speaker?.isAbsent;

    const controlStopWatch = () => {
      if (isAbsent) {
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
      reset();
      setIsSpeaked(false);
      pause();
    };
    const handleAbsent = () => {
      updateSpeaker({
        id: speaker.id,
        payload: { isAbsent: !isAbsent },
      });
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
          opacity={(isSpeaked && !isRunning) || isAbsent ? '0.5' : undefined}
          {...(isRunning
            ? {
                border: '1 solid',
                borderColor: 'brand.500',
              }
            : {})}
          {...rest}
        >
          {isAbsent ? (
            <Flex w={4} pl={0.5}>
              <Icon icon={FiUserX} />
            </Flex>
          ) : (
            <Flex
              onClick={() => {
                pause();
                setIsSpeaked(true);
              }}
              w={4}
            >
              <Checkbox
                isIndeterminate={isRunning}
                isChecked={isSpeaked}
                borderColor={colorModeValue('gray.400', undefined)}
              />
            </Flex>
          )}
          <Stack
            onClick={controlStopWatch}
            direction="row"
            spacing={3}
            cursor="pointer"
            flex="1"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              fontWeight="medium"
              fontSize="sm"
              isTruncated
              maxW="12rem"
              // textDecoration={speaker?.isAbsent ? 'line-through' : undefined}
            >
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
              <MenuList>
                <MenuItem icon={<FiEdit />} onClick={onOpen}>
                  Éditer
                </MenuItem>
                {!isAbsent && (
                  <MenuItem icon={<FiWatch />} onClick={() => resetStopwatch()}>
                    Réinitialiser
                  </MenuItem>
                )}
                <MenuItem
                  icon={isAbsent ? <FiUserCheck /> : <FiUserX />}
                  onClick={() => handleAbsent()}
                >
                  {isAbsent ? 'Mettre présent' : 'Mettre absent'}
                </MenuItem>
                <ConfirmMenuItem
                  icon={<FiTrash2 />}
                  confirmContent="Confirmer la suppression"
                  onClick={() => handleDeleteSpeaker()}
                >
                  Supprimer
                </ConfirmMenuItem>
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
