import React from 'react';

import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverContentProps,
  PopoverFooter,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { FieldInput } from '../FieldInput';

interface PopoverInputProps extends Omit<PopoverContentProps, 'onSubmit'> {
  onSubmit(value: string): void;
  label: string;
  submitLabel?: string;
  placeholder?: string;
}

export const PopoverInput: React.FC<PopoverInputProps> = ({
  children,
  onSubmit = () => {},
  label,
  submitLabel = 'Valider',
  placeholder = 'Saisir...',
  ...rest
}) => {
  const internalForm = useForm();

  const handleSubmit = (values) => {
    onSubmit(values?.input);
  };

  const initialFocusRef = React.useRef();

  return (
    <Popover colorScheme="gray" initialFocusRef={initialFocusRef}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <Portal>
        <Formiz connect={internalForm} autoForm onValidSubmit={handleSubmit}>
          <PopoverContent
            color="gray.100"
            bg="gray.600"
            borderColor="gray.700"
            {...rest}
          >
            <PopoverArrow bg="gray.600" />
            <PopoverCloseButton zIndex="10" />
            <>
              <PopoverBody>
                <FieldInput
                  ref={initialFocusRef}
                  name="input"
                  label={label}
                  placeholder={placeholder}
                />
              </PopoverBody>
              <PopoverFooter
                borderColor="transparent"
                d="flex"
                justifyContent="flex-end"
              >
                <Button
                  type="submit"
                  variant="@primary"
                  size="sm"
                  onClick={(e) => e.currentTarget?.blur()}
                >
                  {submitLabel}
                </Button>
              </PopoverFooter>
            </>
          </PopoverContent>
        </Formiz>
      </Portal>
    </Popover>
  );
};
