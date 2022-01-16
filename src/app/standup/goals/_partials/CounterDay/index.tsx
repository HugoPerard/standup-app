import React from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { useDarkMode } from '@/hooks/useDarkMode';

interface CounterDayProps {
  numberOfDay: number | string;
  colorScheme?: string;
}

export const CounterDay = ({ numberOfDay, colorScheme }: CounterDayProps) => {
  const { colorModeValue } = useDarkMode();

  if (colorScheme === undefined || colorScheme === null) {
    colorScheme = 'gray';
  }

  let numberOfDayStringify: string = (numberOfDay + '').padStart(3, '0');

  return (
    <Flex direction="row">
      {numberOfDayStringify.split('').map((number) => (
        <Box
          bgGradient={colorModeValue(
            `linear(${colorScheme}.200 0%, ${colorScheme}.400 45%, ${colorScheme}.200 80%)`,
            `linear(${colorScheme}.400 0%, ${colorScheme}.500 30%, ${colorScheme}.400 80%)`
          )}
          color={colorModeValue('black', 'white')}
          p="1em"
          shadow="md"
          fontWeight={600}
          border="solid 1px"
          borderColor={colorModeValue('gray.300', 'gray.600')}
        >
          {number ?? 0}
        </Box>
      ))}
    </Flex>
  );
};
