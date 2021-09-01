import { createContext, useContext } from 'react';

type MonthPickerContextType = {
  onMonthClick?(month: Date): void;
  onTodayButtonClick?(): void;
  selectedMonths?: Date[];
  monthPickerStyle?: Object;
};

const MonthPickerContext = createContext<MonthPickerContextType>({});
export const useMonthPickerContext = () => useContext(MonthPickerContext);

export const MonthPickerProvider: React.FC<MonthPickerContextType> = ({
  onMonthClick,
  onTodayButtonClick,
  selectedMonths,
  monthPickerStyle,
  children,
}) => {
  return (
    <MonthPickerContext.Provider
      value={{
        onMonthClick,
        onTodayButtonClick,
        selectedMonths,
        monthPickerStyle,
      }}
    >
      {children}
    </MonthPickerContext.Provider>
  );
};
