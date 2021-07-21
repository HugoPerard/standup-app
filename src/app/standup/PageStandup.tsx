import React from 'react';

import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Loader, Page, PageContent } from '@/app/layout';
import { FieldInput, useToastSuccess } from '@/components';
import { sortByIndex } from '@/utils/sortByIndex';

import { SpeakerGroup } from './_partials/SpeakerGroup';
import {
  useProjects,
  useProjectAdd,
  useSpeakerAdd,
  useSpeakerUpdate,
  useProjectReplace,
} from './standup.firebase';

export const PageStandup = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const toastSuccess = useToastSuccess();

  const isLoading = isLoadingProjects;

  const {
    mutate: addSpeaker,
    isLoading: isLoadingAddSpeaker,
  } = useSpeakerAdd();

  const {
    mutate: addProject,
    isLoading: isLoadingAddProject,
  } = useProjectAdd();

  const projectForm = useForm();
  const speakerForm = useForm();

  const handleAddProject = (projectName) => {
    if (!projectName) {
      return;
    }
    addProject(projectName, {
      onSuccess: () => {
        toastSuccess({ title: 'Le projet a été créé avec succès' });
      },
    });
    projectForm?.setFieldsValues({ projectName: '' });
  };

  const handleAddSpeaker = (speakerName) => {
    if (!speakerName) {
      return;
    }
    addSpeaker(
      { name: speakerName, projectId: '0' },
      {
        onSuccess: () => {
          toastSuccess({ title: 'Une personne a été créé avec succès' });
        },
      }
    );
    speakerForm?.setFieldsValues({ speakerName: '' });
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
            toastSuccess({ title: 'Le projet a été déplacé avec succès' });
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
          onSuccess: () => {
            toastSuccess({ title: 'La personne a été déplacée avec succès' });
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
          <Stack spacing={6} flex="1" overflowX="hidden">
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontSize="sm">
                    Ajouter un projet et/ou une personne
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Stack direction={{ base: 'column', md: 'row' }}>
                    <Formiz
                      connect={projectForm}
                      onSubmit={(values: { projectName: string }) =>
                        handleAddProject(values?.projectName)
                      }
                    >
                      <form
                        noValidate
                        onSubmit={projectForm?.submit}
                        style={{
                          flex: 1,
                        }}
                      >
                        <Stack
                          direction={{
                            base: 'column',
                            sm: 'row',
                            md: 'column',
                            lg: 'row',
                          }}
                        >
                          <FieldInput
                            name="projectName"
                            placeholder="Saisir le nom d'un projet"
                            color="gray.800"
                            size="sm"
                            flex={{
                              base: 1,
                              sm: 2,
                              md: 1,
                              lg: 2,
                            }}
                          />
                          <Button
                            type="submit"
                            variant="@primary"
                            isDisabled={isLoadingAddProject}
                            size="sm"
                            flex={1}
                            minH={8}
                          >
                            {isLoadingAddProject ? (
                              <Loader />
                            ) : (
                              'Ajouter un projet'
                            )}
                          </Button>
                        </Stack>
                      </form>
                    </Formiz>
                    <Formiz
                      connect={speakerForm}
                      onSubmit={(values: { speakerName: string }) =>
                        handleAddSpeaker(values?.speakerName)
                      }
                    >
                      <form
                        noValidate
                        onSubmit={speakerForm?.submit}
                        style={{
                          flex: 1,
                        }}
                      >
                        <Stack
                          direction={{
                            base: 'column',
                            sm: 'row',
                            md: 'column',
                            lg: 'row',
                          }}
                        >
                          <FieldInput
                            name="speakerName"
                            placeholder="Saisir le nom d'une personne"
                            color="gray.800"
                            size="sm"
                            flex={{
                              base: 1,
                              sm: 2,
                              md: 1,
                              lg: 2,
                            }}
                          />
                          <Button
                            type="submit"
                            variant="@primary"
                            isDisabled={isLoadingAddSpeaker}
                            size="sm"
                            flex={1}
                            minH={8}
                          >
                            {isLoadingAddSpeaker ? (
                              <Loader />
                            ) : (
                              'Ajouter une personne'
                            )}
                          </Button>
                        </Stack>
                      </form>
                    </Formiz>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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
                    overflowX="scroll"
                    whiteSpace="nowrap"
                    flex="1"
                    maxWidth={{ base: '96vw', xl: '97vw' }}
                  >
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
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
