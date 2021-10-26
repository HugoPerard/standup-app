import React, { useEffect, useState } from 'react';

import {
  Input,
  InputGroup,
  InputProps,
  InputLeftElement,
  InputRightElement,
  Spinner,
  IconButton,
  forwardRef,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';

export interface FieldInputProps
  extends FieldProps,
    Omit<FormGroupProps, 'placeholder'>,
    Pick<InputProps, 'type' | 'placeholder'> {
  size?: 'sm' | 'md' | 'lg';
  inputProps?: Omit<InputProps, 'type' | 'placeholder'>;
}

export const FieldInput = forwardRef((props: FieldInputProps, ref) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    isValidating,
    resetKey,
    setValue,
    value,
    otherProps,
  } = useField(props);
  const {
    children,
    label,
    type,
    placeholder,
    helper,
    size = 'md',
    inputProps = {},
    ...rest
  } = otherProps;
  const { required } = props;
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <FormGroup {...formGroupProps}>
      <InputGroup size={size}>
        <Input
          ref={ref}
          type={showPassword ? 'text' : type || 'text'}
          id={id}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setIsTouched(true)}
          placeholder={placeholder ? String(placeholder) : ''}
          {...inputProps}
        />

        {type === 'password' && (
          <InputLeftElement>
            <IconButton
              onClick={() => setShowPassword((x) => !x)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              display="flex"
              size="xs"
              fontSize="lg"
              icon={showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
              variant="unstyled"
            />
          </InputLeftElement>
        )}

        {(isTouched || isSubmitted) && isValidating && (
          <InputRightElement>
            <Spinner size="sm" flex="none" />
          </InputRightElement>
        )}
      </InputGroup>
      {children}
    </FormGroup>
  );
});
