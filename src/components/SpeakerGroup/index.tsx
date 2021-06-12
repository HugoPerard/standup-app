import { IconButton, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { FiTrash } from 'react-icons/fi';

import { useProjects, useUpdateProjects } from '@/app/standup/standup.service';
import { Speaker } from '@/app/standup/standup.types';

import { SpeakerCard } from '../SpeakerCard';

interface SpeakerGroupProps {
  name: string;
  speakers: Speaker[];
}

export const SpeakerGroup: React.FC<SpeakerGroupProps> = ({
  name,
  speakers,
}) => {
  const { data: projects } = useProjects();
  const { mutate: updateProjects } = useUpdateProjects();

  const handleDelete = () => {
    updateProjects(projects?.filter((project) => project?.name !== name));
  };

  return (
    <Droppable droppableId={`draggable-${name}`}>
      {(provided) => (
        <Stack
          ref={provided.innerRef}
          {...provided.droppableProps}
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
              icon={<FiTrash />}
              variant="@primary"
              size="sm"
              onClick={() => handleDelete()}
            />
          </Stack>
          <Wrap>
            {speakers?.map((speaker) => (
              <WrapItem key={speaker?.name}>
                <SpeakerCard speaker={speaker} />
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      )}
    </Droppable>
  );
};
