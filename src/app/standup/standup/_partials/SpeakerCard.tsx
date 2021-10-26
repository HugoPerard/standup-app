import { forwardRef } from 'react';

import {
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
  FormModal,
  MenuItem,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { SpeakerAvatar } from './SpeakerAvatar';
import { SpeakerForm, SpeakerFormValues } from './SpeakerForm';

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

    const handleUpdateSpeaker = (values: SpeakerFormValues) => {
      updateSpeaker({ id: speaker?.id, payload: values });
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
          <Stack direction="row" justifyContent="space-between" w="full">
            <Menu>
              {/* Transparent menu for center Avatar */}
              <MenuButton
                as={IconButton}
                icon={<BsThreeDotsVertical />}
                size="xs"
                opacity={0}
              />
            </Menu>
            <SpeakerAvatar speaker={speaker} hasBadge={true} />
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
          {!isAbsent && (
            <Stack direction="row" alignItems="center" flex={1}>
              <IconButton
                icon={isRunning ? <FiPauseCircle /> : <FiPlayCircle />}
                aria-label="play"
                variant="ghost"
                colorScheme="gray"
                onClick={() => toggleTimer()}
                size="xs"
                fontSize="xl"
              />
              <Text
                fontWeight={
                  isRunning || seconds > 0 || minutes > 0 ? 'bold' : 'normal'
                }
                width={50}
              >
                {minutes?.toString()?.length === 1 ? `0${minutes}` : minutes}:
                {seconds?.toString()?.length === 1 ? `0${seconds}` : seconds}
              </Text>
            </Stack>
          )}
        </Stack>
        <FormModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleUpdateSpeaker}
          title="Modifier une personne"
          submitLabel="Modifier"
          initialValues={speaker}
        >
          <SpeakerForm />
        </FormModal>
      </>
    );
  }
);
export const EmptySpeakerCard = (props) => {
  return <EmptyItem fontSize="xs" fontWeight="medium" {...props} />;
};
