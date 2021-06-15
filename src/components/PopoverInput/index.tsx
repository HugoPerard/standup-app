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
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { FieldInput } from '../FieldInput';

interface PopoverInputProps extends Omit<PopoverContentProps, 'onSubmit'> {
  onSubmit(value: string): void;
  title: string;
  submitLabel: string;
  placeholder: string;
}

export const PopoverInput: React.FC<PopoverInputProps> = ({
  children,
  onSubmit = () => {},
  title = '',
  submitLabel = 'Valider',
  placeholder = 'Saisir...',
  ...rest
}) => {
  const internalForm = useForm({ subscribe: { fields: ['input'] } });

  const handleSubmit = () => {
    onSubmit(internalForm?.values?.input);
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover colorScheme="gray" isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box onClick={() => onOpen()}>{children}</Box>
      </PopoverTrigger>
      <Formiz
        connect={internalForm}
        autoForm
        onValidSubmit={() => handleSubmit()}
      >
        <PopoverContent
          color="gray.100"
          bg="gray.600"
          borderColor="gray.700"
          {...rest}
        >
          <PopoverArrow bg="gray.600" />
          <PopoverCloseButton />
          {isOpen && (
            <>
              <PopoverHeader borderColor="transparent">{title}</PopoverHeader>
              <PopoverBody>
                <FieldInput
                  name="input"
                  placeholder={placeholder}
                  color="gray.800"
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
