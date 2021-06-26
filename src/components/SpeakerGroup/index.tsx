import {
  ButtonGroup,
  IconButton,
  Stack,
  StackProps,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import {
  useProjectDelete,
  useSpeakerAdd,
} from '@/app/standup/standup.firebase';
import { Project, Speaker } from '@/app/standup/standup.types';

import { PopoverInput } from '../PopoverInput';
import { EmptySpeakerCard, SpeakerCard } from '../SpeakerCard';

interface SpeakerGroupProps extends StackProps {
  project: Project;
  speakers: Speaker[];
}

export const SpeakerGroup: React.FC<SpeakerGroupProps> = ({
  project,
  speakers,
  ...rest
}) => {
  const { mutate: deleteProject } = useProjectDelete();
  const { mutate: addSpeaker } = useSpeakerAdd();

  return (
    <Droppable droppableId={`droppable-${project?.id}`}>
      {(provided) => (
        <Stack
          ref={provided.innerRef}
          {...provided.droppableProps}
          bg="gray.700"
          p={3}
          borderRadius="md"
          {...rest}
        >
          <Stack direction="row" justifyContent="space-between" mb="1">
            <Text fontWeight="bold" mb={1}>
              {project?.name}
            </Text>
            <ButtonGroup spacing={1}>
              <PopoverInput
                onSubmit={(value) =>
                  addSpeaker({ name: value, projectId: project?.id })
                }
                title="Ajouter une personne"
                submitLabel="Ajouter une personne"
                placeholder="Saisir le nom d'une personne"
              >
                <IconButton
                  aria-label="Ajouter une personne"
                  icon={<FiPlus />}
                  variant="@primary"
                  size="sm"
                />
              </PopoverInput>
              <IconButton
                aria-label="Supprimer"
                onClick={() => deleteProject(project?.id)}
                icon={<FiTrash2 />}
                variant="@primary"
                size="sm"
              />
            </ButtonGroup>
          </Stack>
          {speakers?.length > 0 ? (
            <Wrap>
              {speakers?.map((speaker, index) => (
                <SpeakerCard
                  key={speaker?.id}
                  speaker={speaker}
                  index={index}
                  flex="1"
                />
              ))}
            </Wrap>
          ) : (
            <EmptySpeakerCard />
          )}
          {provided.placeholder}
        </Stack>
      )}
    </Droppable>
  );
};
