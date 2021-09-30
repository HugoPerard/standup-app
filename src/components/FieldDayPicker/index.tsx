import React, { FC, useEffect, useState } from 'react';

import { FieldProps, useField } from '@formiz/core';
import dayjs from 'dayjs';

import { FormGroup, DayPicker, FormGroupProps } from '@/components';

export interface FieldDayPickerProps extends FieldProps, FormGroupProps {
  label?: string;
  helper?: string;
  placeholder?: string;
  isDisabled?: boolean;
  inputProps?: any;
  dayPickerProps?: any;
  dayPickerInputProps?: any;
  arePastDaysDisabled?: boolean;
  noFormGroup?: boolean;
}

export const FieldDayPicker: FC<FieldDayPickerProps> = (props) => {
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
    dayPickerProps,
    inputProps,
    dayPickerInputProps,
    arePastDaysDisabled,
    noFormGroup,
    ...rest
  } = otherProps;

  const [isTouched, setIsTouched] = useState(false);
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

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  const handleChange = (selectedDay: Date) => {
    setValue(selectedDay);
  };

  const handleBlur = () => {
    if (isTouched) return;
    setTimeout(() => {
      // delay to wait overlay's hidding
      setIsTouched(true);
    });
  };

  const currentValue = value?.isValid?.() ? value.toDate() : value ?? null;

  const content = (
    <DayPicker
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      onBlur={handleBlur}
      dayPickerProps={dayPickerProps}
      dayPickerInputProps={dayPickerInputProps}
      arePastDaysDisabled={arePastDaysDisabled}
      inputProps={{
        id,
        isDisabled,
        ...(inputProps || {}),
      }}
      {...(noFormGroup ? rest : {})}
    />
  );

  if (noFormGroup) {
    return content;
  }

  return <FormGroup {...formGroupProps}>{content}</FormGroup>;
};
