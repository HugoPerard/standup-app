import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@/config';
import theme from '@/theme';

const queryClient = new QueryClient();

export const Providers = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
