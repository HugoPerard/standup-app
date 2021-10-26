import { forwardRef } from 'react';

import { Stack, StackProps } from '@chakra-ui/react';

import { FieldInput } from '@/components';

export interface ProjectFormValues {
  name: string;
}

interface ProjectFormProps extends StackProps {}

export const ProjectForm = forwardRef<HTMLDivElement, ProjectFormProps>(
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
