import {
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Stack,
  StackProps,
  Wrap,
  Button,
} from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { Loader } from '@/app/layout';
import {
  useProjectDelete,
  useProjectUpdate,
  useSpeakerAdd,
  useSpeakers,
} from '@/app/standup/standup.firebase';
import { Project } from '@/app/standup/standup.types';
import { Icon, PopoverInput, useToastSuccess } from '@/components';
import { sortByIndex } from '@/utils/sortByIndex';

import { EmptySpeakerCard, SpeakerCard } from './SpeakerCard';

interface SpeakerGroupProps extends StackProps {
  project: Project;
}

export const SpeakerGroup: React.FC<SpeakerGroupProps> = ({
  project,
  ...rest
}) => {
  const toastSuccess = useToastSuccess();

  const { mutate: deleteProject } = useProjectDelete();
  const { mutate: addSpeaker } = useSpeakerAdd();
  const { mutate: updateProject } = useProjectUpdate();

  const {
    data: speakers,
    isLoading: isLoadingSpeakers,
    isError: isErrorSpeakers,
  } = useSpeakers(project?.id);

  const handleAddSpeaker = (value) => {
    addSpeaker(
      { name: value, projectId: project?.id, index: speakers?.length },
      {
        onSuccess: async () =>
          toastSuccess({ title: 'La personne a été crée avec succès' }),
      }
    );
  };

  const handleDeleteProject = () => {
    deleteProject(project?.id, {
      onSuccess: async () =>
        toastSuccess({
          title:
            'Le projet et les personnes sur ce projet ont été supprimé avec succès',
        }),
    });
  };

  const handleUpdateProject = (name: string) => {
    updateProject(
      { id: project?.id, name },
      {
        onSuccess: async () =>
          toastSuccess({
            title: `Le projet ${project?.name} a été renommé avec succès en ${name}`,
          }),
      }
    );
  };

  return (
    <Droppable droppableId={project?.id} type="SPEAKER" direction="vertical">
      {(provided, droppableSnapshot) => (
        <Stack
          ref={provided.innerRef}
          id={project?.id}
          bg="gray.700"
          h="fit-content"
          p={3}
          borderRadius="md"
          border={droppableSnapshot?.isDraggingOver ? '1px solid' : undefined}
          borderColor="yellow.500"
          shadow="md"
          spacing={3}
          {...rest}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Editable
              fontWeight="bold"
              defaultValue={project?.name}
              onSubmit={(value) => handleUpdateProject(value)}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
            <IconButton
              aria-label="Supprimer"
              onClick={() => handleDeleteProject()}
              icon={<FiTrash2 />}
              variant="@primary"
              size="xs"
            />
          </Stack>

          {isLoadingSpeakers && <Loader />}
          {isErrorSpeakers && (
            <EmptySpeakerCard>
              Erreur lors de la récupération des personnes sur ce projet
            </EmptySpeakerCard>
          )}
          {!isLoadingSpeakers && !isErrorSpeakers && speakers?.length > 0 && (
            <Wrap>
              {sortByIndex(speakers)?.map((speaker, index) => (
                <Draggable
                  key={speaker?.id}
                  draggableId={speaker?.id}
                  index={index}
                >
                  {({
                    innerRef,
                    draggableProps,
                    dragHandleProps,
                    placeholder,
                  }) => (
                    <>
                      <SpeakerCard
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        data-react-beautiful-dnd-draggable="0"
                        data-react-beautiful-dnd-drag-handle="0"
                        key={speaker?.id}
                        speaker={speaker}
                        index={index}
                        flex="1"
                      />
                      {placeholder}
                    </>
                  )}
                </Draggable>
              ))}
            </Wrap>
          )}
          {!isLoadingSpeakers && !isErrorSpeakers && speakers?.length <= 0 && (
            <EmptySpeakerCard>Personne n'est sur ce projet</EmptySpeakerCard>
          )}
          {provided.placeholder}
          <PopoverInput
            onSubmit={(value) => handleAddSpeaker(value)}
            label="Nom"
            submitLabel="Ajouter une personne"
            placeholder="Saisir le nom d'une personne"
          >
            <Button variant="link" colorScheme="brand" size="sm">
              <Icon icon={FiPlus} mr={1} /> Ajouter une personne
            </Button>
          </PopoverInput>
        </Stack>
      )}
    </Droppable>
  );
};
