import { Box, IconButton, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { FiTrash } from 'react-icons/fi';

import { Speaker } from '@/app/standup/standup.types';

import { EmptySpeakerCard, SpeakerCard } from '../SpeakerCard';

interface SpeakerGroupProps {
  name: string;
  speakers: Speaker[];
}

export const SpeakerGroup: React.FC<SpeakerGroupProps> = ({
  name,
  speakers,
}) => {
  return (
    // <Droppable droppableId={`droppable-${name}`}>
    // {(provided) => (
    <Stack
      // ref={provided.innerRef}
      // {...provided.droppableProps}
      bg="gray.700"
      p={3}
      borderRadius="md"
    >
      <Stack direction="row" justifyContent="space-between">
        <Text fontWeight="bold" mb={1}>
          {name}
        </Text>
        <IconButton
          aria-label="Supprimer"
          // onClick={() => handleDelete()}
          icon={<FiTrash />}
          variant="@primary"
          size="sm"
        />
      </Stack>
      <Wrap>
        {speakers?.length > 0 ? (
          speakers?.map((speaker, index) => (
            <SpeakerCard key={speaker?.id} speaker={speaker} index={index} />
          ))
        ) : (
          <EmptySpeakerCard />
        )}
      </Wrap>
      {/* {provided.placeholder} */}
    </Stack>
    // )}
    // </Droppable>
  );
};

export const NoProjectGroup = ({ speakers = [], ...rest }) => {
  return (
    // <Droppable droppableId={`droppable-noProject`}>
    // {(provided) => (
    <Stack
      // ref={provided.innerRef}
      // {...provided.droppableProps}
      p={3}
      borderRadius="md"
      border="dashed 1px"
      {...rest}
    >
      {speakers?.length > 0 ? (
        <Wrap {...rest}>
          {speakers?.map((speaker, index) => (
            <WrapItem key={speaker?.id}>
              <SpeakerCard speaker={speaker} index={index} />
            </WrapItem>
          ))}
        </Wrap>
      ) : (
        <Box h={10} />
      )}
      {/* {provided.placeholder} */}
    </Stack>
    //   )}
    // </Droppable>
  );
};
