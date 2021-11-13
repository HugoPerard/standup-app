import { useRef } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { Formiz } from '@formiz/core';

interface FormModalProps<T = any> extends ModalProps {
  onSubmit?(values: T): void;
  initialValues?: T;
  title?: string;
  submitLabel?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit = () => {},
  initialValues = {},
  title,
  submitLabel = 'Valider',
  children,
}) => {
  const initialRef = useRef();

  const handleSubmit = (values) => {
    onSubmit(values);
    onClose();
  };

  return isOpen ? (
    <Modal isOpen={true} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <Formiz
        autoForm
        onValidSubmit={handleSubmit}
        initialValues={initialValues}
      >
        <ModalContent pt={title ? undefined : 2}>
          {title && <ModalHeader>{title}</ModalHeader>}
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter justifyContent="space-between" pt={6}>
            <Button variant="@secondary" size="md" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="@primary" size="md" type="submit">
              {submitLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Formiz>
    </Modal>
  ) : (
    <></>
  );
};
