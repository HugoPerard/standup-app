import {
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps,
} from '@chakra-ui/react';

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
  return (
    <Tag
      borderRadius="full"
      variant="solid"
      bg="yellow.500"
      color="gray.800"
      width="fit-content"
      {...rest}
    >
      <TagLabel>{children}</TagLabel>
      {onRemove && isLoadingRemove && <Spinner ml={2} size="xs" />}
      {onRemove && !isLoadingRemove && <TagCloseButton onClick={onRemove} />}
    </Tag>
  );
};
