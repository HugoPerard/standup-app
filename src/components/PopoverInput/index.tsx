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

import { FieldInput } from '../FieldInput';

interface PopoverInputProps extends Omit<PopoverContentProps, 'onSubmit'> {
  onSubmit(value: string): void;
  label: string;
  submitLabel: string;
  placeholder: string;
}

export const PopoverInput: React.FC<PopoverInputProps> = ({
  children,
  onSubmit = () => {},
  label,
  submitLabel = 'Valider',
  placeholder = 'Saisir...',
  ...rest
}) => {
  const internalForm = useForm({ subscribe: { fields: ['input'] } });

  const handleSubmit = (values) => {
    onSubmit(values?.input);
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
                <FieldInput
                  name="input"
                  label={label}
                  placeholder={placeholder}
                  ref={initialFocusRef}
                />
              </PopoverBody>
              <PopoverFooter
                borderColor="transparent"
                d="flex"
                justifyContent="flex-end"
              >
                <Button type="submit" variant="@primary" size="sm">
                  {submitLabel}
                </Button>
              </PopoverFooter>
            </>
          )}
        </PopoverContent>
      </Formiz>
    </Popover>
  );
};
