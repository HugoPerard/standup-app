import React, { ReactNode } from 'react';

import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: ReactNode;
  confirmVariant?: string;
  cancelText?: ReactNode;
  onConfirm(): void;
  onCancel?(): void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  message,
  title,
  confirmText = 'Confirmer',
  confirmVariant = '@primary',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  ...rest
}) => {
  const displayHeading = !title && !message ? 'Etes-vous sûr ?' : title;
  const initialFocusRef = React.useRef();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialFocusRef}
        {...rest}
      >
        <ModalOverlay />
        <ModalContent>
          {displayHeading && <ModalHeader>{displayHeading}</ModalHeader>}

          <ModalCloseButton />
          <ModalBody mt={displayHeading ? 0 : 3}>{message}</ModalBody>
          <ModalFooter>
            <ButtonGroup justifyContent="space-between" flex="1">
              <Button
                variant="@secondary"
                onClick={onCancel ? onCancel : onClose}
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                ref={initialFocusRef}
              >
                {confirmText}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
