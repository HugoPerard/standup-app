import { ButtonGroup, IconButton, Box, Flex, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useDarkMode } from '@/hooks/useDarkMode';

import { useYearContext } from './YearContext';

export const Navbar = () => {
  const { colorModeValue } = useDarkMode();
  const { year, setYear } = useYearContext();

  const handlePreviousClick = () => setYear((prevYear) => prevYear - 1);
  const handleNextClick = () => setYear((prevYear) => prevYear + 1);

  return (
    <Flex direction="row" align="baseline" justify="space-between">
      <Text
        fontWeight="bold"
        color={colorModeValue('gray.600', 'gray.200')}
        fontSize="sm"
      >
        {year}
      </Text>
      <Box>
        <ButtonGroup size="sm" variant="@primary">
          <IconButton
            aria-label="Mois précédent"
            icon={<FiChevronLeft />}
            float="right"
            onClick={handlePreviousClick}
          />
          <IconButton
            aria-label="Mois suivant"
            icon={<FiChevronRight />}
            float="right"
            onClick={handleNextClick}
          />
        </ButtonGroup>
      </Box>
    </Flex>
  );
};
