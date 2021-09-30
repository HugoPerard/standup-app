import { ButtonGroup, IconButton } from '@chakra-ui/react';
import { NavbarElementProps } from 'react-day-picker';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Navbar: React.FC<NavbarElementProps> = ({
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <ButtonGroup
      size="sm"
      variant="@primary"
      position="absolute"
      right={6}
      top={4}
    >
      <IconButton
        aria-label="Mois précédent"
        icon={<FiChevronLeft fontSize="sm" />}
        float="right"
        onClick={() => onPreviousClick()}
      />
      <IconButton
        aria-label="Mois suivant"
        icon={<FiChevronRight fontSize="sm" />}
        float="right"
        onClick={() => onNextClick()}
      />
    </ButtonGroup>
  );
};
