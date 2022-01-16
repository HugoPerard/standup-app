import { forwardRef } from 'react';

import { Stack, StackProps } from '@chakra-ui/react';

import { FieldTextarea } from '@/components/FieldTextarea';

export interface HabitGoalFormValues {
  description?: string;
  people?: string[];
}

export const HabitGoalForm = forwardRef<HTMLElement, StackProps>(
  (props, ref) => {
    return (
      <Stack {...props}>
        <FieldTextarea
          ref={ref}
          name="description"
          label="Description"
          placeholder="Saisir la description de l'objectif"
          required="La description est requise"
          textareaProps={{ autoFocus: true }}
        />
      </Stack>
    );
  }
);
