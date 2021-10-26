import {
  GridItem,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { DATE_FORMAT } from '@/app/shared/constants';
import {
  useGoalAdd,
  useGoalDeleteList,
} from '@/app/standup/goals/goals.firebase';
import { Goal } from '@/app/standup/goals/goals.types';
import {
  FormModal,
  ResponsiveIconButton,
  useToastError,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { EmptyGoalCard, GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';

interface GoalGroupProps extends StackProps {
  name: string;
  date?: string;
  goals: Goal[];
  areCompletesClearable?: boolean;
}

export const GoalGroup: React.FC<GoalGroupProps> = ({
  name,
  date,
  goals,
  areCompletesClearable = false,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const isToday = dayjs()?.format(DATE_FORMAT) === date;

  const { mutate: addGoal } = useGoalAdd();

  const handleAddGoal = (values) => {
    addGoal(
      { ...values, date, isComplete: false },
      {
        onSuccess: async () =>
          toastSuccess({
            title: `L'objectif ${values?.description} a été ajouté avec succès`,
          }),
      }
    );
  };

  const {
    mutate: deleteGoalList,
    isLoading: isLoadingDeleteGoalList,
  } = useGoalDeleteList();

  const handleDeleteDoneGoals = () => {
    const doneGoalsIds = goals
      ?.filter((goal) => goal?.isComplete)
      ?.map((goal) => goal?.id);
    if (doneGoalsIds?.length === 0) {
      toastError({ title: 'Aucun objectif accompli à supprimer' });
      return;
    }

    deleteGoalList(doneGoalsIds, {
      onSuccess: async () =>
        toastSuccess({
          title: 'Les objectifs accomplis ont été suprimés avec succès',
        }),
    });
  };

  const {
    isOpen: isOpenGoalModal,
    onOpen: onOpenGoalModal,
    onClose: onCloseGoalModal,
  } = useDisclosure();

  return (
    <>
      <Stack
        bg={colorModeValue('gray.300', 'gray.700')}
        p={3}
        borderRadius="md"
        border={isToday && '2px solid'}
        borderColor="brand.500"
        {...rest}
      >
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="row" spacing={3}>
            <Text fontWeight="bold" textTransform="capitalize">
              {name}
            </Text>
            {date && (
              <ResponsiveIconButton
                icon={<FiPlus />}
                onClick={onOpenGoalModal}
                variant="@primary"
                size="xs"
              >
                Ajouter un objectif
              </ResponsiveIconButton>
            )}
          </Stack>
          {areCompletesClearable && (
            <ResponsiveIconButton
              icon={<FiTrash2 />}
              onClick={handleDeleteDoneGoals}
              variant="@primary"
              size="xs"
              isLoading={isLoadingDeleteGoalList}
            >
              Supprimer les objectifs accomplis
            </ResponsiveIconButton>
          )}
        </Stack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={2}>
          {goals?.length > 0 ? (
            goals?.map((goal) => <GoalCard key={goal?.id} goal={goal} />)
          ) : (
            <GridItem colSpan={3}>
              <EmptyGoalCard>Aucun objectif</EmptyGoalCard>
            </GridItem>
          )}
          {}
        </SimpleGrid>
      </Stack>
      <FormModal
        isOpen={isOpenGoalModal}
        onClose={onCloseGoalModal}
        onSubmit={handleAddGoal}
        title="Ajouter un objectif"
        submitLabel="Ajouter"
      >
        <GoalForm />
      </FormModal>
    </>
  );
};
