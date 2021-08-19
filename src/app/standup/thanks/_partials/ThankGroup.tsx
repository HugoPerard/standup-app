import {
  Badge,
  Center,
  IconButton,
  Stack,
  StackProps,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { useAuth } from '@/app/auth/useAuth';
import { Loader } from '@/app/layout';
import { NEW_BADGE_DURATION } from '@/app/standup/thanks/constants';
import {
  useThankAdd,
  useThankDelete,
} from '@/app/standup/thanks/thanks.firebase';
import { Thank } from '@/app/standup/thanks/thanks.types';
import { useToastSuccess } from '@/components';
import { PersonTag } from '@/components/PersonTag';

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
      <Stack direction="row" spacing={3} mb={2}>
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
      {thanks?.length > 0 && (
        <Wrap>
          {thanks?.map((thank) => (
            <PersonTag
              key={thank?.id}
              onRemove={() => deleteThank(thank?.id)}
              isLoadingRemove={isLoadingDeleteThank}
            >
              <Stack direction="row">
                <Text>{thank?.author}</Text>
                {Date.now() / 1000 - thank?.timestamp < NEW_BADGE_DURATION && (
                  <Badge bg="gray.700" color="white">
                    NEW
                  </Badge>
                )}
              </Stack>
            </PersonTag>
          ))}
        </Wrap>
      )}

      {!isLoadingAddThank && thanks?.length === 0 && (
        <Center
          bg="gray.600"
          p={2}
          borderRadius="md"
          fontSize="xs"
          fontWeight="medium"
        >
          <Text>
            {type === 'THANK' ? 'Aucun remerciement' : 'Aucune chose à ajouter'}
          </Text>
        </Center>
      )}

      {isLoadingAddThank && <Loader />}
    </Stack>
  );
};
