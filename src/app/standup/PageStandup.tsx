import React, { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Stack } from '@chakra-ui/layout';
import { Wrap } from '@chakra-ui/react';

import { Loader, Page, PageContent } from '@/app/layout';
import { SpeakerCard } from '@/components/SpeakerCard';
import { SpeakerGroup } from '@/components/SpeakerGroup';

import {
  useAddProject,
  useAddSpeaker,
  useProjects,
  useSpeakers,
} from './standup.service';

export const PageStandup = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const { data: speakers } = useSpeakers();

  const isLoading = isLoadingProjects;

  const {
    mutate: addSpeaker,
    isLoading: isLoadingAddProject,
  } = useAddSpeaker();

  const {
    mutate: addProject,
    isLoading: isLoadingAddSpeaker,
  } = useAddProject();

  const [newProject, setNewProject] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');

  // const handleDragAndDrop = (e) => {
  //   const source = e?.source?.droppableId?.split('droppable-')[1];
  //   const destination = e?.destination?.droppableId?.split('droppable-')[1];
  //   const speaker = e?.draggableId?.split('draggable-')[1];

  //   if (!destination) {
  //     return;
  //   }

  //   const newProjects = projects;

  //   const sourceIndex = projects.findIndex(
  //     (project) => project?.name === source
  //   );
  //   newProjects[sourceIndex].speakers = projects[sourceIndex].speakers?.filter(
  //     (spk) => spk?.name !== speaker
  //   );

  //   const destinationIndex = projects.findIndex(
  //     (project) => project?.name === destination
  //   );
  //   newProjects[destinationIndex].speakers = (
  //     projects[destinationIndex]?.speakers || []
  //   )?.concat({
  //     name: speaker,
  //   });
  //   updateProjects(newProjects);
  // };

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
    addSpeaker(newSpeaker);
    setNewSpeaker('');
  };

  return (
    <Page containerSize="full" bg="gray.800">
      {/* <DragDropContext onDragEnd={handleDragAndDrop}> */}
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Stack direction="row">
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
                isDisabled={isLoadingAddProject}
              >
                {isLoadingAddProject ? <Loader /> : 'Ajouter un projet'}
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
                isDisabled={isLoadingAddSpeaker}
              >
                {isLoadingAddSpeaker ? <Loader /> : 'Ajouter une personne'}
              </Button>
            </Stack>
            <Wrap>
              {speakers
                ?.filter((speaker) => !speaker?.projectId)
                .map((speaker, index) => (
                  <SpeakerCard speaker={speaker} index={index} />
                ))}
            </Wrap>
            <Stack spacing={3}>
              {projects?.map((project) => (
                <SpeakerGroup
                  key={project?.id}
                  name={project?.name}
                  speakers={speakers?.filter(
                    (speaker) => speaker?.projectId === project?.id
                  )}
                />
              ))}
            </Stack>
          </Stack>
        )}
      </PageContent>
      {/* </DragDropContext> */}
    </Page>
  );
};
