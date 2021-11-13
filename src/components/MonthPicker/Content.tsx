import { Button, Grid, GridItem, HTMLChakraProps } from '@chakra-ui/react';

import { useMonthPickerContext } from './MonthPickerContext';
import { Navbar } from './Navbar';
import { TodayButton } from './TodayButton';
import { useYearContext } from './YearContext';
import months from './months';

interface ContentProps {}

export const Content: React.FC<ContentProps> = () => {
  const { year } = useYearContext();
  const { onMonthClick, selectedMonths } = useMonthPickerContext();

  const handleClick = (month: number) => {
    onMonthClick?.(new Date(year, month));
  };

  const isSelected = (date: Date): boolean =>
    selectedMonths.some(
      (month) =>
        month.getFullYear() === date.getFullYear() &&
        month.getMonth() === date.getMonth()
    );

  const isToday = (date: Date): boolean => {
    const today = new Date();

    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth()
    );
  };

  const selectedStyle: HTMLChakraProps<'button'> = {
    color: 'white',
    bg: 'brand.600',
    _hover: {
      bg: 'brand.700',
    },
    _active: {
      bg: 'brand.800',
    },
    _focus: {
      boxShadow: 'outline-brand',
    },
  };

  const todayStyle: HTMLChakraProps<'button'> = {
    textDecoration: 'underline',
    fontWeight: 'bold',
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3}>
      <GridItem colSpan={3}>
        <Navbar />
      </GridItem>

      {months.map((month, index) => {
        const monthAsDate = new Date(year, index);
        return (
          <Button
            textTransform="capitalize"
            key={month}
            fontSize="sm"
            fontWeight="500"
            onClick={() => handleClick(index)}
            size="sm"
            colorScheme="gray"
            variant="solid"
            {...(isSelected(monthAsDate) ? selectedStyle : {})}
            {...(isToday(monthAsDate) ? todayStyle : {})}
          >
            {month}
          </Button>
        );
      })}
      <GridItem colSpan={3}>
        <TodayButton />
      </GridItem>
    </Grid>
  );
};
