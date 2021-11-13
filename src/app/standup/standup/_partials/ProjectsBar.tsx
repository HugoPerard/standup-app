import {
  AvatarGroup,
  Button,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FiPlus } from 'react-icons/fi';

import { useProjectAdd } from '@/app/standup/standup/standup.firebase';
import { Project, Speaker } from '@/app/standup/standup/standup.types';
import { FieldInput, FormModal, useToastSuccess } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';
import { sortByIndex } from '@/utils/sortByIndex';

import { ProjectFormValues } from './ProjectForm';
import { SpeakerAvatar } from './SpeakerAvatar';

interface ProjectsBarProps extends StackProps {
  projects: Project[];
  currentIndex: number;
  setCurrentIndex(index: number): void;
  projectsRefs: any;
  speakers: Speaker[];
}

export const ProjectsBar: React.FC<ProjectsBarProps> = ({
  projects,
  currentIndex,
  setCurrentIndex,
  projectsRefs,
  speakers,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  const {
    isOpen: isOpenAddProjectModal,
    onOpen: onOpenAddProjectModal,
    onClose: onCloseAddProjectModal,
  } = useDisclosure();

  const isCurrentProject = (project: Project) => {
    return project?.index === currentIndex;
  };

  const {
    mutate: addProject,
    isLoading: isLoadingAddProject,
  } = useProjectAdd();

  const handleAddProject = (project: ProjectFormValues) => {
    addProject(project, {
      onSuccess: () => {
        toastSuccess({
          title: `Le projet ${project?.name} a été créé avec succès`,
        });
      },
    });
  };

  return (
    <Stack {...rest}>
      <Button
        leftIcon={<FiPlus />}
        variant="@primary"
        size="sm"
        onClick={() => onOpenAddProjectModal()}
        isLoading={isLoadingAddProject}
      >
        Ajouter un projet
      </Button>
      <FormModal
        isOpen={isOpenAddProjectModal}
        onClose={onCloseAddProjectModal}
        title="Ajouter un projet"
        submitLabel="Ajouter"
        onSubmit={handleAddProject}
      >
        <FieldInput name="name" label="Nom" inputProps={{ autoFocus: true }} />
      </FormModal>
      <Droppable droppableId="board" type="PROJECT" direction="vertical">
        {(droppableProvided) => (
          <Scrollbars autoHide>
            <Stack ref={droppableProvided.innerRef} direction="column">
              {projects?.map((project, index) => (
                <Draggable
                  key={project.id}
                  draggableId={project.id}
                  index={index}
                >
                  {(draggableProvided) => (
                    <Stack
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      key={project?.id}
                      direction="row"
                      border={
                        isCurrentProject(project) ? '1px solid' : undefined
                      }
                      borderColor="brand.500"
                      borderRadius="md"
                      bg={colorModeValue('gray.200', 'gray.600')}
                      onClick={() => {
                        setCurrentIndex(project?.index);
                        projectsRefs.current[index].scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }}
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        maxW={200}
                        isTruncated
                      >
                        {project.name}
                      </Text>
                      <AvatarGroup size="sm" fontSize="xs" max={2}>
                        {sortByIndex(
                          speakers?.filter(
                            ({ projectId }) => projectId === project?.id
                          )
                        ).map((speaker) => (
                          <SpeakerAvatar speaker={speaker} />
                        ))}
                      </AvatarGroup>
                    </Stack>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </Stack>
          </Scrollbars>
        )}
      </Droppable>
    </Stack>
  );
};
