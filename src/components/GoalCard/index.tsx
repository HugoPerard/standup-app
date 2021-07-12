import {
  Center,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Goal } from '@/app/goals/goal.types';
import { useGoalDelete, useGoalUpdate } from '@/app/goals/goals.firebase';
import { ConfirmMenuItem, useToastSuccess } from '@/components';

interface GoalCardProps extends StackProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, ...rest }) => {
  const toastSuccess = useToastSuccess();

  const { mutate: deleteGoal } = useGoalDelete();
  const { mutate: updateGoal, isLoading: isLoadingUpdate } = useGoalUpdate();

  const handleCheckbox = (value) => {
    const isComplete = value?.target?.checked;
    updateGoal({ id: goal?.id, payload: { isComplete } });
  };

  return (
    <Stack
      direction="row"
      spacing={3}
      bg="gray.600"
      p={3}
      borderRadius="md"
      opacity={goal?.isComplete && '0.5'}
      {...rest}
    >
      <Checkbox
        alignSelf="start"
        isChecked={goal?.isComplete}
        isIndeterminate={isLoadingUpdate}
        isDisabled={isLoadingUpdate}
        onChange={handleCheckbox}
        pt={1}
      />
      <Stack bg="gray.600" borderRadius="md" spacing={0} flex="1">
        <Text>{goal?.description}</Text>
        <Text as="span" fontWeight="bold" textAlign="end">
          {goal?.people?.join(' - ')}
        </Text>
      </Stack>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<BsThreeDotsVertical />}
          variant="@primary"
          size="xs"
        />
        <Portal>
          <MenuList color="gray.700" bg="gray.200">
            <MenuItem
              _hover={{ bg: 'gray.300' }}
              _focus={{ bg: 'gray.400' }}
              icon={<FiEdit2 />}
              onClick={() => {}}
            >
              Editer
            </MenuItem>
            <ConfirmMenuItem
              _hover={{ bg: 'gray.300' }}
              _focus={{ bg: 'gray.400' }}
              confirmContent="Confirmer la suppression"
              icon={<FiTrash2 />}
              onClick={() =>
                deleteGoal(goal?.id, {
                  onSuccess: async () =>
                    toastSuccess({
                      title: "L'objectif a été supprimé avec succès",
                    }),
                })
              }
            >
              Supprimer
            </ConfirmMenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </Stack>
  );
};

export const EmptyGoalCard = ({ children, ...props }) => {
  return (
    <Center bg="gray.600" py={2} px={4} borderRadius="md" {...props}>
      <Text>{children}</Text>
    </Center>
  );
};
