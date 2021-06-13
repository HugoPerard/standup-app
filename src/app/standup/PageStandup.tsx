import React, { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Stack } from '@chakra-ui/layout';
import { DragDropContext } from 'react-beautiful-dnd';

import { Loader, Page, PageContent } from '@/app/layout';
import { NoProjectGroup, SpeakerGroup } from '@/components/SpeakerGroup';

import { useProjects, useUpdateProjects } from './standup.service';

export const PageStandup = () => {
  const { data: projects, isLoading } = useProjects();

  const {
    mutate: updateProjects,
    isLoading: isLoadingUpdateProjects,
  } = useUpdateProjects();

  const [newProject, setNewProject] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');

  const handleDragAndDrop = (e) => {
    const source = e?.source?.droppableId?.split('droppable-')[1];
    const destination = e?.destination?.droppableId?.split('droppable-')[1];
    const speaker = e?.draggableId?.split('draggable-')[1];

    if (!destination) {
      return;
    }

    const newProjects = projects;

    const sourceIndex = projects.findIndex(
      (project) => project?.name === source
    );
    newProjects[sourceIndex].speakers = projects[sourceIndex].speakers?.filter(
      (spk) => spk?.name !== speaker
    );

    const destinationIndex = projects.findIndex(
      (project) => project?.name === destination
    );
    newProjects[destinationIndex].speakers = (
      projects[destinationIndex]?.speakers || []
    )?.concat({
      name: speaker,
    });
    updateProjects(newProjects);
  };

  const handleAddProject = () => {
    if (!newProject) {
      return;
    }
    updateProjects([
      ...projects,
      {
        name: newProject,
        speakers: [],
      },
    ]);
    setNewProject('');
  };

  const handleAddSpeaker = () => {
    if (!newSpeaker) {
      return;
    }

    const noProjectSpeakers = (
      projects?.find((project) => project?.name === 'noProject')?.speakers || []
    )?.concat({ name: newSpeaker });
    updateProjects([
      ...projects?.filter((project) => project?.name !== 'noProject'),
      {
        name: 'noProject',
        speakers: noProjectSpeakers,
      },
    ]);
    setNewSpeaker('');
  };

  return (
    <Page containerSize="full" bg="gray.800">
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <PageContent color="gray.200">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Stack direction="row" pb={6}>
                <Input
                  value={newProject}
                  onChange={(e) => setNewProject(e?.target?.value)}
                  placeholder="Saisir le nom d'un projet"
                  flex="2"
                  color="gray.800"
                />
                <Button
                  variant="@primary"
                  onClick={() => handleAddProject()}
                  flex="1"
                  isDisabled={isLoadingUpdateProjects}
                >
                  {isLoadingUpdateProjects ? <Loader /> : 'Ajouter un projet'}
                </Button>
                <Input
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e?.target?.value)}
                  placeholder="Saisir le nom d'une personne"
                  flex="2"
                  color="gray.800"
                />
                <Button
                  variant="@primary"
                  flex="1"
                  onClick={() => handleAddSpeaker()}
                >
                  {isLoadingUpdateProjects ? (
                    <Loader />
                  ) : (
                    'Ajouter une personne'
                  )}
                </Button>
              </Stack>
              <Stack spacing={3}>
                {projects?.map((project) =>
                  project?.name === 'noProject' ? (
                    <NoProjectGroup speakers={project?.speakers} />
                  ) : (
                    <SpeakerGroup
                      key={project?.name}
                      name={project?.name}
                      speakers={project?.speakers}
                    />
                  )
                )}
              </Stack>
            </>
          )}
        </PageContent>
      </DragDropContext>
    </Page>
  );
};
