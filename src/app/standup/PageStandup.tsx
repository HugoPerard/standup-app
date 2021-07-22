import React from 'react';

import { Box, Button, Stack } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus } from 'react-icons/fi';

import { Loader, Page, PageContent } from '@/app/layout';
import { Icon, PopoverInput, useToastSuccess } from '@/components';
import { sortByIndex } from '@/utils/sortByIndex';

import { SpeakerGroup } from './_partials/SpeakerGroup';
import {
  useProjects,
  useProjectAdd,
  useSpeakerUpdate,
  useProjectReplace,
} from './standup.firebase';

export const PageStandup = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const toastSuccess = useToastSuccess();

  const isLoading = isLoadingProjects;

  const {
    mutate: addProject,
    isLoading: isLoadingAddProject,
  } = useProjectAdd();

  const handleAddProject = (projectName: string) => {
    if (!projectName) {
      return;
    }
    addProject(projectName, {
      onSuccess: () => {
        toastSuccess({
          title: `Le projet ${projectName} a été créé avec succès`,
        });
      },
    });
  };

  const { mutate: updateSpeaker } = useSpeakerUpdate();

  const { mutate: replaceProject } = useProjectReplace();

  const handleDragEnd = ({ draggableId, source, destination, type }) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'PROJECT') {
      const movedProject = projects?.find(
        (project) => project?.id === draggableId
      );

      replaceProject(
        { project: movedProject, newIndex: destination.index },
        {
          onSuccess: () => {
            toastSuccess({
              title: `Le projet ${movedProject?.name} a été déplacé avec succès`,
            });
          },
        }
      );
      return;
    }
    if (type === 'SPEAKER') {
      updateSpeaker(
        {
          id: draggableId,
          payload: {
            projectId: destination?.droppableId,
            index: destination?.index,
          },
        },
        {
          onSuccess: (value) => {
            toastSuccess({
              title: `${value?.name} a été déplacée avec succès`,
            });
          },
        }
      );
      return;
    }
    return;
  };

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="board"
              type="PROJECT"
              direction="horizontal"
            >
              {(droppableProvided) => (
                <Stack
                  ref={droppableProvided.innerRef}
                  direction="row"
                  spacing={1}
                  overflow="scroll"
                  position="fixed"
                  left={5}
                  right={5}
                  h="full"
                >
                  <Box minW="10rem">
                    <PopoverInput
                      onSubmit={(value) => handleAddProject(value)}
                      label="Nom"
                      submitLabel="Ajouter un projet"
                      placeholder="Saisir le nom du projet"
                    >
                      <Button
                        variant="@primary"
                        size="sm"
                        isDisabled={isLoadingAddProject}
                      >
                        <Icon icon={FiPlus} mr={1} /> Ajouter un projet
                      </Button>
                    </PopoverInput>
                  </Box>
                  {sortByIndex(projects)?.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-react-beautiful-dnd-draggable="0"
                          data-react-beautiful-dnd-drag-handle="0"
                          h="fit-content"
                        >
                          <SpeakerGroup project={project} />
                          {provided.placeholder}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </PageContent>
    </Page>
  );
};
