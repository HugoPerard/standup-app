import { Button } from '@chakra-ui/button';

import { useMonthPickerContext } from './MonthPickerContext';
import { useYearContext } from './YearContext';

export const TodayButton = () => {
  const { setYear } = useYearContext();
  const { onTodayButtonClick } = useMonthPickerContext();

  const handleClick = () => {
    const currentYear = new Date().getFullYear();

    setYear(currentYear);
    onTodayButtonClick?.();
  };

  return (
    <Button
      width="full"
      variant="@primary"
      fontWeight="medium"
      onClick={handleClick}
      size="sm"
    >
      Aujourd'hui
    </Button>
  );
};
