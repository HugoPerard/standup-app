import { IconButton, Stack, StackProps, Text, Wrap } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { Goal } from '@/app/goals/goal.types';

import { GoalCard } from '../GoalCard';
import { PopoverInput } from '../PopoverInput';

interface GoalGroupProps extends StackProps {
  name: string;
  goals: Goal[];
}

export const GoalGroup: React.FC<GoalGroupProps> = ({
  name,
  goals,
  ...rest
}) => {
  return (
    <Stack bg="gray.700" p={3} borderRadius="md" {...rest}>
      <Stack direction="row" justifyContent="space-between" mb="1">
        <Text fontWeight="bold" mb={1} textTransform="capitalize" flex="1">
          {name}
        </Text>
        <PopoverInput
          onSubmit={(value) => console.log({ value })}
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
      <Wrap>
        {goals?.map((goal) => (
          <GoalCard goal={goal} />
        ))}
      </Wrap>
    </Stack>
  );
};
