import React, { useRef, useState } from 'react';

import {
  IconButton,
  Divider,
  Flex,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FiUserCheck, FiUserPlus } from 'react-icons/fi';

import { Loader, Page, PageContent } from '@/app/layout';
import { EmptyItem, useToastSuccess } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';
import { sortByIndex } from '@/utils/sortByIndex';

import { ProjectDetails } from './_partials/ProjectDetails';
import { ProjectsBar } from './_partials/ProjectsBar';
import { EmptySpeakerCard } from './_partials/SpeakerCard';
import {
  useProjectReplace,
  useProjects,
  useSpeakers,
  useSpeakerUpdate,
} from './standup.firebase';

export const PageStandup = () => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useProjects();
  const sortedProjects = sortByIndex(projects);

  const {
    data: speakers,
    isFetching: isFetchingSpeakers,
    isLoading: isLoadingSpeakers,
    isError: isErrorSpeakers,
  } = useSpeakers(null, { refetchInterval: 15000 });

  const isError = isErrorProjects || isErrorSpeakers;
  const isLoading = isLoadingProjects || isLoadingSpeakers;

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const absentSpeakers = speakers?.filter((speaker) => speaker.isAbsent);

  const { mutate: updateSpeaker } = useSpeakerUpdate();

  const handleAbsent = (speakerId, isAbsent: boolean) => {
    updateSpeaker({
      id: speakerId,
      payload: { isAbsent },
    });
  };

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
            if (currentIndex === movedProject?.index) {
              setCurrentIndex(destination.index);
            }
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

  const projectsRefs = useRef([]);

  const containerSize: 'full' | 'xl' = useBreakpointValue({
    base: 'full',
    xl: 'xl',
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Page containerSize={containerSize}>
        <PageContent alignContent="center">
          {isLoading && <Loader />}
          {isError && (
            <EmptyItem>
              Une erreur est survenue lors de la récupération des personnes
            </EmptyItem>
          )}
          {!isLoading && !isError && (
            <Stack direction="row" spacing={5} py={4} h="78vh">
              {!isMobile && (
                <ProjectsBar
                  projects={sortedProjects}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  projectsRefs={projectsRefs}
                  flex={1}
                />
              )}
              <Flex flex={5}>
                <Scrollbars autoHide>
                  <Stack
                    direction="column"
                    divider={<Divider pt={40} pb={10} />}
                    px={3}
                  >
                    {sortedProjects?.map((project, index) => (
                      <ProjectDetails
                        ref={(el) => (projectsRefs.current[index] = el)}
                        id={`project-${project?.id}`}
                        key={project?.id}
                        project={project}
                        speakers={speakers?.filter(
                          (speaker) => speaker?.projectId === project?.id
                        )}
                      />
                    ))}
                  </Stack>
                </Scrollbars>
              </Flex>
              {!isMobile && (
                <Stack
                  bg={colorModeValue('gray.200', 'gray.600')}
                  color={colorModeValue('gray.800', 'gray.50')}
                  borderRadius="md"
                  p={3}
                  height="fit-content"
                  flex={1}
                >
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Text fontWeight="medium">
                      Absents
                      {isFetchingSpeakers && <Spinner ml={1} size="sm" />}
                    </Text>
                    <IconButton
                      aria-label="Ajouter un absent"
                      icon={<FiUserPlus />}
                      variant="@secondary"
                      size="xs"
                    />
                  </Stack>
                  {absentSpeakers?.length > 0 ? (
                    <Stack spacing={1}>
                      {absentSpeakers?.map((absentSpeaker) => (
                        <Stack
                          key={absentSpeaker?.id}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <IconButton
                            aria-label="Retirer des absents"
                            icon={<FiUserCheck />}
                            onClick={() =>
                              handleAbsent(absentSpeaker?.id, false)
                            }
                            variant="@secondary"
                            size="xs"
                          />
                          <Text>{absentSpeaker?.name}</Text>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <EmptySpeakerCard
                      bg={colorModeValue('gray.100', 'gray.500')}
                      color={colorModeValue('gray.800', 'gray.50')}
                    >
                      Aucune personne n'est absent
                    </EmptySpeakerCard>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </PageContent>
      </Page>
    </DragDropContext>
  );
};
