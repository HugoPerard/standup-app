import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { Goal } from '@/app/goals/goal.types';
import { ConfirmMenuItem, MenuItem } from '@/components';

interface GoalCardProps extends StackProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, ...rest }) => {
  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      bg="gray.600"
      p={2}
      borderRadius="md"
      {...rest}
    >
      <Stack bg="gray.600" py={2} px={4} borderRadius="md">
        <Text>{goal?.name}</Text>
        <Text as="span" fontWeight="bold">
          {goal?.people}
        </Text>
      </Stack>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<BsThreeDotsVertical />}
          variant="@primary"
          size="xs"
        />
        <MenuList color="gray.700" bg="gray.200">
          <MenuItem _hover={{ bg: 'gray.300' }} _focus={{ bg: 'gray.400' }}>
            Réinitialiser
          </MenuItem>
          <ConfirmMenuItem
            _hover={{ bg: 'gray.300' }}
            _focus={{ bg: 'gray.400' }}
            confirmContent="Confirmer la suppression"
          >
            Supprimer
          </ConfirmMenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};
