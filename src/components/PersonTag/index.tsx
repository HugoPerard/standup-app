import {
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps,
} from '@chakra-ui/react';

import { useDarkMode } from '@/hooks/useDarkMode';

interface PersonTagProps extends TagProps {
  onRemove?(): void;
  isLoadingRemove?: boolean;
}

export const PersonTag: React.FC<PersonTagProps> = ({
  children,
  onRemove,
  isLoadingRemove = false,
  ...rest
}) => {
  const { colorModeValue } = useDarkMode();

  return (
    <Tag
      borderRadius="full"
      variant="solid"
      bg="brand.500"
      color={colorModeValue('gray.100', 'gray.800')}
      width="fit-content"
      overflow="hidden"
      {...rest}
    >
      <TagLabel maxW="30rem">{children}</TagLabel>
      {onRemove && isLoadingRemove && <Spinner ml={2} size="xs" />}
      {onRemove && !isLoadingRemove && <TagCloseButton onClick={onRemove} />}
    </Tag>
  );
};
