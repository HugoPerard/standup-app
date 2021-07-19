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
  SimpleGrid,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { Loader, Page, PageContent } from '@/app/layout';
import { FieldInput, useToastSuccess, SpeakerGroup } from '@/components';
import { sortByIndex } from '@/utils/sortByIndex';

import { useProjects, useProjectAdd, useSpeakerAdd } from './standup.firebase';

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

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
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
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
              spacing="2"
            >
              {sortByIndex(projects, 'desc')?.map((project) => (
                <SpeakerGroup key={project?.id} project={project} />
              ))}
            </SimpleGrid>
            <SpeakerGroup project={{ id: '0', name: '', index: -1 }} />
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
