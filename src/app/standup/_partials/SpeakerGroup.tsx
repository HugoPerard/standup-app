import {
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Stack,
  StackProps,
  Button,
  chakra,
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

  const {
    mutate: deleteProject,
    isLoading: isLoadingDeleteProject,
  } = useProjectDelete();
  const {
    mutate: addSpeaker,
    isLoading: isLoadingAddSpeaker,
  } = useSpeakerAdd();
  const { mutate: updateProject } = useProjectUpdate();

  const {
    data: speakers,
    isLoading: isLoadingSpeakers,
    isError: isErrorSpeakers,
  } = useSpeakers(project?.id);

  const handleAddSpeaker = (name) => {
    addSpeaker(
      { name, projectId: project?.id, index: speakers?.length },
      {
        onSuccess: async () =>
          toastSuccess({ title: `${name} a été ajouté avec succès` }),
      }
    );
  };

  const handleDeleteProject = () => {
    deleteProject(project?.id, {
      onSuccess: async () =>
        toastSuccess({
          title: `Le projet ${project?.name} a été supprimé avec succès`,
          description:
            speakers?.length > 0
              ? `Les personnes sur ce projet ont aussi été supprimé`
              : undefined,
        }),
    });
  };

  const handleUpdateProject = (name: string) => {
    if (name === project?.name) {
      return;
    }
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
          minW="14rem"
          {...rest}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Editable
              as={chakra.button} // Fix Editable not working in dragHandle component
              textAlign="left"
              fontWeight="bold"
              fontSize="sm"
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
              isLoading={isLoadingDeleteProject}
            />
          </Stack>

          {isLoadingSpeakers && <Loader />}
          {isErrorSpeakers && (
            <EmptySpeakerCard>
              Erreur lors de la récupération des personnes sur ce projet
            </EmptySpeakerCard>
          )}
          {!isLoadingSpeakers && !isErrorSpeakers && speakers?.length > 0 && (
            <Stack spacing={1}>
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
            </Stack>
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
            <Button
              variant="link"
              colorScheme="yellow"
              size="xs"
              isLoading={isLoadingAddSpeaker}
            >
              <Icon icon={FiPlus} mr={1} /> Ajouter une personne
            </Button>
          </PopoverInput>
        </Stack>
      )}
    </Droppable>
  );
};
