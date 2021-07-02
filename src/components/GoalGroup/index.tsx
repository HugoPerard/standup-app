import {
  IconButton,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { Goal } from '@/app/goals/goal.types';
import { useGoalAdd } from '@/app/goals/goals.firebase';

import { GoalCard } from '../GoalCard';
import { PopoverInput } from '../PopoverInput';

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
  return (
    <Stack bg="gray.700" p={3} borderRadius="md" {...rest}>
      <Stack direction="row" justifyContent="space-between" mb="1">
        <Text fontWeight="bold" mb={1} textTransform="capitalize" flex="1">
          {name}
        </Text>
        <PopoverInput
          onSubmit={(value) => addGoal({ description: value, date })}
          title="Ajouter une personne"
          submitLabel="Ajouter une personne"
          placeholder="Saisir le nom d'une personne"
        >
          <IconButton
            aria-label="Ajouter une personne"
            icon={<FiPlus />}
            variant="@primary"
            size="sm"
          />
        </PopoverInput>
      </Stack>
      <SimpleGrid columns={2} spacing={2}>
        {goals?.map((goal) => (
          <GoalCard key={goal?.id} goal={goal} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
