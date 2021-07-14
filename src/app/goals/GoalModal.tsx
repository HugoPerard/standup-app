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

import { useCurrentUser } from '@/app/auth/useAuth';

import { GoalForm, GoalFormValues } from './GoalForm';

interface GoalModalProps extends Omit<ModalProps, 'children' | 'isOpen'> {
  onSubmit?(values: GoalFormValues): void;
  initialsValues?: GoalFormValues;
  title?: string;
  confirmText?: string;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  onClose,
  onSubmit = () => {},
  initialsValues,
  title = 'Objectif',
  confirmText = 'Valider',
}) => {
  const initialRef = useRef();

  const handleSubmit = (values) => {
    onSubmit(values);
    onClose();
  };

  const currentUser = useCurrentUser();
  return (
    <Modal isOpen={true} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <Formiz
        autoForm
        onValidSubmit={handleSubmit}
        initialValues={{
          ...initialsValues,
          people: initialsValues?.people || [currentUser.username],
        }}
      >
        <ModalContent color="gray.100" bg="gray.600">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GoalForm ref={initialRef} />
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button color="gray.600" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="@primary" type="submit">
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Formiz>
    </Modal>
  );
};
