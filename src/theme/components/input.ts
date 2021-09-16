import { mode } from '@chakra-ui/theme-tools';

export default {
  variants: {
    outline: (props) => ({
      bg: mode('gray.100', 'gray.700')(props),
      color: mode('gray.800', 'gray.200')(props),
    }),
  },
};
