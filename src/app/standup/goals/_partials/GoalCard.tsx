import { CSSProperties, useRef, useState } from 'react';

import {
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Fireworks, FireworksOptions } from 'fireworks-js/dist/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

import {
  ConfirmMenuItem,
  EmptyItem,
  FormModal,
  useToastSuccess,
} from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { GoalForm, GoalFormValues } from '../_partials/GoalForm';
import { useGoalDelete, useGoalUpdate } from '../goals.firebase';
import { Goal } from '../goals.types';

interface GoalCardProps extends StackProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, ...rest }) => {
  const { colorModeValue } = useDarkMode();
  const toastSuccess = useToastSuccess();

  const { mutate: deleteGoal } = useGoalDelete();
  const { mutate: updateGoal, isLoading: isLoadingUpdate } = useGoalUpdate();

  const [isFireworksOn, setIsFireworksOn] = useState(false);

  const timeoutRef = useRef<any>();

  const handleCheckbox = (value) => {
    const isComplete = value?.target?.checked;
    updateGoal(
      { id: goal?.id, payload: { isComplete } },
      {
        onSuccess: async (_, variable) => {
          clearTimeout(timeoutRef.current);
          if (variable?.payload?.isComplete) {
            setIsFireworksOn(true);
            timeoutRef.current = setTimeout(
              () => setIsFireworksOn(false),
              3000
            );
          }
        },
      }
    );
  };

  const handleEdit = (values: GoalFormValues) => {
    updateGoal(
      { id: goal?.id, payload: values },
      {
        onSuccess: async () =>
          toastSuccess({
            title: `L'objectif ${goal.description} a été modifié avec succès en ${values?.description}`,
          }),
      }
    );
  };

  const options: FireworksOptions = {
    speed: 8,
    acceleration: 1.5,
  };

  const style: CSSProperties = {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    position: 'fixed',
  };

  const {
    isOpen: isOpenGoalModal,
    onOpen: onOpenGoalModal,
    onClose: onCloseGoalModal,
  } = useDisclosure();

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        bg={colorModeValue('gray.200', 'gray.600')}
        p={3}
        borderRadius="md"
        opacity={goal?.isComplete && '0.5'}
        {...rest}
      >
        <Checkbox
          alignSelf="start"
          isChecked={goal?.isComplete}
          onChange={handleCheckbox}
          isIndeterminate={isLoadingUpdate}
          isDisabled={isLoadingUpdate}
          pt={1}
          borderColor={colorModeValue('gray.400', undefined)}
        />
        <Stack flex="1" overflow="hidden">
          <ReactMarkdown>{goal?.description}</ReactMarkdown>
          <Text as="span" fontWeight="bold" textAlign="end">
            {goal?.people?.join(' - ')}
          </Text>
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
              <MenuItem icon={<FiEdit2 />} onClick={() => onOpenGoalModal()}>
                Editer
              </MenuItem>
              <ConfirmMenuItem
                confirmContent="Confirmer la suppression"
                icon={<FiTrash2 />}
                onClick={() =>
                  deleteGoal(goal?.id, {
                    onSuccess: async () =>
                      toastSuccess({
                        title: `L'objectif ${goal.description} a été supprimé avec succès`,
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
        isOpen={isOpenGoalModal}
        onClose={onCloseGoalModal}
        onSubmit={handleEdit}
        title="Modifier un objectif"
        submitLabel="Modifier"
        initialValues={goal}
      >
        <GoalForm />
      </FormModal>
      {isFireworksOn && <Fireworks options={options} style={style} />}
    </>
  );
};

export const EmptyGoalCard = (props) => {
  return <EmptyItem {...props} />;
};
