import { forwardRef } from 'react';

import { Stack, StackProps, Text } from '@chakra-ui/react';
import { useForm } from '@formiz/core';

import { useCurrentUser } from '@/app/auth/useAuth';
import { FieldInput } from '@/components';

import { Speaker } from '../standup.types';

export interface SpeakerFormValues extends Pick<Speaker, 'name' | 'photoURL'> {}

interface SpeakerFormProps extends StackProps {}

export const SpeakerForm = forwardRef<HTMLDivElement, SpeakerFormProps>(
  (props, ref) => {
    const { setFieldsValues } = useForm({ subscribe: { fields: false } });
    const { photoURL } = useCurrentUser();

    return (
      <Stack ref={ref} {...props}>
        <FieldInput
          name="name"
          label="Nom"
          required="Le nom est requis"
          inputProps={{ autoFocus: true }}
        />
        <FieldInput
          name="photoURL"
          label="Image (url)"
          helper={
            <Text
              onClick={() => setFieldsValues({ photoURL })}
              fontWeight="medium"
              cursor="pointer"
            >
              Compléter avec sa photo de profil
            </Text>
          }
        />
      </Stack>
    );
  }
);
