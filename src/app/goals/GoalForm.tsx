import { forwardRef } from 'react';

import { Stack, StackProps } from '@chakra-ui/react';

import { useSpeakers } from '@/app/standup/standup.firebase';
import { FieldMultiSelect } from '@/components';
import { FieldTextarea } from '@/components/FieldTextarea';

export interface GoalFormValues {
  description?: string;
  people?: string[];
}

interface GoalFormProps extends StackProps {}

export const GoalForm = forwardRef<HTMLElement, GoalFormProps>((props, ref) => {
  const { data: speakers } = useSpeakers();
  const peopleOptions = speakers?.map((speaker) => ({
    value: speaker?.name,
    label: speaker?.name,
  }));

  return (
    <Stack spacing={3} {...props}>
      <FieldTextarea
        ref={ref}
        name="description"
        label="Description"
        placeholder="Saisir la description de l'objectif"
        required="La description est requise"
      />
      <FieldMultiSelect
        name="people"
        label="Personnes concernées"
        placeholder="Sélectionner les personnes concernées"
        options={peopleOptions}
      />
    </Stack>
  );
});
