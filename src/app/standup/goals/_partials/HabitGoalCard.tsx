import {
  Button,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  StackProps,
  useDisclosure,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit2, FiRepeat, FiTrash2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

import {
  ConfirmMenuItem,
  EmptyItem,
  FormModal,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { HabitGoal } from '../goals.types';
import {
  useHabitGoalDelete,
  useHabitGoalReset,
  useHabitGoalUpdate,
} from '../habitGoals.firebase';
import { CounterDay } from './CounterDay';
import { HabitGoalForm, HabitGoalFormValues } from './HabitGoalForm';

interface HabitGoalCardProps extends StackProps {
  habitGoal: HabitGoal;
}

export const HabitGoalCard: React.FC<HabitGoalCardProps> = ({
  habitGoal,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  // Sur firebase nous avons le timestamp en second / Hors en JS nous l'avons en millisecond.
  // Donc on divise le timestamp JS par 1000 afin qu'il soit comparable
  // On récupére la différence de seconde entre aujourd'hui et le dernier reset (86400 = 60*60*24)
  // On ajoute 1 heure (+3600) afin d'avoir "Notre récompense" dès le lendemain
  // (Sinon on pourrait être à 0 jours en début de standup et à +1 en fin de standup)
  const numberOfDay = Math.floor(
    (Date.now() / 1000 - +habitGoal.dateLastReset + 3600) / 86400
  );

  const { mutate: deleteHabitGoal } = useHabitGoalDelete();
  const {
    mutate: resetHabitGoal,
    isLoading: isLoadingReset,
  } = useHabitGoalReset();
  const { mutate: updateHabitGoal } = useHabitGoalUpdate();

  const handleEdit = (values: HabitGoalFormValues) => {
    updateHabitGoal(
      { id: habitGoal?.id, payload: values },
      {
        onSuccess: async () =>
          toastSuccess({
            title: `L'objectif ${habitGoal.description} a été modifié avec succès en ${values?.description}`,
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
        direction="row"
        spacing={3}
        bg={colorModeValue('gray.200', 'gray.600')}
        p={3}
        borderRadius="md"
        {...rest}
      >
        <Stack flex="1" overflow="hidden">
          <ReactMarkdown>{habitGoal?.description}</ReactMarkdown>
          <Center>
            <CounterDay
              numberOfDay={numberOfDay}
              colorScheme={numberOfDay === 0 ? 'red' : 'gray'}
            />
          </Center>
          <Center>
            <Button
              variant="@danger"
              leftIcon={<FiRepeat />}
              disabled={isLoadingReset}
              isLoading={isLoadingReset}
              onClick={() =>
                resetHabitGoal(habitGoal?.id, {
                  onSuccess: async () =>
                    toastSuccess({
                      title: `L'objectif ${habitGoal.description} a été reset 😭`,
                    }),
                })
              }
            >
              Reset
            </Button>
          </Center>
        </Stack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<BsThreeDotsVertical />}
            variant="@primary"
            size="xs"
          />
          <Portal>
            <MenuList>
              <MenuItem
                icon={<FiEdit2 />}
                onClick={() => onOpenHabitGoalModal()}
              >
                Editer
              </MenuItem>
              <ConfirmMenuItem
                confirmContent="Confirmer la suppression"
                icon={<FiTrash2 />}
                onClick={() =>
                  deleteHabitGoal(habitGoal?.id, {
                    onSuccess: async () =>
                      toastSuccess({
                        title: `L'objectif ${habitGoal.description} a été supprimé avec succès`,
                      }),
                  })
                }
              >
                Supprimer
              </ConfirmMenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Stack>
      <FormModal
        isOpen={isOpenHabitGoalModal}
        onClose={onCloseHabitGoalModal}
        onSubmit={handleEdit}
        title="Modifier un objectif"
        submitLabel="Modifier"
        initialValues={habitGoal}
      >
        <HabitGoalForm />
      </FormModal>
    </>
  );
};

export const EmptyHabitGoalCard = (props) => {
  return <EmptyItem {...props} />;
};
