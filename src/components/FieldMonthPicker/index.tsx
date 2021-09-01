import React, { FC, useEffect, useState } from 'react';

import { InputGroup, Input, useTheme } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';
import dayjs from 'dayjs';

import { FormGroup, MonthPicker, FormGroupProps } from '@/components';

export interface FieldMonthPickerProps extends FieldProps, FormGroupProps {
  label?: string;
  helper?: string;
  placeholder?: string;
  isDisabled?: boolean;
  inputProps?: any;
  monthPickerProps?: any;
  monthPickerInputProps?: any;
  arePastMonthsDisabled?: boolean;
  noFormGroup?: boolean;
}

export const FieldMonthPicker: FC<FieldMonthPickerProps> = (props) => {
  const {
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
    errorMessage,
    otherProps,
  } = useField({
    ...props,
    formatValue: (v) => (v instanceof Date ? dayjs(v) : v),
  });

  const { required } = props;

  const {
    label,
    helper,
    placeholder,
    isDisabled,
    monthPickerProps,
    inputProps,
    monthPickerInputProps,
    arePastMonthsDisabled,
    noFormGroup,
    size = 'sm',
    ...rest
  } = otherProps;

  const [isTouched, setIsTouched] = useState(false);
  const [isMonthPickerOpened, setIsMonthPickerOpened] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  const formGroupProps = {
    htmlFor: id,
    label,
    helper,
    errorMessage,
    showError,
    isRequired: !!required,
    isDisabled,
    ...(noFormGroup ? {} : rest),
  };

  const theme = useTheme();

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  const handleChange = (selectedMonth: Date) => {
    setValue(selectedMonth);
    console.log({ selectedMonth });
  };

  const handleBlur = () => {
    setIsMonthPickerOpened(false);
    if (isTouched) return;
    setTimeout(() => {
      // delay to wait overlay's hidding
      setIsTouched(true);
    });
  };

  const triggerMonthPicker = () => {
    setIsMonthPickerOpened(true);
  };

  const currentValue = value?.isValid?.() ? value.toDate() : value ?? null;

  const content = (
    <InputGroup size={size}>
      <Input
        id={id}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onClick={triggerMonthPicker}
        placeholder={placeholder ? String(placeholder) : ''}
        position="relative"
      />
      <MonthPicker
        value={currentValue}
        onMonthClick={handleChange}
        monthPickerProps={monthPickerProps}
        monthPickerInputProps={monthPickerInputProps}
        arePastMonthsDisabled={arePastMonthsDisabled}
        monthPickerStyle={{
          position: 'absolute',
          top: theme.sizes[9],
          padding: theme.sizes[4],
          background: 'white',
          zIndex: '1',
          width: '100%',
          display: isMonthPickerOpened ? 'grid' : 'none',
        }}
        inputProps={{
          id,
          isDisabled,
          ...(inputProps || {}),
        }}
        {...(noFormGroup ? rest : {})}
      />
    </InputGroup>
  );

  if (noFormGroup) {
    return content;
  }

  return <FormGroup {...formGroupProps}>{content}</FormGroup>;
};
