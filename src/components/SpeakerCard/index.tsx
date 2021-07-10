import { useState } from 'react';

import {
  Flex,
  Center,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiTrash, FiWatch } from 'react-icons/fi';
import { useStopwatch } from 'react-timer-hook';

import { useSpeakerDelete } from '@/app/standup/standup.firebase';
import { Speaker } from '@/app/standup/standup.types';
import { ConfirmMenuItem, MenuItem } from '@/components';

interface SpeakerCardProps extends StackProps {
  speaker: Speaker;
  index: number;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  speaker,
  ...rest
}) => {
  const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const [isSpeaked, setIsSpeaked] = useState(false);

  const controlStopWatch = () => {
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

  const { mutate: deleteSpeaker } = useSpeakerDelete();

  return (
    <Draggable draggableId={`draggable-${speaker?.id}`} index={speaker?.index}>
      {(provided) => (
        <Stack
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          direction="row"
          spacing={3}
          alignItems="center"
          bg="gray.600"
          p={2}
          borderRadius="md"
          opacity={isSpeaked && '0.5'}
          {...rest}
        >
          <Flex
            onClick={() => {
              pause();
              setIsSpeaked(true);
            }}
          >
            <Checkbox
              colorScheme="blackAlpha"
              isIndeterminate={isRunning}
              isChecked={isSpeaked}
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
            <Text fontWeight="medium">{speaker?.name}</Text>
            <Text w={45}>
              {minutes?.toString()?.length === 1 ? `0${minutes}` : minutes}:
              {seconds?.toString()?.length === 1 ? `0${seconds}` : seconds}
            </Text>
          </Stack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical />}
              variant="@primary"
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
                  onClick={() => deleteSpeaker(speaker?.id)}
                >
                  Supprimer
                </ConfirmMenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Stack>
      )}
    </Draggable>
  );
};

export const EmptySpeakerCard = ({ children, ...props }) => {
  return (
    <Center bg="gray.600" py={2} px={4} borderRadius="md" {...props}>
      <Text>{children}</Text>
    </Center>
  );
};
