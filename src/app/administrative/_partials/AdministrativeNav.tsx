import React from 'react';

import { Flex } from '@chakra-ui/react';

import { InternalBar, InternalBarItem } from '@/app/layout';
import { Routes } from '@/app/routes';

export const AdministrativeNav = ({ ...rest }) => {
  return (
    <InternalBar {...rest}>
      <Flex>
        <InternalBarItem to={Routes.ADMINISTRATIVE_LEAVE}>
          Congés
        </InternalBarItem>
        <InternalBarItem to={Routes.EXPENSES_REPORT}>
          Notes de Frais
        </InternalBarItem>
      </Flex>
    </InternalBar>
  );
};
