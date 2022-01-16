import {
  GridItem,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { HabitGoal } from '@/app/standup/goals/goals.types';
import { useHabitGoalAdd } from '@/app/standup/goals/habitGoals.firebase';
import { FormModal, ResponsiveIconButton, useToastSuccess } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { EmptyGoalCard } from './GoalCard';
import { HabitGoalCard } from './HabitGoalCard';
import { HabitGoalForm } from './HabitGoalForm';

interface GoalHabitsGroupProps extends StackProps {
  name: string;
  habitGoals?: HabitGoal[];
}

export const GoalHabitsGroup: React.FC<GoalHabitsGroupProps> = ({
  name,
  habitGoals,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  const { mutate: addHabitGoal } = useHabitGoalAdd();

  const handleAddHabitGoal = (values) => {
    addHabitGoal(
      { ...values },
      {
        onSuccess: async () =>
          toastSuccess({
            title: `Le compteur ${values?.description} a été ajouté avec succès`,
          }),
      }
    );
  };

  const {
    isOpen: isOpenHabitGoalModal,
    onOpen: onOpenHabitGoalModal,
    onClose: onCloseHabitGoalModal,
  } = useDisclosure();

  return (
    <>
      <Stack
        bg={colorModeValue('gray.300', 'gray.700')}
        p={3}
        borderRadius="md"
        borderColor="brand.500"
        {...rest}
      >
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="row" spacing={3}>
            <Text fontWeight="bold" textTransform="capitalize">
              {name}
            </Text>
            {
              <ResponsiveIconButton
                icon={<FiPlus />}
                onClick={onOpenHabitGoalModal}
                variant="@primary"
                size="xs"
              >
                Ajouter un objectif
              </ResponsiveIconButton>
            }
          </Stack>
        </Stack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={2}>
          {habitGoals?.length > 0 ? (
            habitGoals?.map((goal) => (
              <HabitGoalCard key={goal?.id} habitGoal={goal} />
            ))
          ) : (
            <GridItem colSpan={3}>
              <EmptyGoalCard>Aucun objectif</EmptyGoalCard>
            </GridItem>
          )}
        </SimpleGrid>
      </Stack>
      <FormModal
        isOpen={isOpenHabitGoalModal}
        onClose={onCloseHabitGoalModal}
        onSubmit={handleAddHabitGoal}
        title="Ajouter un objectif"
        submitLabel="Ajouter"
      >
        <HabitGoalForm />
      </FormModal>
    </>
  );
};
