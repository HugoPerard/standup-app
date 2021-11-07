import { forwardRef } from 'react';

import { Stack, StackProps } from '@chakra-ui/react';

import { FieldInput } from '@/components';

import { Office } from '../offices.types';

export interface OfficeFormValues extends Pick<Office, 'name'> {}

interface OfficeFormProps extends StackProps {}

export const OfficeForm = forwardRef<HTMLDivElement, OfficeFormProps>(
  (props, ref) => {
    return (
      <Stack ref={ref} {...props}>
        <FieldInput
          name="name"
          label="Nom"
          required="Le nom est requis"
          inputProps={{ autoFocus: true }}
        />
      </Stack>
    );
  }
);
