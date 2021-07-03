import { IconButton, Stack, StackProps, Text } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { useThankAdd } from '@/app/thanks/thanks.firebase';
import { Thank } from '@/app/thanks/thanks.types';

interface ThankGroupProps extends StackProps {
  name: string;
  thanks: Thank[];
  type: 'THANK' | 'TO_ADD';
  author: string;
}

export const ThankGroup: React.FC<ThankGroupProps> = ({
  name,
  thanks,
  type,
  author,
  ...rest
}) => {
  const { mutate: addThank } = useThankAdd();

  return (
    <Stack bg="gray.700" p={3} borderRadius="md" {...rest}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb="1"
      >
        <Text fontWeight="bold" mb={1} flex="1">
          {name}
        </Text>
        <IconButton
          aria-label="Ajouter un objectif"
          icon={<FiPlus />}
          variant="@primary"
          size="sm"
          onClick={() => {
            addThank({ author, type });
          }}
        />
      </Stack>
      <Stack>
        {thanks?.map((thank) => (
          <Text key={thank?.id}>{thank?.author}</Text>
        ))}
      </Stack>
    </Stack>
  );
};
