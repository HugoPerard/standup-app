import { HStack, IconButton, Stack, StackProps, Text } from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { useAuth } from '@/app/auth/useAuth';
import { useThankAdd, useThankDelete } from '@/app/thanks/thanks.firebase';
import { Thank } from '@/app/thanks/thanks.types';

interface ThankGroupProps extends StackProps {
  name: string;
  thanks: Thank[];
  type: 'THANK' | 'TO_ADD';
}

export const ThankGroup: React.FC<ThankGroupProps> = ({
  name,
  thanks,
  type,
  ...rest
}) => {
  const { currentUser } = useAuth();
  const username = currentUser.displayName;

  const { mutate: addThank } = useThankAdd();
  const { mutate: deleteThank } = useThankDelete();

  return (
    <Stack bg="gray.700" p={3} borderRadius="md" {...rest}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb="1"
      >
        <Text fontWeight="bold" mb={1} flex="1">
          {name}
        </Text>
        <IconButton
          aria-label="Ajouter un objectif"
          icon={<FiPlus />}
          variant="@primary"
          size="sm"
          isDisabled={!username}
          onClick={() => {
            if (username) addThank({ author: username, type });
          }}
        />
      </Stack>
      <Stack>
        {thanks?.map((thank) => (
          <HStack key={thank?.id}>
            <IconButton
              aria-label="Supprimer l'objectif"
              icon={<FiTrash2 />}
              variant="@primary"
              size="sm"
              onClick={() => {
                deleteThank(thank?.id);
              }}
            />
            <Text key={thank?.id}>{thank?.author}</Text>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
};
