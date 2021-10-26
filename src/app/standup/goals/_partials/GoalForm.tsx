import { forwardRef } from 'react';

import { Stack, StackProps } from '@chakra-ui/react';

import { useCurrentUser } from '@/app/auth/useAuth';
import { useSpeakers } from '@/app/standup/standup/standup.firebase';
import { FieldMultiSelect } from '@/components';
import { FieldTextarea } from '@/components/FieldTextarea';

export interface GoalFormValues {
  description?: string;
  people?: string[];
}

interface GoalFormProps extends StackProps {}

export const GoalForm = forwardRef<HTMLElement, GoalFormProps>((props, ref) => {
  const currentUser = useCurrentUser();

  const { data: speakers } = useSpeakers();

  const peopleOptions = [
    ...(speakers || []).map((speaker) => ({
      value: speaker?.name,
      label: speaker?.name,
    })),
    { value: currentUser?.username, label: currentUser?.username },
  ];

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
      <FieldMultiSelect
        name="people"
        label="Personnes concernées"
        placeholder="Sélectionner les personnes concernées"
        options={peopleOptions}
        defaultValue={[currentUser?.username]}
      />
    </Stack>
  );
});
