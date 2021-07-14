import React from 'react';

import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverContentProps,
  PopoverFooter,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { GoalForm } from '@/app/goals/GoalForm';
import { Goal } from '@/app/goals/goal.types';

interface GoalPopoverProps extends Omit<PopoverContentProps, 'onSubmit'> {
  goal?: Goal;
  onSubmit(values: { description: string; people: string[] }): void;
}

export const GoalPopover: React.FC<GoalPopoverProps> = ({
  children,
  goal,
  onSubmit = () => {},
  ...rest
}) => {
  const internalForm = useForm({ subscribe: 'fields' });

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
    });
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialFocusRef = React.useRef();

  return (
    <Popover
      colorScheme="gray"
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      placement="left-start"
    >
      <PopoverTrigger>
        <Box onClick={() => onOpen()}>{children}</Box>
      </PopoverTrigger>
      <Formiz connect={internalForm} autoForm onValidSubmit={handleSubmit}>
        <PopoverContent
          color="gray.100"
          bg="gray.600"
          borderColor="gray.700"
          {...rest}
        >
          <PopoverArrow bg="gray.600" />
          <PopoverCloseButton zIndex="10" />
          {isOpen && (
            <>
              <PopoverBody>
                <GoalForm ref={initialFocusRef} />
              </PopoverBody>
              <PopoverFooter
                borderColor="transparent"
                d="flex"
                justifyContent="flex-end"
              >
                <Button type="submit" variant="@primary" size="sm">
                  {goal ? 'Editer un objectif' : 'Créer un objectif'}
                </Button>
              </PopoverFooter>
            </>
          )}
        </PopoverContent>
      </Formiz>
    </Popover>
  );
};
