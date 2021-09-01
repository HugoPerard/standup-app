import { Content } from './Content';
import { MonthPickerProvider } from './MonthPickerContext';
import { YearProvider } from './YearContext';

interface MonthPickerProps {
  year?: number;
  onMonthClick?(month: Date): void;
  onTodayButtonClick?(): void;
  onYearChange?(year: number): void;
  selectedMonths?: Date[];
  monthPickerStyle?: Object;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  year = new Date().getFullYear(),
  onMonthClick,
  onTodayButtonClick,
  onYearChange,
  selectedMonths = [],
  monthPickerStyle = {},
}) => {
  return (
    <YearProvider year={year} onYearChange={onYearChange}>
      <MonthPickerProvider
        onMonthClick={onMonthClick}
        onTodayButtonClick={onTodayButtonClick}
        selectedMonths={selectedMonths}
        monthPickerStyle={monthPickerStyle}
      >
        <Content />
      </MonthPickerProvider>
    </YearProvider>
  );
};
