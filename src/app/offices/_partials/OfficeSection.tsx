import { Stack, StackProps, Text, Wrap, Avatar } from '@chakra-ui/react';

import { useCurrentUser } from '@/app/auth/useAuth';
import { EmptyItem, PersonTag } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

interface OfficeSectionProps extends StackProps {
  title: string;
  presence: any[];
}

export const OfficeSection: React.FC<OfficeSectionProps> = ({
  title,
  presence,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();
  const { username } = useCurrentUser();

  return (
    <Stack
      role="group"
      bg={colorModeValue('gray.200', 'gray.600')}
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
            color: 'brand.500',
            textDecoration: 'underline',
          }}
        >
          {title}
        </Text>
      </Stack>
      {presence?.length > 0 ? (
        <Wrap>
          {presence
            ?.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map((person) => (
              <PersonTag
                bg={
                  username === person?.name
                    ? 'brand.500'
                    : colorModeValue('gray.400', 'gray.300')
                }
              >
                <Avatar
                  style={{ marginRight: '5px' }}
                  size="2xs"
                  name={person?.name}
                  src={person?.photoUrl}
                />
                {person?.name}
              </PersonTag>
            ))}
        </Wrap>
      ) : (
        <EmptyItem bg={colorModeValue('gray.300', 'gray.700')}>
          Personne n'est présent
        </EmptyItem>
      )}
    </Stack>
  );
};
