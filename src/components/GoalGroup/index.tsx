import {
  GridItem,
  IconButton,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FiPlus } from 'react-icons/fi';

import { Goal } from '@/app/goals/goal.types';
import { useGoalAdd } from '@/app/goals/goals.firebase';

import { EmptyGoalCard, GoalCard } from '../GoalCard';
import { GoalPopover } from '../GoalPopover';

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
  const { mutate: addGoal } = useGoalAdd();
  const isToday = dayjs()?.format('DD-MM-YYYY') === date;

  return (
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
          <GoalPopover
            onSubmit={(values) =>
              addGoal({ ...values, date, isComplete: false })
            }
          >
            <IconButton
              aria-label="Ajouter un objectif"
              icon={<FiPlus />}
              variant="@primary"
              size="sm"
            />
          </GoalPopover>
        )}
      </Stack>
      <SimpleGrid columns={2} spacing={2}>
        {goals?.length > 0 ? (
          goals?.map((goal) => <GoalCard key={goal?.id} goal={goal} />)
        ) : (
          <GridItem colSpan={2}>
            <EmptyGoalCard>Aucun objectif</EmptyGoalCard>
          </GridItem>
        )}
        {}
      </SimpleGrid>
    </Stack>
  );
};
