import { forwardRef } from 'react';

import {
  Avatar,
  AvatarBadge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  FiTrash2,
  FiWatch,
  FiEdit,
  FiPlayCircle,
  FiPauseCircle,
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
  FormModal,
  MenuItem,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

interface SpeakerCardProps extends StackProps {
  speaker: Speaker;
}
export const SpeakerCard = forwardRef<HTMLDivElement, SpeakerCardProps>(
  ({ speaker, ...rest }, ref) => {
    const { colorModeValue } = useDarkMode();
    const toastSuccess = useToastSuccess();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({
      autoStart: false,
    });

    const isAbsent = speaker?.isAbsent;

    const toggleTimer = () => {
      if (isRunning) {
        pause();
      } else {
        start();
      }
    };

    const resetStopwatch = () => {
      reset();
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
          bg={colorModeValue('gray.200', 'gray.600')}
          opacity={isAbsent ? 0.5 : 1}
          p={4}
          borderRadius="md"
          alignItems="center"
          maxW={200}
          {...rest}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            flex={1}
            w="full"
          >
            <Menu>
              {/* Transparent menu for center Avatar */}
              <MenuButton
                as={IconButton}
                icon={<BsThreeDotsVertical />}
                size="xs"
                opacity={0}
              />
            </Menu>
            <Avatar src={speaker?.photoUrl} color="brand">
              <AvatarBadge
                borderColor={isAbsent ? 'red.100' : 'green.100'}
                bg={isAbsent ? 'red.500' : 'green.500'}
                boxSize="1.25em"
                onClick={() => handleAbsent()}
                cursor="pointer"
              />
            </Avatar>
            <Menu>
              {({ isOpen, onClose }) => (
                <>
                  <MenuButton
                    as={IconButton}
                    icon={<BsThreeDotsVertical />}
                    variant="@link"
                    size="xs"
                  />
                  {isOpen && (
                    <Portal>
                      <MenuList>
                        <MenuItem icon={<FiEdit />} onClick={onOpen}>
                          Éditer
                        </MenuItem>
                        {!isAbsent && (
                          <MenuItem
                            icon={<FiWatch />}
                            onClick={() => resetStopwatch()}
                          >
                            Réinitialiser
                          </MenuItem>
                        )}
                        <ConfirmMenuItem
                          icon={<FiTrash2 />}
                          confirmContent="Confirmer la suppression"
                          onClick={(event) => {
                            onClose();
                            event.stopPropagation();
                            handleDeleteSpeaker();
                          }}
                        >
                          Supprimer
                        </ConfirmMenuItem>
                      </MenuList>
                    </Portal>
                  )}
                </>
              )}
            </Menu>
          </Stack>
          <Text fontWeight="medium" fontSize="sm" maxW={150} isTruncated>
            {speaker?.name}
          </Text>
          <Stack direction="row" alignItems="center">
            <IconButton
              icon={isRunning ? <FiPauseCircle /> : <FiPlayCircle />}
              aria-label="play"
              variant="ghost"
              onClick={() => toggleTimer()}
              size="sm"
            />
            <Text fontWeight={isRunning ? 'bold' : 'normal'}>
              {minutes?.toString()?.length === 1 ? `0${minutes}` : minutes}:
              {seconds?.toString()?.length === 1 ? `0${seconds}` : seconds}
            </Text>
          </Stack>
        </Stack>
        <FormModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleUpdateUsername}
          title="Modifier une personne"
          submitLabel="Modifier"
        >
          <FieldInput
            label="Nom"
            name="speaker.name"
            required="Le nom est requis"
            defaultValue={speaker.name}
          />
        </FormModal>
      </>
    );
  }
);
export const EmptySpeakerCard = (props) => {
  return <EmptyItem fontSize="xs" fontWeight="medium" {...props} />;
};
