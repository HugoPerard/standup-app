import { Stack, StackProps, Text } from '@chakra-ui/react';

import { useCurrentUser } from '@/app/auth/useAuth';
import { EmptyItem } from '@/components';

interface OfficeSectionProps extends StackProps {
  title: string;
  presence: any[];
}

export const OfficeSection: React.FC<OfficeSectionProps> = ({
  title,
  presence,
  ...rest
}) => {
  const { username } = useCurrentUser();
  return (
    <Stack
      role="group"
      bg="gray.600"
      p={2}
      spacing={3}
      borderRadius="md"
      _hover={{
        cursor: 'pointer',
      }}
      {...rest}
    >
      <Stack direction="row">
        <Text
          fontWeight="bold"
          _groupHover={{
            color: 'yellow.500',
            textDecoration: 'underline',
          }}
        >
          {title}
        </Text>
      </Stack>
      {presence?.length > 0 ? (
        presence?.map((person) => (
          <Text
            fontWeight={username === person?.name ? 'bold' : 'medium'}
            color={username === person?.name ? 'yellow.500' : undefined}
          >
            {person?.name}
          </Text>
        ))
      ) : (
        <EmptyItem bg="gray.700">Personne n'est présent</EmptyItem>
      )}
    </Stack>
  );
};
