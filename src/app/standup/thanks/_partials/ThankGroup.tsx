import {
  Center,
  HStack,
  IconButton,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { useAuth } from '@/app/auth/useAuth';
import { Loader } from '@/app/layout';
import {
  useThankAdd,
  useThankDelete,
} from '@/app/standup/thanks/thanks.firebase';
import { Thank } from '@/app/standup/thanks/thanks.types';
import { useToastSuccess } from '@/components';

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
  const toastSuccess = useToastSuccess();

  const { currentUser } = useAuth();
  const username = currentUser.displayName;

  const { mutate: addThank, isLoading: isLoadingAddThank } = useThankAdd();
  const {
    mutate: deleteThank,
    isLoading: isLoadingDeleteThank,
  } = useThankDelete();

  const handleAddThank = () => {
    if (username)
      addThank(
        { author: username, type },
        {
          onSuccess: () => {
            toastSuccess({
              title: `${
                type === 'THANK'
                  ? 'Remerciement ajouté'
                  : 'Chose à ajouter ajoutée'
              } avec succès`,
            });
          },
        }
      );
  };

  return (
    <Stack bg="gray.700" p={3} borderRadius="md" {...rest}>
      <Stack direction="row" spacing={3} mb="1">
        <Text fontWeight="bold">{name}</Text>
        <IconButton
          aria-label="Ajouter un objectif"
          icon={<FiPlus />}
          variant="@primary"
          size="xs"
          isLoading={!username || isLoadingAddThank}
          onClick={() => {
            handleAddThank();
          }}
        />
      </Stack>
      <Stack>
        {thanks?.length > 0 &&
          thanks?.map((thank) => (
            <HStack key={thank?.id}>
              <IconButton
                aria-label="Supprimer l'objectif"
                icon={<FiTrash2 />}
                variant="@primary"
                size="xs"
                onClick={() => {
                  deleteThank(thank?.id);
                }}
                isLoading={isLoadingDeleteThank}
              />
              <Text key={thank?.id}>{thank?.author}</Text>
            </HStack>
          ))}

        {!isLoadingAddThank && thanks?.length === 0 && (
          <Center
            bg="gray.600"
            py={2}
            px={4}
            borderRadius="md"
            fontSize="xs"
            fontWeight="medium"
          >
            <Text>
              {type === 'THANK'
                ? 'Aucun remerciement'
                : 'Aucune chose à ajouter'}
            </Text>
          </Center>
        )}

        {isLoadingAddThank && <Loader />}
      </Stack>
    </Stack>
  );
};
