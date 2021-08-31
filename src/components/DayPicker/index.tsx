import { useState } from 'react';

import {
  chakra,
  Box,
  Input,
  InputGroup,
  InputProps,
  useBreakpointValue,
  forwardRef,
  Icon,
  BoxProps,
  InputRightElement,
  useToken,
} from '@chakra-ui/react';
import dayjs, { ConfigType, Dayjs } from 'dayjs';
import { CaptionElementProps, DateUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { FiCalendar } from 'react-icons/fi';
import { usePopper } from 'react-popper';

import { MonthPicker } from '@/components/MonthPicker';
import { useDarkMode } from '@/hooks/useDarkMode';
import { getDayPickerTranslationsOptions } from '@/utils/dayPickerLocaleUtils';
import { parseInputToDate } from '@/utils/parseInputToDate';

import { Navbar } from './Navbar';

type ModeType = 'DAY' | 'MONTH';

const FORMAT = 'DD/MM/YYYY';

interface ReactDayPickerInputProps extends InputProps {}

const ReactDayPickerInput = forwardRef<ReactDayPickerInputProps, 'input'>(
  ({ isDisabled, value, ...rest }, ref) => (
    <InputGroup>
      <Input ref={ref} size="sm" value={value ?? ''} {...rest} />
      <InputRightElement pointerEvents="none">
        <Icon
          as={FiCalendar}
          fontSize="lg"
          mt={-2}
          color={isDisabled ? 'gray.300' : 'gray.400'}
        />
      </InputRightElement>
    </InputGroup>
  )
);

// DISCLAIMER: This code is written using v7 of react-day-picker. Here are some
// code comments containing permalinks to the v7 documentation as the website
// will move in a near future.

// On v7, react-day-picker doesn't provide typings. Following typings are based
// on the proptypes in the source code.
// https://github.com/gpbl/react-day-picker/blob/v7/src/DayPickerInput.js#L32
interface CustomDayPickerOverlayProps {
  input?: any;
  classNames?: any;
  month?: Date;
  selectedDay?: Date;
  mode?: ModeType;
  onToggleMode?(): void;
  onMonthSelect?(date: Date): void;
}

// The CustomOverlay to control the way the day picker is displayed
// https://github.com/gpbl/react-day-picker/blob/v7/docs/src/code-samples/examples/input-custom-overlay.js
// Check the following permalink for v7 props documentation
// https://github.com/gpbl/react-day-picker/blob/750f6cd808b2ac29772c8df5c497a66e818080e8/docs/src/pages/api/DayPickerInput.js#L163
const CustomDayPickerOverlay = forwardRef<CustomDayPickerOverlayProps, 'div'>(
  (
    {
      children,
      input,
      classNames,
      mode,
      month,
      onToggleMode,
      onMonthSelect,
      ...props
    },
    ref
  ) => {
    // Remove the props that should not be spread to the HTML element.
    const { selectedDay, ...rest } = props;
    const { colorModeValue } = useDarkMode();

    const [popperElement, setPopperElement] = useState(null);

    const { styles, attributes } = usePopper(input, popperElement, {
      placement: 'bottom-start',
    });

    const handleOnMonthClick = (date: Date) => {
      onMonthSelect(date);
      onToggleMode();
    };

    return (
      <chakra.div className={classNames.overlayWrapper} {...rest} ref={ref}>
        <chakra.div
          ref={setPopperElement}
          className={classNames.overlay}
          style={styles.popper}
          {...attributes.popper}
        >
          {mode === 'DAY' ? (
            children
          ) : (
            <Box p={4} w="20rem">
              <MonthPicker
                year={month.getFullYear()}
                onMonthClick={handleOnMonthClick}
              />
            </Box>
          )}
        </chakra.div>
      </chakra.div>
    );
  }
);

interface CustomCaptionElementProps extends CaptionElementProps {
  onCaptionClick?(): void;
}

const CustomCaptionElement: React.FC<CustomCaptionElementProps> = ({
  months,
  date,
  onCaptionClick,
}) => {
  return (
    <Box
      fontWeight="bold"
      cursor="pointer"
      mt="0.5rem"
      ml="0.5rem"
      onClick={() => onCaptionClick()}
      role="button"
    >
      {months[date.getMonth()]} {date.getFullYear()}
    </Box>
  );
};

interface DayPickerProps extends BoxProps {
  placeholder?: string;
  value?: string | Date;
  onChange?: any;
  inputProps?: any;
  dayPickerProps?: any;
  dayPickerInputProps?: any;
  arePastDaysDisabled?: boolean;
  onBlur?(): void;
  onMonthSelect?(date: Date): void;
}

export const DayPicker: React.FC<DayPickerProps> = ({
  placeholder = 'JJ/MM/AAAA',
  value = null,
  onChange = () => {},
  inputProps = {},
  dayPickerProps = {},
  dayPickerInputProps = {},
  arePastDaysDisabled = false,
  onBlur = () => {},
  onMonthSelect = () => {},
  ...rest
}) => {
  const [mode, setMode] = useState<ModeType>('DAY');
  const [month, setMonth] = useState<Date>(new Date());
  const isSmartphoneFormat = useBreakpointValue({ base: true, sm: false });

  const [userInput, setUserInput] = useState('');

  const formatDate = (date: ConfigType, format: string) =>
    dayjs(date).format(format);

  const parseDate = (str: Dayjs, format: string): Date => {
    const parsed = dayjs(str, format).set('hour', 12).toDate();
    return DateUtils.isDate(parsed) ? parsed : null;
  };

  const gray300 = useToken('colors', 'gray.300');

  const {
    disabledDays,
    modifiers: modifiersProps,
    ...dayPickerPropsRest
  } = dayPickerProps;

  const { onDayPickerHide, ...dayPickerInputPropsRest } = dayPickerInputProps;

  const modifiers = {
    weekend: { daysOfWeek: [0, 6] },
    disabled: arePastDaysDisabled
      ? [{ before: new Date() }, ...(disabledDays || [])]
      : disabledDays,
    ...modifiersProps,
  };

  const modifiersStyles = {
    disabled: { color: gray300 },
  };

  const handleToggleMode = () => {
    setMode((prevMode) => (prevMode === 'DAY' ? 'MONTH' : 'DAY'));
  };

  const handleMonthPick = (date: Date) => {
    setMonth(date);
    onMonthSelect(date);
  };

  const handleOnDayChange = (
    day: Date,
    _modifiers: Object,
    dayPickerInput: DayPickerInput
  ) => {
    onChange?.(day);
    const input = dayPickerInput.getInput();
    setUserInput(input.value);
  };

  const handleOnDayPickerHide = () => {
    onBlur?.();

    const parsedDate = parseInputToDate(userInput);
    if (parsedDate.isValid()) {
      onChange(parsedDate.toDate());
    }

    onDayPickerHide?.(parsedDate);
  };

  return (
    <Box {...rest}>
      <DayPickerInput
        component={ReactDayPickerInput}
        onDayChange={handleOnDayChange}
        onDayPickerHide={handleOnDayPickerHide}
        formatDate={formatDate}
        format={FORMAT}
        parseDate={parseDate}
        placeholder={placeholder}
        value={value}
        dayPickerProps={{
          firstDayOfWeek: 1,
          modifiers,
          modifiersStyles,
          navbarElement: (navProps) => <Navbar {...navProps} />,
          ...getDayPickerTranslationsOptions(),
          ...dayPickerPropsRest,
          captionElement: (props) => (
            <CustomCaptionElement
              {...props}
              onCaptionClick={handleToggleMode}
            />
          ),
          month,
          todayButton: 'Aujourd’hui',
          // using null to tell the lib to do nothing and just put the view to
          // the today month, if we do not override this, the onTodayButtonClick
          // is to select the today date and will close the DayPicker
          onTodayButtonClick: null,
        }}
        inputProps={{
          readOnly: isSmartphoneFormat,
          autoComplete: 'off',
          ...inputProps,
        }}
        {...dayPickerInputPropsRest}
        // Typing props as any, the library doesn't give types in v7
        overlayComponent={(props: any) => (
          <CustomDayPickerOverlay
            {...props}
            mode={mode}
            onToggleMode={handleToggleMode}
            onMonthSelect={handleMonthPick}
          />
        )}
      />
    </Box>
  );
};
