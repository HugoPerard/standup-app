import { Box, Button, Stack, StackProps, Text } from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus } from 'react-icons/fi';

import { useProjectAdd } from '@/app/standup/standup/standup.firebase';
import { Project } from '@/app/standup/standup/standup.types';
import { PopoverInput, useToastSuccess } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

interface ProjectsBarProps extends StackProps {
  projects: Project[];
  currentIndex: number;
  setCurrentIndex(index: number): void;
  projectsRefs: any;
}

export const ProjectsBar: React.FC<ProjectsBarProps> = ({
  projects,
  currentIndex,
  setCurrentIndex,
  projectsRefs,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  const isCurrentProject = (project: Project) => {
    return project?.index === currentIndex;
  };

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

  return (
    <Stack {...rest}>
      <Box>
        <PopoverInput
          label="Nom"
          submitLabel="Ajouter un projet"
          placeholder="Saisir le nom du projet"
          onSubmit={(value) => handleAddProject(value)}
        >
          <Button
            leftIcon={<FiPlus />}
            variant="@primary"
            size="xs"
            isLoading={isLoadingAddProject}
          >
            Ajouter un projet
          </Button>
        </PopoverInput>
      </Box>
      <Droppable droppableId="board" type="PROJECT" direction="vertical">
        {(droppableProvided) => (
          <Stack ref={droppableProvided.innerRef} direction="column">
            {projects?.map((project, index) => (
              <Draggable
                key={project.id}
                draggableId={project.id}
                index={index}
              >
                {(provided) => (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={project?.id}
                    p={2}
                    border={isCurrentProject(project) ? '1px solid' : undefined}
                    borderColor={
                      isCurrentProject(project) ? 'brand.500' : undefined
                    }
                    borderRadius="md"
                    bg={colorModeValue('gray.200', 'gray.600')}
                    onClick={() => {
                      setCurrentIndex(project?.index);
                      projectsRefs.current[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }}
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      maxW={200}
                      isTruncated
                    >
                      {project.name}
                    </Text>
                  </Stack>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Stack>
  );
};
