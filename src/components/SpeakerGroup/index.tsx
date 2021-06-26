import {
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import {
  useProjectDelete,
  useSpeakerAdd,
} from '@/app/standup/standup.firebase';
import { Project, Speaker } from '@/app/standup/standup.types';

import { PopoverInput } from '../PopoverInput';
import { EmptySpeakerCard, SpeakerCard } from '../SpeakerCard';

interface SpeakerGroupProps {
  project: Project;
  speakers: Speaker[];
}

export const SpeakerGroup: React.FC<SpeakerGroupProps> = ({
  project,
  speakers,
}) => {
  const { mutate: deleteProject } = useProjectDelete();
  const { mutate: addSpeaker } = useSpeakerAdd();

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
