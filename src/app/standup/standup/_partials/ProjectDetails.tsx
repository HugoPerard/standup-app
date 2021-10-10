import {
  Editable,
  EditablePreview,
  EditableInput,
  Spinner,
  Stack,
  StackProps,
  ButtonGroup,
} from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';

import {
  useProjectDelete,
  useProjectUpdate,
} from '@/app/standup/standup/standup.firebase';
import { Project, Speaker } from '@/app/standup/standup/standup.types';
import { ResponsiveIconButton, useToastSuccess } from '@/components';

import { EmptySpeakerCard, SpeakerCard } from './SpeakerCard';

export interface ProjectDetailsProps extends StackProps {
  project: Project;
  speakers: Speaker[];
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  speakers,
  ...rest
}) => {
  const toastSuccess = useToastSuccess();

  const {
    mutate: deleteProject,
    isLoading: isLoadingDeleteProject,
  } = useProjectDelete();

  const handleDeleteProject = () => {
    deleteProject(project?.id, {
      onSuccess: async () =>
        toastSuccess({
          title: `Le projet ${project?.name} a été supprimé avec succès`,
          description: `Les personnes encore sur ce projet ont aussi été supprimé`,
        }),
    });
  };

  const {
    mutate: updateProject,
    isLoading: isLoadingUpdateProject,
  } = useProjectUpdate();

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
    <Stack key={project?.id} spacing={4} {...rest}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Editable
          fontSize="xl"
          fontWeight="bold"
          defaultValue={project?.name}
          onSubmit={(value) => handleUpdateProject(value)}
        >
          <EditablePreview />
          <EditableInput />
          {isLoadingUpdateProject && <Spinner />}
        </Editable>
        <ButtonGroup size="xs">
          <ResponsiveIconButton
            icon={<FiUserPlus />}
            variant="@secondary"
            hideTextBreakpoints={{ base: true, lg: false }}
          >
            Ajouter une personne
          </ResponsiveIconButton>
          <ResponsiveIconButton
            icon={<FiTrash2 />}
            variant="@primary"
            hideTextBreakpoints={{ base: true, lg: false }}
            onClick={() => handleDeleteProject()}
            isLoading={isLoadingDeleteProject}
          >
            Supprimer le projet
          </ResponsiveIconButton>
        </ButtonGroup>
      </Stack>
      <Droppable droppableId={project?.id} type="SPEAKER" direction="vertical">
        {(provided, droppableSnapshot) => (
          <Stack
            ref={provided.innerRef}
            border={droppableSnapshot?.isDraggingOver ? '1px solid' : undefined}
          >
            {speakers?.length > 0 ? (
              speakers?.map((speaker, index) => (
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
                        speaker={speaker}
                        index={speaker.index}
                      />
                      {placeholder}
                    </>
                  )}
                </Draggable>
              ))
            ) : (
              <EmptySpeakerCard>
                Aucune personne n'est sur ce projet
              </EmptySpeakerCard>
            )}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Stack>
  );
};
