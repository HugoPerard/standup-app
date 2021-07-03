import React, { useEffect, useState } from 'react';

import { useField } from '@formiz/core';

import { FieldSelectProps } from '@/components/FieldSelect';
import { FormGroup } from '@/components/FormGroup';
import { Select } from '@/components/Select';

interface FieldMultiSelectProps extends FieldSelectProps {
  isNotClearable?: boolean;
}

export const FieldMultiSelect = (props: FieldMultiSelectProps) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
    otherProps,
  } = useField(props);
  const { required } = props;
  const {
    children,
    label,
    options = [],
    placeholder,
    helper,
    noOptionsMessage,
    isDisabled,
    isNotClearable,
    size = 'sm',
    selectOptions = {},
    ...rest
  } = otherProps;
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired: !!required,
    label,
    showError,
    ...rest,
  };

  const handleChange = (values) => {
    if (!values || !values.length) {
      setValue(null);
      return;
    }
    setValue(values?.map((value) => value.value));
  };

  return (
    <FormGroup {...formGroupProps}>
      <Select
        id={id}
        value={options?.filter((option) => value?.includes(option.value)) || []}
        onBlur={() => setIsTouched(true)}
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        isDisabled={isDisabled}
        isClearable={!isNotClearable}
        noOptionsMessage={noOptionsMessage || 'Aucune option'}
        isError={showError}
        size={size}
        isMulti
        {...selectOptions}
      />
      {children}
    </FormGroup>
  );
};
