import React, { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Stack } from '@chakra-ui/layout';
import { DragDropContext } from 'react-beautiful-dnd';

import { Loader, Page, PageContent } from '@/app/layout';
import { SpeakerGroup } from '@/components/SpeakerGroup';

import { useProjects, useUpdateProjects } from './standup.service';

export const PageStandup = () => {
  const { data: projects, isLoading } = useProjects();

  const { mutate: updateProjects } = useUpdateProjects();

  const [newProject, setNewProject] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');

  return (
    <Page containerSize="full" bg="gray.800">
      <DragDropContext>
        <PageContent color="gray.200">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Stack direction="row" pb={6}>
                <Input
                  value={newProject}
                  onChange={(e) => setNewProject(e?.target?.value)}
                  flex="2"
                  color="gray.800"
                />
                <Button
                  variant="@primary"
                  onClick={() =>
                    updateProjects([
                      ...projects,
                      {
                        name: newProject,
                        speakers: [],
                      },
                    ])
                  }
                  flex="1"
                >
                  Ajouter un projet
                </Button>
                <Input
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e?.target?.value)}
                  flex="2"
                  color="gray.800"
                />
                <Button variant="@primary" flex="1">
                  Ajouter une personne
                </Button>
              </Stack>
              <Stack spacing={3}>
                {projects?.map((project) => (
                  <SpeakerGroup
                    key={project?.name}
                    name={project?.name}
                    speakers={project?.speakers}
                  />
                ))}
              </Stack>
            </>
          )}
        </PageContent>
      </DragDropContext>
    </Page>
  );
};
