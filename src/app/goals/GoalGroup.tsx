import {
  GridItem,
  IconButton,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FiPlus } from 'react-icons/fi';

import { DATE_FORMAT } from '@/app/shared/constants';
import { useToastSuccess } from '@/components';

import { EmptyGoalCard, GoalCard } from './GoalCard';
import { GoalModal } from './GoalModal';
import { Goal } from './goal.types';
import { useGoalAdd } from './goals.firebase';

interface GoalGroupProps extends StackProps {
  name: string;
  date?: string;
  goals: Goal[];
}

export const GoalGroup: React.FC<GoalGroupProps> = ({
  name,
  date,
  goals,
  ...rest
}) => {
  const toastSuccess = useToastSuccess();

  const { mutate: addGoal } = useGoalAdd();
  const isToday = dayjs()?.format(DATE_FORMAT) === date;

  const handleAddGoal = (values) => {
    addGoal(
      { ...values, date, isComplete: false },
      {
        onSuccess: async () =>
          toastSuccess({
            title: "L'objectif a été ajouté avec succès",
          }),
      }
    );
  };

  const {
    isOpen: isOpenGoalModal,
    onOpen: onOpenGoalModal,
    onClose: onCloseGoalModal,
  } = useDisclosure();

  return (
    <>
      <Stack
        bg="gray.700"
        p={3}
        borderRadius="md"
        border={isToday && '2px solid'}
        borderColor="brand.500"
        {...rest}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb="1"
        >
          <Text fontWeight="bold" mb={1} textTransform="capitalize" flex="1">
            {name}
          </Text>
          {date && (
            <IconButton
              aria-label="Ajouter un objectif"
              icon={<FiPlus />}
              variant="@primary"
              size="sm"
              onClick={onOpenGoalModal}
            />
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
      {isOpenGoalModal && (
        <GoalModal
          onClose={onCloseGoalModal}
          onSubmit={handleAddGoal}
          title="Ajouter un objectif"
          confirmText="Ajouter"
        />
      )}
    </>
  );
};
