import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  IconButton,
  Flex,
  Stack,
  Spinner,
  Text,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { useQuery } from 'react-query';

import { Loader, Page, PageContent } from '@/app/layout';
import { Icon, PopoverInput, useToastSuccess } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';
import { sortByIndex } from '@/utils/sortByIndex';

import { EmptySpeakerCard } from './_partials/SpeakerCard';
import { SpeakerGroup } from './_partials/SpeakerGroup';
import {
  useProjects,
  useProjectAdd,
  useSpeakerUpdate,
  useProjectReplace,
  useSpeakers,
} from './standup.firebase';
import { Project } from './standup.types';

export const PageStandup = () => {
  const { colorModeValue } = useDarkMode();
  // const [isErrorSpeakers, setIsErrorSpeakers] = useState(false);
  // const [isLoadingSpeakers, setIsloadingSpeakers] = useState(false);
  // const [speakers, setSpeakers] = useState([]);

  //requete pour récuperer les spreakers sur l'API

  // const { data, isLoading: isFetchingSpeakers } = useQuery('new-speakers', () =>
  //   axios.get('https://localhost:8000/speakers')
  // );
  // console.log(data);

  // requete pour récuperer les spreakers sur l'API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsErrorSpeakers(false);
  //     setIsloadingSpeakers(true);
  //     try {
  //       const response = await axios('https://localhost:8000/speakers');

  //       setSpeakers(response);
  //       console.log('useEffect', response);
  //     } catch (error) {
  //       setIsErrorSpeakers(true);
  //     }
  //     setIsloadingSpeakers(false);
  //   };
  //   fetchData();
  // }, []);

  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  console.log('projeccst', projects);

  // const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>(
  //   'new-project',
  //   async () => {
  //     const response = await axios.get('https://localhost:8000/projects');
  //     console.log(response);
  //     return projects;
  //   }
  // );

  const toastSuccess = useToastSuccess();
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

  const {
    data: speakers,
    isFetching: isFetchingSpeakers,
    isLoading: isLoadingSpeakers,
    isError: isErrorSpeakers,
  } = useSpeakers(null, { refetchInterval: 15000 });
  // const {
  //   data: speakers,
  //   isFetching: isFetchingSpeakers,
  //   isLoading: isLoadingSpeakers,
  //   isError: isErrorSpeakers,
  // } = useQuery<any>('new-speakers', () =>
  //   axios.get('https://localhost:8000/speakers')
  // );

  console.log({
    speakers,
    isFetchingSpeakers,
    isLoadingSpeakers,
    isErrorSpeakers,
  });

  const absentSpeakers = speakers?.filter((speaker) => speaker.isAbsent);

  const {
    isOpen: isOpenAbsentsContainer,
    onToggle: onToggleAbsentsContainer,
  } = useDisclosure({ defaultIsOpen: true });

  return (
    <Page containerSize="full">
      <PageContent>
        <Stack
          position="absolute"
          left={5}
          right={5}
          bottom={5}
          bg={colorModeValue('gray.300', 'gray.700')}
          spacing={0}
          maxW={isOpenAbsentsContainer && !isLoadingSpeakers ? 300 : 150}
          padding={3}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.400"
          zIndex={10}
          cursor="pointer"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={isOpenAbsentsContainer ? 2 : 0}
          >
            <Text fontWeight="bold">
              Absent{absentSpeakers?.length > 1 && 's'}
              {isFetchingSpeakers && <Spinner size="xs" ml={2} />}
            </Text>
            <IconButton
              aria-label={isOpenAbsentsContainer ? 'Contracter' : 'Étendre'}
              onClick={() => onToggleAbsentsContainer()}
              icon={
                isOpenAbsentsContainer ? (
                  <BsArrowsAngleContract />
                ) : (
                  <BsArrowsAngleExpand />
                )
              }
              variant="ghost"
              size="xs"
            />
          </Stack>
          {isOpenAbsentsContainer &&
            !isLoadingSpeakers &&
            (absentSpeakers?.length > 0 ? (
              absentSpeakers?.map((speaker) => (
                <Text key={speaker.id} isTruncated>
                  {speaker.name}
                </Text>
              ))
            ) : (
              <EmptySpeakerCard>Personne n'est absent</EmptySpeakerCard>
            ))}
        </Stack>

        {isLoadingProjects ? (
          <Loader />
        ) : (
          <Flex position="fixed" h="full" left={5} right={5} overflowX="scroll">
            <Box minW="10rem">
              <PopoverInput
                onSubmit={(value) => handleAddProject(value)}
                label="Nom"
                submitLabel="Ajouter un projet"
                placeholder="Saisir le nom du projet"
                placement="bottom-start"
              >
                <Button
                  variant="@primary"
                  size="sm"
                  isLoading={isLoadingAddProject}
                >
                  <Icon icon={FiPlus} mr={1} /> Ajouter un projet
                </Button>
              </PopoverInput>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="board"
                type="PROJECT"
                direction="horizontal"
              >
                {(droppableProvided) => (
                  <Flex ref={droppableProvided.innerRef}>
                    <Stack direction="row">
                      {sortByIndex(projects)?.map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={`${project.id}`}
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
                              <SpeakerGroup
                                project={project}
                                speakers={speakers?.filter(
                                  (speaker) =>
                                    speaker?.projectId === project?.id
                                )}
                                isLoading={isLoadingSpeakers}
                                isError={isErrorSpeakers}
                              />
                              {provided.placeholder}
                            </Box>
                          )}
                        </Draggable>
                      ))}

                      {droppableProvided.placeholder}
                    </Stack>
                  </Flex>
                )}
              </Droppable>
            </DragDropContext>
          </Flex>
        )}
      </PageContent>
    </Page>
  );
};
