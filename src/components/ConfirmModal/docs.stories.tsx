import React from 'react';

import { Button, useDisclosure } from '@chakra-ui/react';

import { ConfirmModal } from '.';

export default {
  title: 'Components/ConfirmModal',
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => alert('Custom Action')}
      />
    </>
  );
};

export const WithCustomParameters = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        message="Custom message"
        title="Custom Title"
        confirmText="Custom Text"
        onConfirm={() => alert('Custom Action')}
        confirmVariant="@danger"
      />
    </>
  );
};
