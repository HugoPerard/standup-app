import { forwardRef } from 'react';

import {
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableInput,
  Flex,
  Spinner,
  Stack,
  StackProps,
  useDisclosure,
} from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';

import {
  useProjectDelete,
  useProjectUpdate,
  useSpeakerAdd,
} from '@/app/standup/standup/standup.firebase';
import { Project, Speaker } from '@/app/standup/standup/standup.types';
import { FormModal, ResponsiveIconButton, useToastSuccess } from '@/components';
import { sortByIndex } from '@/utils/sortByIndex';

import { EmptySpeakerCard, SpeakerCard } from './SpeakerCard';
import { SpeakerForm } from './SpeakerForm';

export interface ProjectDetailsProps extends StackProps {
  project: Project;
  speakers: Speaker[];
}

export const ProjectDetails = forwardRef<HTMLDivElement, ProjectDetailsProps>(
  ({ project, speakers, ...rest }, ref) => {
    const toastSuccess = useToastSuccess();

    const {
      isOpen: isOpenAddSpeakerModal,
      onOpen: onOpenAddSpeakerModal,
      onClose: onCloseAddSpeakerModal,
    } = useDisclosure();

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

    const {
      mutate: addSpeaker,
      isLoading: isLoadingAddSpeaker,
    } = useSpeakerAdd();

    const handleAddSpeaker = (name) => {
      addSpeaker(
        {
          name,
          projectId: project?.id,
          index: speakers?.length,
          isAbsent: false,
        },
        {
          onSuccess: async () =>
            toastSuccess({ title: `${name} a été ajouté avec succès` }),
        }
      );
    };

    const handleUpdateProjectName = (name: string) => {
      if (name === project?.name) {
        return;
      }
      updateProject(
        { id: project?.id, payload: { name } },
        {
          onSuccess: async () =>
            toastSuccess({
              title: `Le projet ${project?.name} a été renommé avec succès en ${name}`,
            }),
        }
      );
    };

    return (
      <Stack ref={ref} key={project?.id} spacing={4} {...rest}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Editable
            fontSize={{ base: 'sm', md: 'xl' }}
            fontWeight="bold"
            defaultValue={project?.name}
            onSubmit={(value) => handleUpdateProjectName(value)}
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
              onClick={onOpenAddSpeakerModal}
              isLoading={isLoadingAddSpeaker}
            >
              Ajouter une personne
            </ResponsiveIconButton>
            <FormModal
              isOpen={isOpenAddSpeakerModal}
              onClose={onCloseAddSpeakerModal}
              onSubmit={({ name }) => handleAddSpeaker(name)}
              title="Ajouter une personne"
              submitLabel="Ajouter"
            >
              <SpeakerForm />
            </FormModal>

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
        <Droppable
          droppableId={project?.id}
          type="SPEAKER"
          direction="horizontal"
        >
          {(provided, droppableSnapshot) => (
            <Flex
              ref={provided.innerRef}
              border={
                droppableSnapshot?.isDraggingOver ? '1px solid' : undefined
              }
              borderColor="brand.500"
              borderRadius="md"
              flex={1}
            >
              {speakers?.length === 0 ? (
                <EmptySpeakerCard flex={1}>
                  Aucune personne n'est sur ce projet
                </EmptySpeakerCard>
              ) : (
                <Stack direction="row" overflow="auto" p={1} flex={1}>
                  {sortByIndex(speakers)?.map((speaker) => (
                    <Draggable
                      key={speaker?.id}
                      draggableId={speaker?.id}
                      index={speaker?.index}
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
                          />
                          {placeholder}
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Flex>
          )}
        </Droppable>
      </Stack>
    );
  }
);
