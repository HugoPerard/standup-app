import { Center, Text } from '@chakra-ui/react';

import { useDarkMode } from '@/hooks/useDarkMode';

export const EmptyItem = ({ children, ...props }) => {
  const { colorModeValue } = useDarkMode();
  return (
    <Center
      bg={colorModeValue('gray.200', 'gray.600')}
      py={2}
      px={4}
      borderRadius="md"
      {...props}
    >
      <Text>{children}</Text>
    </Center>
  );
};
