import React, { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Stack } from '@chakra-ui/layout';
import { SimpleGrid, Wrap } from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';

import { Loader, Page, PageContent } from '@/app/layout';
import { SpeakerCard } from '@/components/SpeakerCard';
import { SpeakerGroup } from '@/components/SpeakerGroup';

import {
  useProjects,
  useSpeakers,
  useProjectAdd,
  useSpeakerAdd,
  useSpeakerUpdate,
} from './standup.firebase';

export const PageStandup = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const { data: speakers } = useSpeakers();

  const isLoading = isLoadingProjects;

  const {
    mutate: addSpeaker,
    isLoading: isLoadingAddSpeaker,
  } = useSpeakerAdd();

  const {
    mutate: addProject,
    isLoading: isLoadingAddProject,
  } = useProjectAdd();

  const [newProject, setNewProject] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');

  const { mutate: updateSpeaker } = useSpeakerUpdate();

  const handleDragAndDrop = (e) => {
    const speakerId = e?.draggableId?.split('draggable-')[1];
    const destination = e?.destination?.droppableId?.split('droppable-')[1];

    updateSpeaker({ id: speakerId, payload: { projectId: destination } });
  };

  const handleAddProject = () => {
    if (!newProject) {
      return;
    }
    addProject(newProject);
    setNewProject('');
  };

  const handleAddSpeaker = () => {
    if (!newSpeaker) {
      return;
    }
    addSpeaker({ name: newSpeaker });
    setNewSpeaker('');
  };

  return (
    <Page containerSize="full" bg="gray.800">
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <PageContent color="gray.200">
          {isLoading ? (
            <Loader />
          ) : (
            <Stack spacing={6}>
              <Stack direction={{ base: 'column', md: 'row' }}>
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddProject();
                  }}
                  style={{ flex: 1 }}
                >
                  <Stack direction="row">
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e?.target?.value)}
                      placeholder="Saisir le nom d'un projet"
                      flex="2"
                      color="gray.800"
                    />
                    <Button
                      type="submit"
                      variant="@primary"
                      flex="1"
                      isDisabled={isLoadingAddProject}
                    >
                      {isLoadingAddProject ? <Loader /> : 'Ajouter un projet'}
                    </Button>
                  </Stack>
                </form>
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSpeaker();
                  }}
                  style={{ flex: 1 }}
                >
                  <Stack direction="row">
                    <Input
                      value={newSpeaker}
                      onChange={(e) => setNewSpeaker(e?.target?.value)}
                      placeholder="Saisir le nom d'une personne"
                      flex="2"
                      color="gray.800"
                    />
                    <Button
                      type="submit"
                      variant="@primary"
                      flex="1"
                      isDisabled={isLoadingAddSpeaker}
                    >
                      {isLoadingAddSpeaker ? (
                        <Loader />
                      ) : (
                        'Ajouter une personne'
                      )}
                    </Button>
                  </Stack>
                </form>
              </Stack>
              <Wrap>
                {speakers
                  ?.filter((speaker) => !speaker?.projectId)
                  .map((speaker, index) => (
                    <SpeakerCard
                      key={speaker?.id}
                      speaker={speaker}
                      index={index}
                    />
                  ))}
              </Wrap>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                spacing="2"
              >
                {projects
                  ?.sort((a, b) => {
                    if (a?.index < b?.index) {
                      return 1;
                    }
                    if (a?.index > b?.index) {
                      return -1;
                    }
                    return 0;
                  })
                  ?.map((project) => (
                    <SpeakerGroup
                      key={project?.id}
                      project={project}
                      speakers={speakers?.filter(
                        (speaker) => speaker?.projectId === project?.id
                      )}
                    />
                  ))}
              </SimpleGrid>
            </Stack>
          )}
        </PageContent>
      </DragDropContext>
    </Page>
  );
};
